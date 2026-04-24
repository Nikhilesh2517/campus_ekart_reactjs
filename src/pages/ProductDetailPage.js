import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Image,
  Input,
  Modal,
  Rate,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FlagOutlined,
  HeartFilled,
  HeartOutlined,
  MessageOutlined,
  SafetyOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { createOrder } from '../services/orderService';
import { getProductById, saveProduct, unsaveProduct } from '../services/productService';
import { sendMessage } from '../services/messageService';
import { createReport } from '../services/reportService';
import { CATEGORIES } from '../utils/constants';
import { normalizeProduct } from '../utils/transforms';
import { formatPrice } from '../utils/helpers';
import defaultAvatar from '../assets/images/default-avatar.svg';
import textbookImage from '../assets/images/textbook.svg';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [meetupLocation, setMeetupLocation] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(normalizeProduct(data));
      } catch (err) {
        message.error(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const requireLogin = () => {
    if (!localStorage.getItem('token')) {
      message.warning('Please login first');
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!requireLogin()) return;

    try {
      if (liked) {
        await unsaveProduct(product.id);
      } else {
        await saveProduct(product.id);
      }
      setLiked(!liked);
    } catch (err) {
      message.error(err.response?.data?.message || 'Unable to update saved item');
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      message.error('Please enter a message');
      return;
    }

    setSubmitting(true);
    try {
      await sendMessage({
        receiverId: product.sellerId,
        productId: product.id,
        message: messageText.trim(),
      });
      message.success('Message sent successfully');
      setMessageModalVisible(false);
      setMessageText('');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!meetupLocation.trim()) {
      message.error('Please enter a meetup location');
      return;
    }

    setSubmitting(true);
    try {
      await createOrder({ productId: product.id, meetupLocation: meetupLocation.trim() });
      message.success('Order created successfully');
      setOrderModalVisible(false);
      navigate('/orders');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason) {
      message.error('Please select a report reason');
      return;
    }

    setSubmitting(true);
    try {
      const response = await createReport({
        productId: product.id,
        reason: reportReason,
        description: reportDescription,
      });
      message.success(response.message || 'Report submitted successfully');
      setReportModalVisible(false);
      setReportReason('');
      setReportDescription('');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return <Empty description="Product not found" />;
  }

  const categoryLabel = CATEGORIES.find((item) => item.value === product.category)?.label || product.category;
  const images = product.images?.length ? product.images : [textbookImage];
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card>
            <Image.PreviewGroup>
              <Image src={images[0]} alt={product.title} style={{ width: '100%', borderRadius: 8 }} />
              <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
                {images.slice(1).map((img) => (
                  <Col span={8} key={img}>
                    <Image src={img} style={{ width: '100%', borderRadius: 8, cursor: 'pointer' }} />
                  </Col>
                ))}
              </Row>
            </Image.PreviewGroup>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Tag color="blue">{categoryLabel}</Tag>
                <Tag color={product.condition === 'Like New' ? 'green' : 'orange'}>{product.condition}</Tag>
                <Tag color={product.status === 'active' ? 'green' : 'default'}>{product.status}</Tag>
              </div>
              <Space>
                <Tooltip title="Save">
                  <Button type="text" icon={liked ? <HeartFilled style={{ color: '#f5222d' }} /> : <HeartOutlined />} onClick={handleSave} />
                </Tooltip>
                <Tooltip title="Share">
                  <Button type="text" icon={<ShareAltOutlined />} onClick={() => navigator.clipboard?.writeText(window.location.href)} />
                </Tooltip>
                <Tooltip title="Report">
                  <Button type="text" icon={<FlagOutlined />} onClick={() => requireLogin() && setReportModalVisible(true)} />
                </Tooltip>
              </Space>
            </div>

            <Title level={2} style={{ marginTop: 8, marginBottom: 8 }}>
              {product.title}
            </Title>

            <Space align="baseline" style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 32, color: '#1890ff' }}>{formatPrice(product.price)}</Text>
              {product.originalPrice ? <Text delete type="secondary" style={{ fontSize: 18 }}>{formatPrice(product.originalPrice)}</Text> : null}
              {discount ? <Tag color="success">Save {discount}%</Tag> : null}
            </Space>

            <Divider />

            <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: 24 }}>
              <Space>
                <Avatar size={48} src={product.sellerAvatar || defaultAvatar} />
                <div>
                  <Space>
                    <Text strong>{product.sellerName}</Text>
                    {product.sellerVerified ? (
                      <Tooltip title="Verified Student">
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      </Tooltip>
                    ) : null}
                  </Space>
                  <div>
                    <Rate disabled value={Number(product.sellerRating || 0)} allowHalf style={{ fontSize: 12 }} />
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Member since {product.sellerMemberSince ? moment(product.sellerMemberSince).format('YYYY') : 'Unknown'} · {product.sellerSales || 0} sales
                  </Text>
                </div>
              </Space>
              <Space>
                <EnvironmentOutlined />
                <Text>{product.location || 'Campus pickup'}</Text>
              </Space>
              <Space>
                <CalendarOutlined />
                <Text>Posted {product.created_at ? moment(product.created_at).fromNow() : 'recently'}</Text>
              </Space>
              <Space>
                <SafetyOutlined />
                <Text>Meet on campus and confirm the order after handover</Text>
              </Space>
            </Space>

            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" size="large" block onClick={() => requireLogin() && setMessageModalVisible(true)}>
                <MessageOutlined /> Contact Seller
              </Button>
              <Button size="large" block disabled={product.status !== 'active'} onClick={() => requireLogin() && setOrderModalVisible(true)}>
                Create Order
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }}>
        <Tabs
          defaultActiveKey="details"
          items={[
            {
              key: 'details',
              label: 'Details',
              children: <Paragraph>{product.description || 'No description provided.'}</Paragraph>,
            },
            {
              key: 'seller',
              label: 'Seller Info',
              children: (
                <div style={{ textAlign: 'center', padding: 24 }}>
                  <Avatar size={80} src={product.sellerAvatar || defaultAvatar} />
                  <Title level={3} style={{ marginTop: 16 }}>{product.sellerName}</Title>
                  <Rate disabled value={Number(product.sellerRating || 0)} allowHalf />
                  <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                    <Col span={8}>
                      <Statistic title="Completed Sales" value={product.sellerSales || 0} prefix={<DollarOutlined />} />
                    </Col>
                    <Col span={8}>
                      <Statistic title="Member Since" value={product.sellerMemberSince ? moment(product.sellerMemberSince).format('YYYY') : 'Unknown'} />
                    </Col>
                    <Col span={8}>
                      <Statistic title="Saved Count" value={product.savedCount || 0} />
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              key: 'reviews',
              label: 'Reviews',
              children: <Empty description="No reviews yet" />,
            },
          ]}
        />
      </Card>

      <Modal title="Message Seller" open={messageModalVisible} onOk={handleSendMessage} confirmLoading={submitting} onCancel={() => setMessageModalVisible(false)} okText="Send">
        <TextArea rows={4} placeholder="Write your message here..." value={messageText} onChange={(e) => setMessageText(e.target.value)} />
      </Modal>

      <Modal title="Create Order" open={orderModalVisible} onOk={handleCreateOrder} confirmLoading={submitting} onCancel={() => setOrderModalVisible(false)} okText="Create Order">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>Confirm your meetup details with the seller before completing the trade.</Text>
          <Input placeholder="Meetup location" value={meetupLocation} onChange={(event) => setMeetupLocation(event.target.value)} />
        </Space>
      </Modal>

      <Modal title="Report Listing" open={reportModalVisible} onOk={handleReport} confirmLoading={submitting} onCancel={() => setReportModalVisible(false)} okText="Submit Report">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select
            placeholder="Select reason"
            value={reportReason || undefined}
            onChange={setReportReason}
            options={[
              { value: 'Misleading listing', label: 'Misleading listing' },
              { value: 'Prohibited item', label: 'Prohibited item' },
              { value: 'Suspicious seller', label: 'Suspicious seller' },
              { value: 'Harassment or abuse', label: 'Harassment or abuse' },
              { value: 'Other', label: 'Other' },
            ]}
          />
          <TextArea rows={4} placeholder="Add details for moderation review" value={reportDescription} onChange={(event) => setReportDescription(event.target.value)} />
        </Space>
      </Modal>
    </div>
  );
};

export default ProductDetailPage;
