import React from 'react';
import { Card, Tabs, List, Avatar, Tag, Typography, Space, Button, Rate, Modal } from 'antd';
import { ShoppingOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { formatPrice } from '../utils/helpers';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const OrdersPage = () => {
  const orders = {
    active: [
      {
        id: 1,
        title: "Calculus Textbook",
        price: 45,
        seller: "Sarah Johnson",
        date: "Nov 15, 2024",
        status: "pending",
        image: null,
      },
    ],
    completed: [
      {
        id: 2,
        title: "Scientific Calculator",
        price: 35,
        seller: "Michael Chen",
        date: "Nov 10, 2024",
        status: "completed",
        image: null,
      },
    ],
  };

  return (
    <div>
      <Title level={2}>My Orders</Title>
      
      <Card>
        <Tabs defaultActiveKey="active">
          <TabPane tab={<span><ClockCircleOutlined /> Active Orders</span>} key="active">
            <List
              itemLayout="horizontal"
              dataSource={orders.active}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button type="link">Message Seller</Button>,
                    <Button type="link">Cancel Order</Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<ShoppingOutlined />} />}
                    title={<a href={`/product/${item.id}`}>{item.title}</a>}
                    description={
                      <Space direction="vertical" size="small">
                        <Text>Seller: {item.seller}</Text>
                        <Text>Ordered on: {item.date}</Text>
                        <Tag color="processing">Pending Confirmation</Tag>
                      </Space>
                    }
                  />
                  <div>
                    <Text strong>{formatPrice(item.price)}</Text>
                  </div>
                </List.Item>
              )}
            />
          </TabPane>
          
          <TabPane tab={<span><CheckCircleOutlined /> Completed</span>} key="completed">
            <List
              itemLayout="horizontal"
              dataSource={orders.completed}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button type="link">Leave Review</Button>,
                    <Button type="link">Report Issue</Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<ShoppingOutlined />} />}
                    title={<a href={`/product/${item.id}`}>{item.title}</a>}
                    description={
                      <Space direction="vertical" size="small">
                        <Text>Seller: {item.seller}</Text>
                        <Text>Completed on: {item.date}</Text>
                        <Tag color="success">Completed</Tag>
                      </Space>
                    }
                  />
                  <div>
                    <Text strong>{formatPrice(item.price)}</Text>
                  </div>
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default OrdersPage;
