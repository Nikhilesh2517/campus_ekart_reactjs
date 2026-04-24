import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Typography, Space, Statistic, Empty, Spin } from 'antd';
import {
  ShoppingOutlined,
  SafetyOutlined,
  TeamOutlined,
  ArrowRightOutlined,
  BookOutlined,
  LaptopOutlined,
  CalculatorOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../utils/constants';
import { getMarketplaceStats, getProducts } from '../services/productService';
import { normalizeProduct } from '../utils/transforms';

const { Title, Paragraph, Text } = Typography;

const categoryIcons = {
  books: <BookOutlined />,
  electronics: <LaptopOutlined />,
  calculators: <CalculatorOutlined />,
  'lab-equipment': <ToolOutlined />,
};

const HomePage = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [productData, statData] = await Promise.all([
          getProducts({ limit: 4, sort: 'newest' }),
          getMarketplaceStats(),
        ]);

        setFeaturedItems((productData.products || []).map(normalizeProduct));
        setStats(statData);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="fade-in">
      <div
        style={{
          background: '#1677ff',
          minHeight: 360,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: 'white',
          textAlign: 'center',
          marginBottom: 48,
          padding: 24,
        }}
      >
        <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
          College E-Kart
        </Title>
        <Paragraph style={{ color: 'white', fontSize: 18, maxWidth: 640 }}>
          Buy, sell, and exchange academic resources with verified students from your campus.
        </Paragraph>
        <Space size="large" style={{ marginTop: 24 }}>
          <Link to="/products">
            <Button type="primary" size="large">
              Start Shopping
            </Button>
          </Link>
          <Link to="/sell">
            <Button size="large">Sell Items</Button>
          </Link>
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 48 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="Users" value={stats?.activeUsers || 0} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="Active Listings" value={stats?.activeListings || 0} prefix={<ShoppingOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="Completed Trades" value={stats?.successfulTrades || 0} prefix={<SafetyOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="Trade Value" value={stats?.moneySaved || 0} prefix="£" precision={0} />
          </Card>
        </Col>
      </Row>

      <Title level={2} style={{ marginBottom: 24 }}>
        Shop by Category
      </Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 48 }}>
        {CATEGORIES.slice(0, 4).map((cat) => (
          <Col xs={12} sm={6} key={cat.value}>
            <Link to={`/products?category=${cat.value}`}>
              <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
                <div style={{ fontSize: 48, color: cat.color, marginBottom: 16 }}>
                  {categoryIcons[cat.value] || cat.icon}
                </div>
                <Title level={4}>{cat.label}</Title>
                <Text type="secondary">{stats?.categories?.[cat.value] || 0} items available</Text>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Latest Items</Title>
        <Link to="/products">
          <Button type="link">
            View All <ArrowRightOutlined />
          </Button>
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <Spin size="large" />
        </div>
      ) : featuredItems.length ? (
        <Row gutter={[16, 16]} style={{ marginBottom: 48 }}>
          {featuredItems.map((product) => (
            <Col xs={24} sm={12} md={6} key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="No listings available yet" style={{ marginBottom: 48 }} />
      )}

      <div
        style={{
          background: '#f0f7ff',
          padding: 48,
          borderRadius: 8,
          textAlign: 'center',
          marginBottom: 48,
        }}
      >
        <Title level={2}>Ready to Start Trading?</Title>
        <Paragraph style={{ fontSize: 16 }}>
          Create a listing or browse current student marketplace items.
        </Paragraph>
        <Space size="large">
          <Link to="/register">
            <Button size="large" type="primary">
              Get Started
            </Button>
          </Link>
          <Link to="/products">
            <Button size="large">Browse Items</Button>
          </Link>
        </Space>
      </div>
    </div>
  );
};

export default HomePage;
