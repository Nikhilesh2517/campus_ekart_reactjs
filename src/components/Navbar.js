// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Input, Badge, Avatar, Dropdown, Button, Space, Drawer } from 'antd';
import {
  ShoppingOutlined,
  UserOutlined,
  MessageOutlined,
  BellOutlined,
  PlusCircleOutlined,
  HomeOutlined,
  MenuOutlined,
  LogoutOutlined,
  SettingOutlined,
  HeartOutlined,
} from '@ant-design/icons';

const { Header } = Layout;
const { Search } = Input;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  const menuItems = [
    { key: '/', label: <Link to="/">Home</Link>, icon: <HomeOutlined /> },
    { key: '/products', label: <Link to="/products">Marketplace</Link>, icon: <ShoppingOutlined /> },
    { key: '/about', label: <Link to="/about">About</Link> },
    { key: '/contact', label: <Link to="/contact">Contact</Link> },
  ];

  const userMenuItems = [
    { key: 'profile', label: <Link to="/profile">Profile</Link>, icon: <UserOutlined /> },
    { key: 'orders', label: <Link to="/orders">My Orders</Link>, icon: <ShoppingOutlined /> },
    { key: 'messages', label: <Link to="/messages">Messages</Link>, icon: <MessageOutlined /> },
    { key: 'saved', label: 'Saved Items', icon: <HeartOutlined /> },
    { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
    { type: 'divider' },
    { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, onClick: handleLogout },
  ];

  const userDropdown = (
    <Dropdown
      menu={{ items: userMenuItems }}
      placement="bottomRight"
      arrow
      trigger={['click']}
    >
      <Space style={{ cursor: 'pointer' }}>
        <Avatar icon={<UserOutlined />} src={user?.avatar} />
        <span style={{ display: 'none', '@media (min-width: 768px)': { display: 'inline' } }}>
          {user?.name || 'Account'}
        </span>
      </Space>
    </Dropdown>
  );

  const mobileMenu = (
    <Drawer
      title="Menu"
      placement="right"
      onClose={() => setMobileMenuOpen(false)}
      open={mobileMenuOpen}
      width={280}
    >
      <Menu
        mode="vertical"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={() => setMobileMenuOpen(false)}
      />
      {!isLoggedIn ? (
        <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
          <Button type="primary" block onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>
            Login
          </Button>
          <Button block onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}>
            Register
          </Button>
        </Space>
      ) : (
        <Menu
          mode="vertical"
          items={userMenuItems}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </Drawer>
  );

  return (
    <Header style={{ position: 'fixed', top: 0, zIndex: 1000, width: '100%', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '0 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link to="/" style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff', textDecoration: 'none' }}>
            College E-Kart
          </Link>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ borderBottom: 'none', flex: 1, minWidth: 0, display: 'flex', gap: 8 }}
            disabledOverflow
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Search
            placeholder="Search books, gadgets, equipment..."
            style={{ width: 300 }}
            onSearch={(value) => console.log('Search:', value)}
          />
          
          {isLoggedIn ? (
            <>
              <Badge count={3}>
                <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
              </Badge>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => navigate('/sell')}
                style={{ borderRadius: 20 }}
              >
                Sell
              </Button>
              {userDropdown}
            </>
          ) : (
            <Space>
              <Button type="link" onClick={() => navigate('/login')}>Login</Button>
              <Button type="primary" onClick={() => navigate('/register')}>Register</Button>
            </Space>
          )}
          
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuOpen(true)}
            style={{ display: 'none', '@media (max-width: 768px)': { display: 'inline-flex' } }}
          />
        </div>
      </div>
      {mobileMenu}
    </Header>
  );
};

export default Navbar;