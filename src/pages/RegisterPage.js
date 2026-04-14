import React, { useState } from 'react';
import { Alert, Button, Card, Form, Input, Select, Space, Steps, Typography } from 'antd';
import { BankOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;

const universities = [
  'University of Roehampton',
  'University of London',
  'Kingston University',
  'Middlesex University',
];

const courses = [
  'Computer Science',
  'Data Science',
  'Web Development',
  'Business Administration',
  'Economics',
  'Engineering',
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    setError('');

    try {
      const response = await register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        university: values.university,
        course: values.course,
        studentId: values.studentId,
        yearOfStudy: values.yearOfStudy,
      });

      setRegistrationComplete(true);
      setCurrentStep(2);

      if (!response.verificationRequired) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '24px 0' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>Create Account</Title>
          <Text type="secondary">Join the campus marketplace today</Text>
        </div>

        {error ? <Alert message={error} type="error" showIcon style={{ marginBottom: 24 }} /> : null}

        <Steps
          current={currentStep}
          onChange={setCurrentStep}
          items={[{ title: 'Account' }, { title: 'Profile' }, { title: 'Verify' }]}
          style={{ marginBottom: 24 }}
        />

        <Form name="register" onFinish={onFinish} autoComplete="off" size="large" layout="vertical">
          {currentStep === 0 ? (
            <>
              <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: 'Please enter your full name' }]}>
                <Input prefix={<UserOutlined />} placeholder="John Doe" />
              </Form.Item>

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

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please enter your password' },
                  { min: 8, message: 'Password must be at least 8 characters' },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Create a strong password" />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Confirm your password" />
              </Form.Item>
            </>
          ) : null}

          {currentStep === 1 ? (
            <>
              <Form.Item label="University" name="university" rules={[{ required: true, message: 'Please select your university' }]}>
                <Select placeholder="Select your university" suffixIcon={<BankOutlined />}>
                  {universities.map((uni) => (
                    <Option key={uni} value={uni}>
                      {uni}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Course/Program" name="course" rules={[{ required: true, message: 'Please select your course' }]}>
                <Select placeholder="Select your course">
                  {courses.map((course) => (
                    <Option key={course} value={course}>
                      {course}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Student ID" name="studentId" rules={[{ required: true, message: 'Please enter your student ID' }]}>
                <Input placeholder="Enter your student ID" />
              </Form.Item>

              <Form.Item label="Year of Study" name="yearOfStudy" rules={[{ required: true, message: 'Please select your year' }]}>
                <Select placeholder="Select year">
                  <Option value="1">1st Year</Option>
                  <Option value="2">2nd Year</Option>
                  <Option value="3">3rd Year</Option>
                  <Option value="4">4th Year</Option>
                  <Option value="postgrad">Postgraduate</Option>
                </Select>
              </Form.Item>
            </>
          ) : null}

          {currentStep === 2 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
              <Title level={4}>Account Ready</Title>
              <Text>
                {registrationComplete
                  ? 'Your account has been created. If email verification is enabled, check your inbox for the verification link.'
                  : 'Complete the first two steps to create your account.'}
              </Text>
            </div>
          ) : null}

          <Form.Item style={{ marginTop: 24 }}>
            {currentStep < 2 ? (
              <Space>
                {currentStep > 0 ? <Button onClick={() => setCurrentStep(currentStep - 1)}>Back</Button> : null}
                <Button
                  type="primary"
                  htmlType={currentStep === 1 ? 'submit' : 'button'}
                  onClick={currentStep === 1 ? undefined : () => setCurrentStep(currentStep + 1)}
                  loading={loading}
                >
                  {currentStep === 1 ? 'Complete Registration' : 'Continue'}
                </Button>
              </Space>
            ) : (
              <Button type="primary" block onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            )}
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Text type="secondary">
              Already have an account? <Link to="/login">Sign in</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
