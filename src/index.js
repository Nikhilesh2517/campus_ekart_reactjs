import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HelmetProvider } from 'react-helmet-async';
import { ConfigProvider } from 'antd';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#1890ff',
                borderRadius: 8,
                colorSuccess: '#52c41a',
                colorWarning: '#faad14',
                colorError: '#f5222d',
              },
              components: {
                Button: {
                  borderRadius: 6,
                },
                Card: {
                  borderRadiusLG: 12,
                },
              },
            }}
          >
            <App />
          </ConfigProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);