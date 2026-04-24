import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Col, Empty, Input, List, Row, Space, Spin, Typography, message as antdMessage } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useAuth } from '../context/AuthContext';
import { getConversations, getMessages, sendMessage } from '../services/messageService';
import { toAbsoluteUrl } from '../utils/transforms';

const { Title, Text } = Typography;
const { TextArea } = Input;

const MessagesPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const data = await getConversations();
      setConversations(data);
      if (!selectedConversation && data.length) {
        setSelectedConversation(data[0]);
      }
    } catch (err) {
      antdMessage.error(err.response?.data?.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    const loadThread = async () => {
      if (!selectedConversation?.other_user_id) {
        setMessages([]);
        return;
      }

      setThreadLoading(true);
      try {
        const data = await getMessages(selectedConversation.other_user_id);
        setMessages(data);
      } catch (err) {
        antdMessage.error(err.response?.data?.message || 'Failed to load messages');
      } finally {
        setThreadLoading(false);
      }
    };

    loadThread();
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const response = await sendMessage({
        receiverId: selectedConversation.other_user_id,
        productId: selectedConversation.product_id,
        message: messageText.trim(),
      });
      setMessages((items) => [...items, response.data]);
      setMessageText('');
      await loadConversations();
    } catch (err) {
      antdMessage.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <Title level={2}>Messages</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card>
            {loading ? (
              <Spin />
            ) : conversations.length ? (
              <List
                dataSource={conversations}
                renderItem={(item) => (
                  <List.Item
                    onClick={() => setSelectedConversation(item)}
                    style={{
                      cursor: 'pointer',
                      background: selectedConversation?.other_user_id === item.other_user_id ? '#f0f2f5' : 'transparent',
                      borderRadius: 8,
                      padding: '12px 8px',
                    }}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} src={toAbsoluteUrl(item.other_user_avatar)} />}
                      title={
                        <Space>
                          <Text strong>{item.other_user_name}</Text>
                          {item.unread_count > 0 ? (
                            <span style={{ background: '#1890ff', color: 'white', borderRadius: 10, minWidth: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                              {item.unread_count}
                            </span>
                          ) : null}
                        </Space>
                      }
                      description={
                        <div>
                          <Text type="secondary" ellipsis>{item.last_message}</Text>
                          <div><Text type="secondary" style={{ fontSize: 12 }}>{moment(item.last_message_time).fromNow()}</Text></div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No conversations yet" />
            )}
          </Card>
        </Col>

        <Col xs={24} md={16}>
          {selectedConversation ? (
            <Card>
              <Space style={{ marginBottom: 16 }}>
                <Avatar icon={<UserOutlined />} src={toAbsoluteUrl(selectedConversation.other_user_avatar)} />
                <div>
                  <Text strong>{selectedConversation.other_user_name}</Text>
                  <div><Text type="secondary" style={{ fontSize: 12 }}>Conversation</Text></div>
                </div>
              </Space>

              <div style={{ height: 400, overflowY: 'auto', marginBottom: 16, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
                {threadLoading ? (
                  <Spin />
                ) : messages.length ? (
                  messages.map((msg) => {
                    const isMe = msg.sender_id === user?.id;
                    return (
                      <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
                        {!isMe && <Avatar icon={<UserOutlined />} src={toAbsoluteUrl(msg.sender_avatar)} style={{ marginRight: 8 }} />}
                        <div style={{ maxWidth: '70%', background: isMe ? '#1890ff' : '#f0f2f5', color: isMe ? 'white' : 'black', padding: '8px 12px', borderRadius: 12 }}>
                          <div>{msg.message}</div>
                          <div style={{ fontSize: 10, marginTop: 4, opacity: 0.7 }}>{moment(msg.created_at).fromNow()}</div>
                        </div>
                        {isMe && <Avatar icon={<UserOutlined />} src={user?.avatar} style={{ marginLeft: 8 }} />}
                      </div>
                    );
                  })
                ) : (
                  <Empty description="No messages in this conversation" />
                )}
              </div>

              <Space.Compact style={{ width: '100%' }}>
                <TextArea
                  rows={2}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  onPressEnter={(e) => {
                    if (e.shiftKey) return;
                    e.preventDefault();
                    handleSendMessage();
                  }}
                />
                <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage} loading={sending}>
                  Send
                </Button>
              </Space.Compact>
            </Card>
          ) : (
            <Card style={{ textAlign: 'center', padding: 48 }}>
              <Text type="secondary">Select a conversation to start messaging</Text>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default MessagesPage;
