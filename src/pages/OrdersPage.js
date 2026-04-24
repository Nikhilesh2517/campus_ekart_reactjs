import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Empty, List, Space, Spin, Tabs, Tag, Typography, message } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ShoppingOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { confirmOrder, getOrders, updateOrderStatus } from '../services/orderService';
import { sendMessage } from '../services/messageService';
import { normalizeOrder } from '../utils/transforms';
import { formatPrice } from '../utils/helpers';

const { Title, Text } = Typography;

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data.map(normalizeOrder));
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleConfirm = async (order) => {
    const userType = order.buyer_id === user?.id ? 'buyer' : 'seller';
    try {
      await confirmOrder(order.id, userType);
      message.success('Order confirmation saved');
      await loadOrders();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to confirm order');
    }
  };

  const handleCancel = async (order) => {
    try {
      await updateOrderStatus(order.id, 'cancelled');
      message.success('Order cancelled');
      await loadOrders();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleMessage = async (order) => {
    const receiverId = order.buyer_id === user?.id ? order.seller_id : order.buyer_id;
    try {
      await sendMessage({
        receiverId,
        productId: order.product_id,
        message: `Hi, I am contacting you about order #${order.id} for ${order.productTitle}.`,
      });
      message.success('Message sent');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to message user');
    }
  };

  const activeOrders = orders.filter((order) => !['completed', 'cancelled'].includes(order.status));
  const completedOrders = orders.filter((order) => ['completed', 'cancelled'].includes(order.status));

  const renderOrder = (order) => (
    <List.Item
      actions={[
        <Button type="link" onClick={() => handleMessage(order)} key="message">Message</Button>,
        !['completed', 'cancelled'].includes(order.status) ? (
          <Button type="link" onClick={() => handleConfirm(order)} key="confirm">Confirm Handover</Button>
        ) : null,
        order.status === 'pending' ? (
          <Button type="link" danger onClick={() => handleCancel(order)} key="cancel">Cancel</Button>
        ) : null,
      ].filter(Boolean)}
    >
      <List.Item.Meta
        avatar={<Avatar icon={<ShoppingOutlined />} src={order.productImages?.[0]} />}
        title={<Link to={`/product/${order.product_id}`}>{order.productTitle}</Link>}
        description={
          <Space direction="vertical" size="small">
            <Text>With: {order.otherPartyName || order.sellerName || 'User'}</Text>
            <Text>Created: {order.created_at ? moment(order.created_at).format('DD MMM YYYY') : 'Unknown'}</Text>
            {order.meetup_location ? <Text>Meetup: {order.meetup_location}</Text> : null}
            <Tag color={order.status === 'completed' ? 'success' : order.status === 'cancelled' ? 'red' : 'processing'}>
              {order.status}
            </Tag>
          </Space>
        }
      />
      <Text strong>{formatPrice(order.amount)}</Text>
    </List.Item>
  );

  return (
    <div>
      <Title level={2}>My Orders</Title>

      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Tabs
            defaultActiveKey="active"
            items={[
              {
                key: 'active',
                label: (
                  <span><ClockCircleOutlined /> Active Orders</span>
                ),
                children: activeOrders.length ? <List itemLayout="horizontal" dataSource={activeOrders} renderItem={renderOrder} /> : <Empty description="No active orders" />,
              },
              {
                key: 'completed',
                label: (
                  <span><CheckCircleOutlined /> Completed</span>
                ),
                children: completedOrders.length ? <List itemLayout="horizontal" dataSource={completedOrders} renderItem={renderOrder} /> : <Empty description="No completed orders" />,
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
};

export default OrdersPage;
