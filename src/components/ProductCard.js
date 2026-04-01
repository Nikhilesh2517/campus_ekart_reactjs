import React from 'react';
import { Card, Tag, Typography, Button, Space, Rate, Tooltip } from 'antd';
import { HeartOutlined, HeartFilled, EnvironmentOutlined, StarFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { formatPrice, calculateDiscount } from '../utils/helpers';

const { Text } = Typography;

const ProductCard = ({ product, onSave, saved = false }) => {
  const discount = calculateDiscount(product.originalPrice, product.price);
  
  const getConditionColor = (condition) => {
    const colors = { 'Like New': 'green', 'Excellent': 'blue', 'Good': 'orange', 'Fair': 'red' };
    return colors[condition] || 'default';
  };

  return (
    <Card
      hoverable
      cover={
        <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
          <img
            alt={product.title}
            src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
          {discount > 0 && (
            <Tag
              color="red"
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                margin: 0,
                fontWeight: 'bold',
              }}
            >
              -{discount}%
            </Tag>
          )}
          <Tooltip title={saved ? 'Remove from saved' : 'Save for later'}>
            <Button
              type="text"
              shape="circle"
              icon={saved ? <HeartFilled style={{ color: '#f5222d' }} /> : <HeartOutlined />}
              onClick={(e) => {
                e.preventDefault();
                onSave?.(product.id);
              }}
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
                background: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            />
          </Tooltip>
        </div>
      }
      actions={[
        <Link to={`/product/${product.id}`}>
          <Button type="link" size="small">View Details</Button>
        </Link>
      ]}
    >
      <Card.Meta
        title={
          <Link to={`/product/${product.id}`} style={{ color: 'inherit' }}>
            <Text strong ellipsis style={{ fontSize: 16 }}>
              {product.title}
            </Text>
          </Link>
        }
        description={
          <div>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong style={{ fontSize: 20, color: '#1890ff' }}>
                  {formatPrice(product.price)}
                </Text>
                {product.originalPrice && product.originalPrice > product.price && (
                  <Text delete type="secondary" style={{ fontSize: 14 }}>
                    {formatPrice(product.originalPrice)}
                  </Text>
                )}
              </div>
              
              <Space size="small" wrap>
                <Tag color={getConditionColor(product.condition)} style={{ fontSize: 12 }}>
                  {product.condition}
                </Tag>
                {product.category && (
                  <Tag color="blue" style={{ fontSize: 12 }}>
                    {product.category}
                  </Tag>
                )}
              </Space>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Rate
                  disabled
                  defaultValue={product.rating || 0}
                  allowHalf
                  style={{ fontSize: 12 }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  ({product.reviews || 0})
                </Text>
              </div>
              
              {product.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <EnvironmentOutlined style={{ fontSize: 12, color: '#8c8c8c' }} />
                  <Text type="secondary" style={{ fontSize: 12 }} ellipsis>
                    {product.location}
                  </Text>
                </div>
              )}
              
              <Text type="secondary" style={{ fontSize: 12 }}>
                Posted {product.postedDate || 'recently'}
              </Text>
            </Space>
          </div>
        }
      />
    </Card>
  );
};

export default ProductCard;