// src/pages/AboutPage.js
import React from 'react';
import { Card, Typography, Row, Col, Avatar, Space, Divider } from 'antd';
import { TeamOutlined, SafetyOutlined, EnvironmentOutlined, DollarOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const AboutPage = () => {
  return (
    <div>
      <Title level={2}>About College E-Kart</Title>
      
      <Card style={{ marginBottom: 24 }}>
        <Title level={3}>Our Mission</Title>
        <Paragraph>
          College E-Kart is dedicated to creating a sustainable and cost-effective ecosystem for students to exchange academic resources. We believe that education should be accessible, and no student should be burdened by the high cost of textbooks and equipment.
        </Paragraph>
        
        <Title level={3}>Our Story</Title>
        <Paragraph>
          Founded by students for students, College E-Kart emerged from the simple observation that academic resources are often used for just one semester and then left unused. We created a platform that connects students within the same university, enabling them to buy, sell, and exchange resources in a trusted environment.
        </Paragraph>
      </Card>

      <Title level={3}>Why Choose College E-Kart?</Title>
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card>
            <Space direction="vertical" size="middle">
              <DollarOutlined style={{ fontSize: 32, color: '#1890ff' }} />
              <Title level={4}>Save Money</Title>
              <Text>Buy and sell at student-friendly prices, saving hundreds of dollars on textbooks and equipment.</Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Space direction="vertical" size="middle">
              <SafetyOutlined style={{ fontSize: 32, color: '#1890ff' }} />
              <Title level={4}>Safe & Secure</Title>
              <Text>All users are verified students, ensuring a trusted community. Campus meetups add an extra layer of security.</Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Space direction="vertical" size="middle">
              <EnvironmentOutlined style={{ fontSize: 32, color: '#1890ff' }} />
              <Title level={4}>Campus Focused</Title>
              <Text>Exclusively for university students, making it easy to find and trade items within your community.</Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Space direction="vertical" size="middle">
              <TeamOutlined style={{ fontSize: 32, color: '#1890ff' }} />
              <Title level={4}>Community Driven</Title>
              <Text>Join a community of students committed to sustainable and affordable education.</Text>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card>
        <Title level={3}>Our Impact</Title>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ color: '#1890ff' }}>1,250+</Title>
              <Text>Active Students</Text>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ color: '#1890ff' }}>3,420+</Title>
              <Text>Items Listed</Text>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ color: '#1890ff' }}>$125K+</Title>
              <Text>Money Saved</Text>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AboutPage;