// src/pages/HomePage.js
import React from 'react';
import { Carousel, Row, Col, Card, Button, Typography, Space, Tag, Statistic } from 'antd';
import { 
  ShoppingOutlined, 
  SafetyOutlined, 
  EnvironmentOutlined, 
  TeamOutlined,
  ArrowRightOutlined,
  StarFilled,
  BookOutlined,
  LaptopOutlined,
  CalculatorOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const HomePage = () => {
  const categories = [
    { icon: <BookOutlined />, name: 'Books', color: '#1890ff', count: 234 },
    { icon: <LaptopOutlined />, name: 'Electronics', color: '#52c41a', count: 156 },
    { icon: <CalculatorOutlined />, name: 'Calculators', color: '#faad14', count: 89 },
    { icon: <ToolOutlined />, name: 'Lab Equipment', color: '#f5222d', count: 67 },
  ];

  const featuredItems = [
    {
      id: 1,
      title: "Calculus: Early Transcendentals",
      price: 45,
      originalPrice: 120,
      condition: "Like New",
      seller: "Sarah Johnson",
      image: "https://via.placeholder.com/300x200?text=Book",
      rating: 4.8,
      reviews: 12,
    },
    {
      id: 2,
      title: "MacBook Pro 2020",
      price: 850,
      originalPrice: 1299,
      condition: "Good",
      seller: "Michael Chen",
      image: "https://via.placeholder.com/300x200?text=Laptop",
      rating: 4.9,
      reviews: 8,
    },
    {
      id: 3,
      title: "Texas Instruments TI-84 Plus",
      price: 65,
      originalPrice: 120,
      condition: "Excellent",
      seller: "Emily Rodriguez",
      image: "https://via.placeholder.com/300x200?text=Calculator",
      rating: 4.7,
      reviews: 15,
    },
    {
      id: 4,
      title: "Physics Lab Kit",
      price: 35,
      originalPrice: 80,
      condition: "Good",
      seller: "David Kim",
      image: "https://via.placeholder.com/300x200?text=Lab+Kit",
      rating: 4.5,
      reviews: 6,
    },
  ];

  const bannerImages = [
    "https://via.placeholder.com/1200x400?text=Welcome+to+College+E-Kart",
    "https://via.placeholder.com/1200x400?text=Buy+and+Sell+Academic+Resources",
    "https://via.placeholder.com/1200x400?text=Save+Money+Together",
  ];

  return (
    <div className="fade-in">
      {/* Hero Carousel */}
      <Carousel autoplay effect="fade" style={{ marginBottom: 48 }}>
        {bannerImages.map((img, index) => (
          <div key={index}>
            <div style={{ 
              background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`, 
              height: 400, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexDirection: 'column',
              color: 'white',
              textAlign: 'center'
            }}>
              <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
                Welcome to College E-Kart
              </Title>
              <Paragraph style={{ color: 'white', fontSize: 18, maxWidth: 600 }}>
                The ultimate campus marketplace for students to buy, sell, and exchange academic resources
              </Paragraph>
              <Space size="large" style={{ marginTop: 24 }}>
                <Button type="primary" size="large" href="/products">
                  Start Shopping
                </Button>
                <Button size="large" style={{ background: 'white' }} href="/sell">
                  Sell Items
                </Button>
              </Space>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 48 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="Active Users" value={1250} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="Items Listed" value={3420} prefix={<ShoppingOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="Successful Trades" value={2850} prefix={<SafetyOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="Money Saved" value={125000} prefix="$" precision={0} />
          </Card>
        </Col>
      </Row>

      {/* Categories */}
      <Title level={2} style={{ marginBottom: 24 }}>Shop by Category</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 48 }}>
        {categories.map((cat, index) => (
          <Col xs={12} sm={6} key={index}>
            <Card hoverable style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, color: cat.color, marginBottom: 16 }}>
                {cat.icon}
              </div>
              <Title level={4}>{cat.name}</Title>
              <Text type="secondary">{cat.count} items available</Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Featured Items */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Featured Items</Title>
        <Link to="/products">
          <Button type="link">View All <ArrowRightOutlined /></Button>
        </Link>
      </div>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 48 }}>
        {featuredItems.map((item) => (
          <Col xs={24} sm={12} md={6} key={item.id}>
            <Card
              hoverable
              cover={<img alt={item.title} src={item.image} style={{ height: 200, objectFit: 'cover' }} />}
              actions={[
                <Button type="link" href={`/product/${item.id}`}>View Details</Button>
              ]}
            >
              <Card.Meta
                title={item.title}
                description={
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <Text strong style={{ fontSize: 20, color: '#1890ff' }}>${item.price}</Text>
                      <Text delete type="secondary">${item.originalPrice}</Text>
                    </div>
                    <Tag color={item.condition === 'Like New' ? 'green' : item.condition === 'Excellent' ? 'blue' : 'orange'}>
                      {item.condition}
                    </Tag>
                    <div style={{ marginTop: 8 }}>
                      <StarFilled style={{ color: '#faad14' }} /> {item.rating} ({item.reviews} reviews)
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>by {item.seller}</Text>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* How It Works */}
      <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>How It Works</Title>
      <Row gutter={[32, 32]} style={{ marginBottom: 48 }}>
        <Col xs={24} md={8}>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
            <Title level={3}>List Your Item</Title>
            <Paragraph>Post your textbooks, gadgets, or equipment with photos and price</Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <Title level={3}>Find Buyers/Sellers</Title>
            <Paragraph>Connect with verified students from your campus</Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
            <Title level={3}>Trade Safely</Title>
            <Paragraph>Complete transactions with secure messaging and campus meetup</Paragraph>
          </Card>
        </Col>
      </Row>

      {/* Testimonials */}
      <div style={{ background: '#f0f2f5', padding: 48, borderRadius: 16, marginBottom: 48 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>What Students Say</Title>
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <Card>
              <Space direction="vertical">
                <StarFilled style={{ color: '#faad14', fontSize: 20 }} />
                <StarFilled style={{ color: '#faad14', fontSize: 20 }} />
                <StarFilled style={{ color: '#faad14', fontSize: 20 }} />
                <StarFilled style={{ color: '#faad14', fontSize: 20 }} />
                <StarFilled style={{ color: '#faad14', fontSize: 20 }} />
                <Paragraph style={{ marginTop: 16 }}>
                  "College E-Kart saved me over $300 on textbooks this semester! The platform is easy to use and I trust the sellers because they're all verified students."
                </Paragraph>
                <Text strong>- Emily Watson, Computer Science</Text>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card>
              <Space direction="vertical">
                <StarFilled style={{ color: '#faad14', fontSize: 20 }} />
                <StarFilled style={{ color: '#faad14', fontSize: 20 }} />
                <StarFilled style={{ color: '#faad14', fontSize: 20 }} />
                <StarFilled style={{ color: '#faad14', fontSize: 20 }} />
                <StarFilled style={{ color: '#faad14', fontSize: 20 }} />
                <Paragraph style={{ marginTop: 16 }}>
                  "I sold my old iPad within 2 days of listing it. The messaging system made it easy to coordinate with the buyer. Highly recommend!"
                </Paragraph>
                <Text strong>- James Rodriguez, Business</Text>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>

      {/* CTA Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)', 
        padding: 48, 
        borderRadius: 16, 
        textAlign: 'center',
        color: 'white'
      }}>
        <Title level={2} style={{ color: 'white' }}>Ready to Start Trading?</Title>
        <Paragraph style={{ color: 'white', fontSize: 16 }}>
          Join thousands of students saving money on academic resources
        </Paragraph>
        <Space size="large">
          <Button size="large" type="primary" style={{ background: 'white', color: '#1890ff' }} href="/register">
            Get Started Free
          </Button>
          <Button size="large" style={{ borderColor: 'white', color: 'white' }} href="/products">
            Browse Items
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default HomePage;