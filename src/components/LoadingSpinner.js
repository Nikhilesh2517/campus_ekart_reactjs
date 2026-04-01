import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingSpinner = ({ size = 'large', tip = 'Loading...', fullScreen = false }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  
  const spinner = (
    <Spin
      indicator={antIcon}
      size={size}
      tip={tip}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 16,
      }}
    />
  );
  
  if (fullScreen) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 9999,
        }}
      >
        {spinner}
      </div>
    );
  }
  
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px 24px',
        minHeight: 200,
      }}
    >
      {spinner}
    </div>
  );
};

export default LoadingSpinner;