// src/components/Footer.js
import React from 'react';
import { Layout, Row, Col, Typography, Space, Button } from 'antd';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, LinkedinOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer = () => {
  return (
    <AntFooter style={{ background: '#001529', color: 'white', padding: '48px 48px 24px' }}>
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: 'white' }}>College E-Kart</Title>
          <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
            Your trusted campus marketplace for buying and selling academic resources.
          </Text>
          <Space style={{ marginTop: 16 }}>
            <Button type="text" icon={<FacebookOutlined />} style={{ color: 'white' }} />
            <Button type="text" icon={<TwitterOutlined />} style={{ color: 'white' }} />
            <Button type="text" icon={<InstagramOutlined />} style={{ color: 'white' }} />
            <Button type="text" icon={<LinkedinOutlined />} style={{ color: 'white' }} />
          </Space>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: 'white' }}>Quick Links</Title>
          <Space direction="vertical" size="small">
            <Link href="/about" style={{ color: 'rgba(255,255,255,0.65)' }}>About Us</Link>
            <Link href="/products" style={{ color: 'rgba(255,255,255,0.65)' }}>Marketplace</Link>
            <Link href="/sell" style={{ color: 'rgba(255,255,255,0.65)' }}>Sell Items</Link>
            <Link href="/contact" style={{ color: 'rgba(255,255,255,0.65)' }}>Contact</Link>
          </Space>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: 'white' }}>Support</Title>
          <Space direction="vertical" size="small">
            <Link href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Help Center</Link>
            <Link href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Safety Tips</Link>
            <Link href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Terms of Service</Link>
            <Link href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Privacy Policy</Link>
          </Space>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: 'white' }}>Contact Info</Title>
          <Space direction="vertical" size="small">
            <Space>
              <MailOutlined style={{ color: 'rgba(255,255,255,0.65)' }} />
              <Text style={{ color: 'rgba(255,255,255,0.65)' }}>support@collegeekart.com</Text>
            </Space>
            <Space>
              <PhoneOutlined style={{ color: 'rgba(255,255,255,0.65)' }} />
              <Text style={{ color: 'rgba(255,255,255,0.65)' }}>+1 (555) 123-4567</Text>
            </Space>
          </Space>
        </Col>
      </Row>
      
      <div style={{ textAlign: 'center', marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Text style={{ color: 'rgba(255,255,255,0.45)' }}>
          © 2024 College E-Kart. All rights reserved. Made with ❤️ for students.
        </Text>
      </div>
    </AntFooter>
  );
};

export default Footer;