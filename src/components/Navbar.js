import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Badge, Button, Drawer, Dropdown, Input, Layout, Menu, Space } from 'antd';
import {
  BellOutlined,
  HeartOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuOutlined,
  MessageOutlined,
  PlusCircleOutlined,
  SettingOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import appLogo from '../assets/images/app-logo.svg';
import defaultAvatar from '../assets/images/default-avatar.svg';
import { useAuth } from '../context/AuthContext';

const { Header } = Layout;
const { Search } = Input;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { key: '/', label: <Link to="/">Home</Link>, icon: <HomeOutlined /> },
    { key: '/products', label: <Link to="/products">Marketplace</Link>, icon: <ShoppingOutlined /> },
    { key: '/about', label: <Link to="/about">About</Link> },
    { key: '/contact', label: <Link to="/contact">Contact</Link> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenuItems = [
    { key: 'profile', label: <Link to="/profile">Profile</Link>, icon: <UserOutlined /> },
    { key: 'orders', label: <Link to="/orders">My Orders</Link>, icon: <ShoppingOutlined /> },
    { key: 'messages', label: <Link to="/messages">Messages</Link>, icon: <MessageOutlined /> },
    { key: 'saved', label: <Link to="/profile">Saved Items</Link>, icon: <HeartOutlined /> },
    { key: 'settings', label: <Link to="/profile">Settings</Link>, icon: <SettingOutlined /> },
    { type: 'divider' },
    { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, onClick: handleLogout },
  ];

  return (
    <Header
      style={{
        position: 'fixed',
        top: 0,
        zIndex: 1000,
        width: '100%',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '0 24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, minWidth: 0 }}>
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 700, color: '#1890ff', textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            <img src={appLogo} alt="College E-Kart logo" style={{ width: 34, height: 34 }} />
            <span>College E-Kart</span>
          </Link>

          <div className="desktop-nav" style={{ minWidth: 0 }}>
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={menuItems}
              style={{ borderBottom: 'none', minWidth: 0 }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="desktop-search">
            <Search
              placeholder="Search products..."
              style={{ width: 260 }}
              onSearch={(value) => navigate(value ? `/products?search=${encodeURIComponent(value)}` : '/products')}
            />
          </div>

          {isAuthenticated ? (
            <>
              <Badge count={0} size="small">
                <BellOutlined style={{ fontSize: 18 }} />
              </Badge>
              <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => navigate('/sell')}>
                Sell
              </Button>
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                <Space style={{ cursor: 'pointer' }}>
                  <Avatar icon={<UserOutlined />} src={user?.avatar || defaultAvatar} />
                  <span>{user?.name || 'Account'}</span>
                </Space>
              </Dropdown>
            </>
          ) : (
            <Space>
              <Button type="link" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button type="primary" onClick={() => navigate('/register')}>
                Register
              </Button>
            </Space>
          )}

          <Button type="text" icon={<MenuOutlined />} onClick={() => setMobileMenuOpen(true)} />
        </div>
      </div>

      <Drawer title="Menu" placement="right" width={280} onClose={() => setMobileMenuOpen(false)} open={mobileMenuOpen}>
        <Menu mode="vertical" selectedKeys={[location.pathname]} items={menuItems} onClick={() => setMobileMenuOpen(false)} />
        {!isAuthenticated ? (
          <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
            <Button type="primary" block onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>
              Login
            </Button>
            <Button block onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}>
              Register
            </Button>
          </Space>
        ) : (
          <Menu mode="vertical" items={userMenuItems} onClick={() => setMobileMenuOpen(false)} style={{ marginTop: 16 }} />
        )}
      </Drawer>
    </Header>
  );
};

export default Navbar;
