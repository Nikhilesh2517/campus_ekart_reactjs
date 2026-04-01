import React, { useState } from 'react';
import { Card, Row, Col, List, Avatar, Input, Button, Space, Typography, Divider } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');

  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: null,
      lastMessage: "Is the book still available?",
      timestamp: "2 hours ago",
      unread: 2,
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: null,
      lastMessage: "Can we meet at the library?",
      timestamp: "Yesterday",
      unread: 0,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: null,
      lastMessage: "Thanks for the purchase!",
      timestamp: "2 days ago",
      unread: 0,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "Sarah Johnson",
      content: "Hi, is the Calculus textbook still available?",
      timestamp: "2 hours ago",
      isMe: false,
    },
    {
      id: 2,
      sender: "You",
      content: "Yes, it's still available! It's in like new condition.",
      timestamp: "1 hour ago",
      isMe: true,
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      content: "Great! Can we meet tomorrow at the campus library?",
      timestamp: "30 minutes ago",
      isMe: false,
    },
  ];

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    // Handle send message
    setMessageText('');
  };

  return (
    <div>
      <Title level={2}>Messages</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card>
            <List
              dataSource={conversations}
              renderItem={item => (
                <List.Item
                  onClick={() => setSelectedConversation(item.id)}
                  style={{ 
                    cursor: 'pointer', 
                    background: selectedConversation === item.id ? '#f0f2f5' : 'transparent',
                    borderRadius: 8,
                    padding: '12px 8px',
                  }}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={
                      <Space>
                        <Text strong>{item.name}</Text>
                        {item.unread > 0 && (
                          <div style={{ background: '#1890ff', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                            {item.unread}
                          </div>
                        )}
                      </Space>
                    }
                    description={
                      <div>
                        <Text type="secondary">{item.lastMessage}</Text>
                        <div><Text type="secondary" style={{ fontSize: 12 }}>{item.timestamp}</Text></div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        <Col xs={24} md={16}>
          {selectedConversation ? (
            <Card>
              <div style={{ marginBottom: 16 }}>
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  <div>
                    <Text strong>Sarah Johnson</Text>
                    <div><Text type="secondary" style={{ fontSize: 12 }}>Online</Text></div>
                  </div>
                </Space>
              </div>
              <Divider />
              
              <div style={{ height: 400, overflowY: 'auto', marginBottom: 16 }}>
                {messages.map(msg => (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: msg.isMe ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
                    {!msg.isMe && <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />}
                    <div style={{ 
                      maxWidth: '70%',
                      background: msg.isMe ? '#1890ff' : '#f0f2f5',
                      color: msg.isMe ? 'white' : 'black',
                      padding: '8px 12px',
                      borderRadius: 12,
                    }}>
                      <div>{msg.content}</div>
                      <div style={{ fontSize: 10, marginTop: 4, opacity: 0.7 }}>{msg.timestamp}</div>
                    </div>
                    {msg.isMe && <Avatar icon={<UserOutlined />} style={{ marginLeft: 8 }} />}
                  </div>
                ))}
              </div>
              
              <Space style={{ width: '100%' }}>
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
                <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage}>
                  Send
                </Button>
              </Space>
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
