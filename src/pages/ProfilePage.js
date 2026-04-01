import React, { useState, useEffect } from 'react';
import { 
  Card, Tabs, List, Avatar, Typography, Button, Space, 
  Tag, Rate, Statistic, Row, Col, Divider, Modal, Form, 
  Input, message, Upload, Badge
} from 'antd';
import { 
  UserOutlined, 
  ShoppingOutlined, 
  HeartOutlined, 
  SettingOutlined,
  CameraOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { formatPrice } from '../utils/helpers';
import defaultAvatar from '../assets/images/default-avatar.svg';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('listings');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      form.setFieldsValue(JSON.parse(userData));
    } else {
      setUser({
        name: 'John Doe',
        email: 'john@university.edu',
        phone: '+1 234 567 8900',
        location: 'Main Campus',
        memberSince: '2023',
        avatar: null,
        listings: 12,
        sales: 8,
        rating: 4.9,
      });
    }
  }, [form]);

  const listings = [
    {
      id: 1,
      title: "Calculus Textbook",
      price: 45,
      condition: "Like New",
      views: 124,
      status: "active",
    },
    {
      id: 2,
      title: "MacBook Pro",
      price: 850,
      condition: "Good",
      views: 567,
      status: "active",
    },
    {
      id: 3,
      title: "Scientific Calculator",
      price: 35,
      condition: "Excellent",
      views: 89,
      status: "sold",
    },
  ];

  const savedItems = [
    {
      id: 1,
      title: "Physics Lab Kit",
      price: 50,
      seller: "Emily Chen",
      savedDate: "2 days ago",
    },
  ];

  const handleEditProfile = async (values) => {
    try {
      // Simulate API call
      setTimeout(() => {
        setUser({ ...user, ...values });
        localStorage.setItem('user', JSON.stringify({ ...user, ...values }));
        message.success('Profile updated successfully');
        setEditModalVisible(false);
      }, 1000);
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return false;
      }
      return true;
    },
    onChange: (info) => {
      if (info.file.status === 'done') {
        message.success('Avatar uploaded successfully');
      }
    },
  };

  return (
    <div>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Badge
            count={<CameraOutlined style={{ background: '#1890ff', borderRadius: '50%', padding: 4 }} />}
            offset={[-10, 10]}
          >
            <Avatar size={120} icon={<UserOutlined />} src={user?.avatar || defaultAvatar} />
          </Badge>
          <Title level={2} style={{ marginTop: 16, marginBottom: 4 }}>
            {user?.name}
          </Title>
          <Space>
            <Tag color="blue">Verified Student</Tag>
            <Rate disabled defaultValue={user?.rating} style={{ fontSize: 14 }} />
          </Space>
        </div>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Statistic title="Total Listings" value={user?.listings} prefix={<ShoppingOutlined />} />
          </Col>
          <Col xs={24} md={8}>
            <Statistic title="Successful Sales" value={user?.sales} prefix={<ShoppingOutlined />} />
          </Col>
          <Col xs={24} md={8}>
            <Statistic title="Items Sold" value={user?.sales} />
          </Col>
        </Row>

        <Divider />

        <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MailOutlined />
            <Text>{user?.email}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PhoneOutlined />
            <Text>{user?.phone || 'Not provided'}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <EnvironmentOutlined />
            <Text>{user?.location}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CalendarOutlined />
            <Text>Member since {user?.memberSince}</Text>
          </div>
        </Space>

        <Button type="primary" block onClick={() => setEditModalVisible(true)}>
          Edit Profile
        </Button>
      </Card>

      <Card style={{ marginTop: 24 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={<span><ShoppingOutlined /> My Listings</span>} key="listings">
            <List
              itemLayout="horizontal"
              dataSource={listings}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button type="link">Edit</Button>,
                    <Button type="link" danger>Delete</Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<ShoppingOutlined />} />}
                    title={<a href={`/product/${item.id}`}>{item.title}</a>}
                    description={
                      <Space>
                        <Tag color={item.status === 'active' ? 'green' : 'default'}>
                          {item.status.toUpperCase()}
                        </Tag>
                        <Text>{formatPrice(item.price)}</Text>
                        <Text type="secondary">{item.condition}</Text>
                        <Text type="secondary">{item.views} views</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>
          
          <TabPane tab={<span><HeartOutlined /> Saved Items</span>} key="saved">
            <List
              itemLayout="horizontal"
              dataSource={savedItems}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button type="link">Remove</Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<HeartOutlined />} />}
                    title={<a href={`/product/${item.id}`}>{item.title}</a>}
                    description={
                      <Space>
                        <Text>{formatPrice(item.price)}</Text>
                        <Text type="secondary">Saved {item.savedDate}</Text>
                        <Text type="secondary">Seller: {item.seller}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>
          
          <TabPane tab={<span><SettingOutlined /> Settings</span>} key="settings">
            <Form layout="vertical">
              <Form.Item label="Email Notifications">
                <Space direction="vertical">
                  <Input type="checkbox" /> New messages
                  <Input type="checkbox" /> New offers
                  <Input type="checkbox" /> Sold items
                </Space>
              </Form.Item>
              <Form.Item label="Privacy">
                <Space direction="vertical">
                  <Input type="checkbox" /> Show email to buyers
                  <Input type="checkbox" /> Show phone number
                </Space>
              </Form.Item>
              <Button type="primary">Save Settings</Button>
            </Form>
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title="Edit Profile"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditProfile}
          initialValues={user}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Location" name="location">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
