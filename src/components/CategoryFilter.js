import React from 'react';
import { Radio, Space, Typography } from 'antd';
import { CATEGORIES } from '../utils/constants';

const { Text } = Typography;

const CategoryFilter = ({ selectedCategory, onChange, showCount = false, counts = {} }) => {
  const categories = [
    { value: 'all', label: 'All Categories', icon: '📦' },
    ...CATEGORIES,
  ];

  return (
    <Radio.Group
      value={selectedCategory}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: '100%' }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {categories.map(cat => (
          <Radio key={cat.value} value={cat.value} style={{ width: '100%' }}>
            <span style={{ marginRight: 8 }}>{cat.icon}</span>
            {cat.label}
            {showCount && counts[cat.value] !== undefined && (
              <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                ({counts[cat.value]})
              </Text>
            )}
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  );
};

export default CategoryFilter;