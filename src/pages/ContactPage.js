import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Row, Col, Space, message } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, SendOutlined } from '@ant-design/icons';
import { sendContactMessage } from '../services/contactService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await sendContactMessage(values);
      message.success(response.message || 'Message sent successfully! We\'ll get back to you soon.');
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>Contact Us</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>Get in Touch</Title>
            <Paragraph>
              Have questions about College E-Kart? We're here to help! Whether you're facing an issue or just want to provide feedback, feel free to reach out.
            </Paragraph>
            
            <Space direction="vertical" size="large" style={{ width: '100%', marginTop: 24 }}>
              <div>
                <MailOutlined style={{ fontSize: 20, marginRight: 12, color: '#1890ff' }} />
                <Text strong>Email:</Text>
                <div>support@collegeekart.com</div>
              </div>
              <div>
                <PhoneOutlined style={{ fontSize: 20, marginRight: 12, color: '#1890ff' }} />
                <Text strong>Phone:</Text>
                <div>+1 (555) 123-4567</div>
              </div>
              <div>
                <EnvironmentOutlined style={{ fontSize: 20, marginRight: 12, color: '#1890ff' }} />
                <Text strong>Office:</Text>
                <div>University of Roehampton, London, UK</div>
              </div>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>Send us a Message</Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              size="large"
            >
              <Form.Item
                label="Your Name"
                name="name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input placeholder="Your full name" />
              </Form.Item>
              
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="student@university.edu" />
              </Form.Item>
              
              <Form.Item
                label="Subject"
                name="subject"
                rules={[{ required: true, message: 'Please enter a subject' }]}
              >
                <Input placeholder="How can we help you?" />
              </Form.Item>
              
              <Form.Item
                label="Message"
                name="message"
                rules={[
                  { required: true, message: 'Please enter your message' },
                  { min: 20, message: 'Message must be at least 20 characters' }
                ]}
              >
                <TextArea rows={4} placeholder="Describe your question or feedback..." />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading} icon={<SendOutlined />}>
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ContactPage;
