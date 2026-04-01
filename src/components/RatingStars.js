import React from 'react';
import { Rate, Typography, Space } from 'antd';
import { StarFilled } from '@ant-design/icons';

const { Text } = Typography;

const RatingStars = ({ rating, totalReviews, size = 'default', showCount = true }) => {
  const starSize = {
    small: 12,
    default: 14,
    large: 16,
  };

  return (
    <Space size="small" align="center">
      <Rate
        disabled
        defaultValue={rating}
        allowHalf
        character={<StarFilled />}
        style={{ fontSize: starSize[size], color: '#faad14' }}
      />
      {showCount && totalReviews !== undefined && (
        <Text type="secondary" style={{ fontSize: starSize[size] }}>
          ({totalReviews})
        </Text>
      )}
    </Space>
  );
};

export default RatingStars;