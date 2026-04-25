import React, { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Popconfirm,
  Rate,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  BankOutlined,
  BookOutlined,
  CalendarOutlined,
  CameraOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getSavedItems,
  getUserListings,
  getUserProfile,
  updateUserProfile,
} from '../services/userService';
import { deleteProduct, updateProduct, unsaveProduct } from '../services/productService';
import { normalizeProduct, normalizeUser } from '../utils/transforms';
import { formatPrice, getApiErrorMessage } from '../utils/helpers';
import { CATEGORIES, CONDITIONS } from '../utils/constants';
import defaultAvatar from '../assets/images/default-avatar.svg';

const { Title, Text } = Typography;

const yearOptions = [
  { value: '1', label: '1st Year' },
  { value: '2', label: '2nd Year' },
  { value: '3', label: '3rd Year' },
  { value: '4', label: '4th Year' },
  { value: 'postgrad', label: 'Postgraduate' },
];

const ProfilePage = () => {
  const { updateUser } = useAuth();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [activeTab, setActiveTab] = useState('listings');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();
  const [productForm] = Form.useForm();

  const hydrateProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const [profileData, listingData, savedData] = await Promise.all([
        getUserProfile(),
        getUserListings(),
        getSavedItems(),
      ]);

      const normalizedUser = normalizeUser(profileData);
      setUser(normalizedUser);
      updateUser(normalizedUser);
      setListings(listingData.map(normalizeProduct));
      setSavedItems(savedData.map(normalizeProduct));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hydrateProfile();
  }, []);

  const openEditModal = () => {
    form.setFieldsValue({
      full_name: user?.full_name || user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      university: user?.university || '',
      course: user?.course || '',
      student_id: user?.student_id || user?.studentId || '',
      year_of_study: user?.year_of_study || user?.yearOfStudy || '',
    });
    setEditModalVisible(true);
  };

  const handleEditProfile = async (values) => {
    setSaving(true);

    try {
      const response = await updateUserProfile(values);
      const normalizedUser = normalizeUser(response.user);
      setUser((current) => normalizeUser({ ...current, ...normalizedUser }));
      updateUser(normalizedUser);
      message.success(response.message || 'Profile updated successfully');
      setEditModalVisible(false);
      await hydrateProfile();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSaved = async (productId) => {
    try {
      await unsaveProduct(productId);
      setSavedItems((items) => items.filter((item) => item.id !== productId));
      message.success('Removed from saved items');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to remove saved item');
    }
  };

  const openProductModal = (product) => {
    setEditingProduct(product);
    productForm.setFieldsValue({
      title: product.title,
      description: product.description,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      category: product.category,
      condition: product.condition,
      location: product.location,
      status: product.status || 'active',
    });
    setProductModalVisible(true);
  };

  const handleUpdateProduct = async (values) => {
    if (!editingProduct) return;

    setSaving(true);
    try {
      const response = await updateProduct(editingProduct.id, values);
      const updatedProduct = normalizeProduct(response.product);
      setListings((items) => items.map((item) => (item.id === updatedProduct.id ? updatedProduct : item)));
      message.success(response.message || 'Product updated successfully');
      setProductModalVisible(false);
      setEditingProduct(null);
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to update product'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      setListings((items) => items.filter((item) => item.id !== productId));
      message.success('Product deleted successfully');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const memberSince = user?.created_at ? moment(user.created_at).format('YYYY') : 'Unknown';
  const stats = user?.stats || {};

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {error ? <Alert message={error} type="error" showIcon style={{ marginBottom: 24 }} /> : null}

      <Card>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Badge
            count={<CameraOutlined style={{ background: '#1890ff', borderRadius: '50%', padding: 4 }} />}
            offset={[-10, 10]}
          >
            <Avatar size={120} icon={<UserOutlined />} src={user?.avatar || defaultAvatar} />
          </Badge>
          <Title level={2} style={{ marginTop: 16, marginBottom: 4 }}>
            {user?.fullName || user?.name}
          </Title>
          <Space>
            <Tag color={user?.isVerified ? 'blue' : 'default'}>
              {user?.isVerified ? 'Verified Student' : 'Not Verified'}
            </Tag>
            <Rate disabled value={Number(user?.rating || 0)} allowHalf style={{ fontSize: 14 }} />
          </Space>
        </div>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Statistic title="Total Listings" value={stats.listings || listings.length} prefix={<ShoppingOutlined />} />
          </Col>
          <Col xs={24} md={8}>
            <Statistic title="Successful Sales" value={stats.sales || 0} prefix={<ShoppingOutlined />} />
          </Col>
          <Col xs={24} md={8}>
            <Statistic title="Saved Items" value={savedItems.length} prefix={<HeartOutlined />} />
          </Col>
        </Row>

        <Divider />

        <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: 24 }}>
          <Space>
            <MailOutlined />
            <Text>{user?.email}</Text>
          </Space>
          <Space>
            <PhoneOutlined />
            <Text>{user?.phone || 'Not provided'}</Text>
          </Space>
          <Space>
            <EnvironmentOutlined />
            <Text>{user?.location || 'Not provided'}</Text>
          </Space>
          <Space>
            <BankOutlined />
            <Text>{user?.university || 'Not provided'}</Text>
          </Space>
          <Space>
            <BookOutlined />
            <Text>{user?.course || 'Not provided'}</Text>
          </Space>
          <Space>
            <IdcardOutlined />
            <Text>{user?.studentId || 'Not provided'}</Text>
          </Space>
          <Space>
            <CalendarOutlined />
            <Text>Member since {memberSince}</Text>
          </Space>
        </Space>

        <Button type="primary" block onClick={openEditModal}>
          Edit Profile
        </Button>
      </Card>

      <Card style={{ marginTop: 24 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'listings',
              label: (
                <span>
                  <ShoppingOutlined /> My Listings
                </span>
              ),
              children: listings.length ? (
                <List
                  itemLayout="horizontal"
                  dataSource={listings}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Link to={`/product/${item.id}`} key="view">
                          <Button type="link">View</Button>
                        </Link>,
                        <Button type="link" onClick={() => openProductModal(item)} key="edit">
                          Edit
                        </Button>,
                        <Popconfirm
                          title="Delete product?"
                          description="This will permanently remove the listing."
                          onConfirm={() => handleDeleteProduct(item.id)}
                          okText="Delete"
                          okButtonProps={{ danger: true }}
                          key="delete"
                        >
                          <Button type="link" danger>Delete</Button>
                        </Popconfirm>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<ShoppingOutlined />} src={item.images?.[0]} />}
                        title={<Link to={`/product/${item.id}`}>{item.title}</Link>}
                        description={
                          <Space wrap>
                            <Tag color={item.status === 'active' ? 'green' : 'default'}>
                              {(item.status || 'active').toUpperCase()}
                            </Tag>
                            <Text>{formatPrice(item.price)}</Text>
                            <Text type="secondary">{item.condition || 'Condition not set'}</Text>
                            <Text type="secondary">{item.views || 0} views</Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="No listings yet" />
              ),
            },
            {
              key: 'saved',
              label: (
                <span>
                  <HeartOutlined /> Saved Items
                </span>
              ),
              children: savedItems.length ? (
                <List
                  itemLayout="horizontal"
                  dataSource={savedItems}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button type="link" danger onClick={() => handleRemoveSaved(item.id)} key="remove">
                          Remove
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<HeartOutlined />} src={item.images?.[0]} />}
                        title={<Link to={`/product/${item.id}`}>{item.title}</Link>}
                        description={
                          <Space wrap>
                            <Text>{formatPrice(item.price)}</Text>
                            <Text type="secondary">{item.condition || 'Condition not set'}</Text>
                            {item.location ? <Text type="secondary">{item.location}</Text> : null}
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="No saved items" />
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title="Edit Profile"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleEditProfile}>
          <Form.Item label="Full Name" name="full_name" rules={[{ required: true, message: 'Full name is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Location" name="location">
            <Input />
          </Form.Item>
          <Form.Item label="University" name="university">
            <Input />
          </Form.Item>
          <Form.Item label="Course" name="course">
            <Input />
          </Form.Item>
          <Form.Item label="Student ID" name="student_id">
            <Input />
          </Form.Item>
          <Form.Item label="Year of Study" name="year_of_study">
            <Select allowClear options={yearOptions} placeholder="Select year" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={saving}>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Product"
        open={productModalVisible}
        onCancel={() => {
          setProductModalVisible(false);
          setEditingProduct(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={productForm} layout="vertical" onFinish={handleUpdateProduct}>
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Title is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: 'Price is required' },
              { type: 'number', min: 0.01, message: 'Price must be greater than 0' },
            ]}
          >
            <InputNumber min={0.01} style={{ width: '100%' }} prefix="£" />
          </Form.Item>
          <Form.Item
            label="Original Price"
            name="originalPrice"
            rules={[
              { type: 'number', min: 0.01, message: 'Original price must be greater than 0' },
            ]}
          >
            <InputNumber min={0.01} style={{ width: '100%' }} prefix="£" />
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select options={CATEGORIES.map((item) => ({ value: item.value, label: item.label }))} />
          </Form.Item>
          <Form.Item label="Condition" name="condition" rules={[{ required: true, message: 'Condition is required' }]}>
            <Select options={CONDITIONS.map((item) => ({ value: item.label, label: item.label }))} />
          </Form.Item>
          <Form.Item label="Pickup Location" name="location">
            <Input />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select
              options={[
                { value: 'active', label: 'Active' },
                { value: 'sold', label: 'Sold' },
                { value: 'expired', label: 'Expired' },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={saving}>
              Save Product
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
