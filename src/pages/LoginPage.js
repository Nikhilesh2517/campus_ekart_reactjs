import React, { useState } from 'react';
import { Alert, Button, Card, Divider, Form, Input, Space, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onFinish = async (values) => {
    setLoading(true);
    setError('');

    try {
      await login(values.email, values.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '24px 0' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>Welcome Back</Title>
          <Text type="secondary">Sign in to your College E-Kart account</Text>
        </div>

        {error ? <Alert message={error} type="error" showIcon style={{ marginBottom: 24 }} /> : null}

        <Form name="login" onFinish={onFinish} autoComplete="off" size="large" layout="vertical">
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="student@university.edu" />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Sign In
            </Button>
          </Form.Item>

          <Divider>Or</Divider>

          <div style={{ textAlign: 'center' }}>
            <Space direction="vertical">
              <Link to="/forgot-password">Forgot password?</Link>
              <div>
                <Text type="secondary">Don't have an account? </Text>
                <Link to="/register">Sign up now</Link>
              </div>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
