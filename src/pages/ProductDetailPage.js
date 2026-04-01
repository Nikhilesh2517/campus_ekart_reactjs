import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Row, Col, Image, Card, Typography, Tag, Button, Space, 
  Divider, Rate, Avatar, Input, List, message, Badge, Tabs, 
  Statistic, Tooltip, Modal
} from 'antd';
import { 
  HeartOutlined, 
  HeartFilled, 
  ShareAltOutlined, 
  FlagOutlined, 
  MessageOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  StarFilled,
  DollarOutlined,
  BookOutlined
} from '@ant-design/icons';
import { formatPrice } from '../utils/helpers';
import defaultAvatar from '../assets/images/default-avatar.svg';
import bookDetail1 from '../assets/images/book-detail-1.svg';
import bookDetail2 from '../assets/images/book-detail-2.svg';
import bookDetail3 from '../assets/images/book-detail-3.svg';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [messageText, setMessageText] = useState('');

  // Mock product data
  const product = {
    id: parseInt(id),
    title: "Calculus: Early Transcendentals",
    price: 45,
    originalPrice: 120,
    condition: "Like New",
    seller: {
      name: "Sarah Johnson",
      avatar: defaultAvatar,
      rating: 4.8,
      totalSales: 24,
      memberSince: "2023",
      verified: true,
    },
    images: [
      bookDetail1,
      bookDetail2,
      bookDetail3,
    ],
    description: "This textbook is in excellent condition with no markings or highlights. Used for one semester only. Includes access code for online resources. Perfect for Calculus I and II courses.",
    specifications: {
      edition: "9th Edition",
      author: "James Stewart",
      publisher: "Cengage Learning",
      year: "2021",
      isbn: "978-1337613927",
      pages: "1368",
    },
    location: "Main Campus Library",
    postedDate: "2 days ago",
    views: 156,
    favorites: 23,
    category: "Books",
  };

  const handleMessage = () => {
    if (!localStorage.getItem('token')) {
      message.warning('Please login to message the seller');
      navigate('/login');
      return;
    }
    setMessageModalVisible(true);
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      message.error('Please enter a message');
      return;
    }
    message.success('Message sent successfully!');
    setMessageModalVisible(false);
    setMessageText('');
  };

  const handleMakeOffer = () => {
    if (!localStorage.getItem('token')) {
      message.warning('Please login to make an offer');
      navigate('/login');
      return;
    }
    message.info('Offer feature coming soon!');
  };

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card>
            <Image.PreviewGroup>
              <Image src={product.images[0]} alt={product.title} style={{ width: '100%', borderRadius: 8 }} />
            </Image.PreviewGroup>
            <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
              {product.images.slice(1).map((img, idx) => (
                <Col span={8} key={idx}>
                  <Image src={img} style={{ width: '100%', borderRadius: 8, cursor: 'pointer' }} />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Tag color="blue">{product.category}</Tag>
                <Tag color={product.condition === 'Like New' ? 'green' : 'orange'}>
                  {product.condition}
                </Tag>
              </div>
              <Space>
                <Tooltip title="Save to favorites">
                  <Button
                    type="text"
                    icon={liked ? <HeartFilled style={{ color: '#f5222d' }} /> : <HeartOutlined />}
                    onClick={() => setLiked(!liked)}
                  />
                </Tooltip>
                <Tooltip title="Share">
                  <Button type="text" icon={<ShareAltOutlined />} />
                </Tooltip>
                <Tooltip title="Report">
                  <Button type="text" icon={<FlagOutlined />} />
                </Tooltip>
              </Space>
            </div>

            <Title level={2} style={{ marginTop: 8, marginBottom: 8 }}>
              {product.title}
            </Title>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
              <Text strong style={{ fontSize: 32, color: '#1890ff' }}>
                {formatPrice(product.price)}
              </Text>
              <Text delete type="secondary" style={{ fontSize: 18 }}>
                {formatPrice(product.originalPrice)}
              </Text>
              <Tag color="success">Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</Tag>
            </div>

            <Divider />

            <div style={{ marginBottom: 24 }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar size={48} src={product.seller.avatar} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Text strong>{product.seller.name}</Text>
                      {product.seller.verified && (
                        <Tooltip title="Verified Student">
                          <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        </Tooltip>
                      )}
                    </div>
                    <Space size="small">
                      <Rate disabled defaultValue={product.seller.rating} style={{ fontSize: 12 }} />
                      <Text type="secondary">({product.seller.rating})</Text>
                    </Space>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Member since {product.seller.memberSince} • {product.seller.totalSales} sales
                      </Text>
                    </div>
                  </div>
                </div>
              </Space>
            </div>

            <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <EnvironmentOutlined />
                <Text>{product.location}</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CalendarOutlined />
                <Text>Posted {product.postedDate}</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SafetyOutlined />
                <Text>Campus pickup only</Text>
              </div>
            </Space>

            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" size="large" block onClick={handleMessage}>
                <MessageOutlined /> Contact Seller
              </Button>
              <Button size="large" block onClick={handleMakeOffer}>
                Make an Offer
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="Details" key="details">
                <Paragraph>{product.description}</Paragraph>
                <Divider />
                <Title level={4}>Specifications</Title>
                <Row gutter={[16, 16]}>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <Col span={12} key={key}>
                      <Text strong>{key.charAt(0).toUpperCase() + key.slice(1)}: </Text>
                      <Text>{value}</Text>
                    </Col>
                  ))}
                </Row>
              </TabPane>
              
              <TabPane tab="Seller Info" key="seller">
                <div style={{ textAlign: 'center', padding: 24 }}>
                  <Avatar size={80} src={product.seller.avatar} />
                  <Title level={3} style={{ marginTop: 16 }}>{product.seller.name}</Title>
                  <Rate disabled defaultValue={product.seller.rating} />
                  <Text type="secondary">({product.seller.rating} stars)</Text>
                  
                  <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                    <Col span={8}>
                      <Statistic title="Total Sales" value={product.seller.totalSales} prefix={<DollarOutlined />} />
                    </Col>
                    <Col span={8}>
                      <Statistic title="Member Since" value={product.seller.memberSince} />
                    </Col>
                    <Col span={8}>
                      <Statistic title="Response Rate" value={98} suffix="%" />
                    </Col>
                  </Row>
                </div>
              </TabPane>
              
              <TabPane tab="Reviews" key="reviews">
                <List
                  itemLayout="horizontal"
                  dataSource={[1, 2, 3]}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar>U</Avatar>}
                        title={
                          <div>
                            <Text strong>John Doe</Text>
                            <Rate disabled defaultValue={5} style={{ fontSize: 12, marginLeft: 8 }} />
                          </div>
                        }
                        description="Great seller! Book was in perfect condition as described."
                      />
                    </List.Item>
                  )}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Message Seller"
        open={messageModalVisible}
        onOk={handleSendMessage}
        onCancel={() => setMessageModalVisible(false)}
        okText="Send"
      >
        <TextArea
          rows={4}
          placeholder="Write your message here..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default ProductDetailPage;
