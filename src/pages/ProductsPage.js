// src/pages/ProductsPage.js
import React, { useState } from 'react';
import { 
  Row, Col, Card, Input, Select, Slider, Button, Tag, Empty, 
  Pagination, Space, Badge, Typography, Drawer, Radio, Checkbox
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  SortAscendingOutlined,
  StarFilled,
  EnvironmentOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const ProductsPage = () => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCondition, setSelectedCondition] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { value: 'all', label: 'All Categories', count: 342 },
    { value: 'books', label: 'Books', count: 234 },
    { value: 'electronics', label: 'Electronics', count: 156 },
    { value: 'calculators', label: 'Calculators', count: 89 },
    { value: 'lab-equipment', label: 'Lab Equipment', count: 67 },
    { value: 'furniture', label: 'Furniture', count: 45 },
    { value: 'other', label: 'Other', count: 23 },
  ];

  const conditions = [
    { label: 'Like New', value: 'like-new', color: 'green' },
    { label: 'Excellent', value: 'excellent', color: 'blue' },
    { label: 'Good', value: 'good', color: 'orange' },
    { label: 'Fair', value: 'fair', color: 'red' },
  ];

  const products = [
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
      category: "books",
      location: "Main Campus",
      daysAgo: 2,
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
      category: "electronics",
      location: "North Campus",
      daysAgo: 1,
    },
    // Add more products...
  ];

  const getConditionColor = (condition) => {
    const colors = { 'Like New': 'green', 'Excellent': 'blue', 'Good': 'orange', 'Fair': 'red' };
    return colors[condition] || 'default';
  };

  const filterContent = (
    <div>
      <Title level={5}>Categories</Title>
      <Radio.Group value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ marginBottom: 24 }}>
        <Space direction="vertical">
          {categories.map(cat => (
            <Radio key={cat.value} value={cat.value}>
              {cat.label} <Text type="secondary">({cat.count})</Text>
            </Radio>
          ))}
        </Space>
      </Radio.Group>

      <Title level={5}>Price Range</Title>
      <Slider
        range
        min={0}
        max={1000}
        value={priceRange}
        onChange={setPriceRange}
        style={{ marginBottom: 24 }}
      />
      <Space style={{ marginBottom: 24 }}>
        <Input value={`$${priceRange[0]}`} style={{ width: 100 }} />
        <span>to</span>
        <Input value={`$${priceRange[1]}`} style={{ width: 100 }} />
      </Space>

      <Title level={5}>Condition</Title>
      <Checkbox.Group
        options={conditions.map(c => ({ label: c.label, value: c.value }))}
        value={selectedCondition}
        onChange={setSelectedCondition}
        style={{ marginBottom: 24, display: 'flex', flexDirection: 'column' }}
      />

      <Button type="primary" block onClick={() => setFilterDrawerVisible(false)}>
        Apply Filters
      </Button>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Marketplace</Title>
        <Space>
          <Select
            value={sortBy}
            onChange={setSortBy}
            style={{ width: 150 }}
            suffixIcon={<SortAscendingOutlined />}
          >
            <Option value="newest">Newest First</Option>
            <Option value="price-low">Price: Low to High</Option>
            <Option value="price-high">Price: High to Low</Option>
            <Option value="rating">Top Rated</Option>
          </Select>
          <Button icon={<FilterOutlined />} onClick={() => setFilterDrawerVisible(true)}>
            Filters
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={0} md={6}>
          <Card style={{ position: 'sticky', top: 80 }}>
            {filterContent}
          </Card>
        </Col>
        
        <Col xs={24} md={18}>
          <div style={{ marginBottom: 16 }}>
            <Input
              placeholder="Search for books, electronics, equipment..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <Text type="secondary">Showing {products.length} results</Text>
          </div>

          <Row gutter={[16, 16]}>
            {products.map(product => (
              <Col xs={24} sm={12} lg={8} key={product.id}>
                <Card
                  hoverable
                  cover={<img alt={product.title} src={product.image} style={{ height: 200, objectFit: 'cover' }} />}
                  actions={[
                    <Button type="link" href={`/product/${product.id}`}>View Details</Button>
                  ]}
                >
                  <Card.Meta
                    title={product.title}
                    description={
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <Text strong style={{ fontSize: 20, color: '#1890ff' }}>${product.price}</Text>
                          <Text delete type="secondary">${product.originalPrice}</Text>
                        </div>
                        <Tag color={getConditionColor(product.condition)}>{product.condition}</Tag>
                        <div style={{ marginTop: 8 }}>
                          <StarFilled style={{ color: '#faad14' }} /> {product.rating} ({product.reviews})
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <EnvironmentOutlined style={{ marginRight: 4 }} />
                          <Text type="secondary" style={{ fontSize: 12 }}>{product.location}</Text>
                        </div>
                        <Text type="secondary" style={{ fontSize: 12 }}>Posted {product.daysAgo} days ago</Text>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Pagination
              current={currentPage}
              total={342}
              pageSize={12}
              onChange={setCurrentPage}
              showSizeChanger={false}
            />
          </div>
        </Col>
      </Row>

      <Drawer
        title="Filters"
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
        width={320}
      >
        {filterContent}
      </Drawer>
    </div>
  );
};

export default ProductsPage;