import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Badge, Button, Drawer, Dropdown, Input, Layout, Menu, Space, Typography } from 'antd';
import {
  BellOutlined,
  HeartOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuOutlined,
  MessageOutlined,
  PlusCircleOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import appLogo from '../assets/images/app-logo.svg';
import defaultAvatar from '../assets/images/default-avatar.svg';
import { useAuth } from '../context/AuthContext';
import { getConversations } from '../services/messageService';
import './Navbar.css';

const { Header } = Layout;
const { Search } = Input;
const { Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [conversations, setConversations] = useState([]);

  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setConversations([]);
      return;
    }

    try {
      const data = await getConversations();
      setConversations(data || []);
    } catch {
      setConversations([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadNotifications();

    if (!isAuthenticated) {
      return undefined;
    }

    const intervalId = window.setInterval(loadNotifications, 30000);
    const handleRefresh = () => loadNotifications();
    window.addEventListener('college-ekart:notifications-refresh', handleRefresh);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('college-ekart:notifications-refresh', handleRefresh);
    };
  }, [isAuthenticated, loadNotifications, location.pathname]);

  const unreadConversations = useMemo(
    () => conversations.filter((item) => Number(item.unread_count || 0) > 0),
    [conversations]
  );

  const unreadCount = useMemo(
    () => unreadConversations.reduce((total, item) => total + Number(item.unread_count || 0), 0),
    [unreadConversations]
  );

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
    { key: 'my-products', label: <Link to="/my-products">My Products</Link>, icon: <ShoppingOutlined /> },
    { key: 'orders', label: <Link to="/orders">My Orders</Link>, icon: <ShoppingOutlined /> },
    { key: 'messages', label: <Link to="/messages">Messages</Link>, icon: <MessageOutlined /> },
    { key: 'saved', label: <Link to="/profile">Saved Items</Link>, icon: <HeartOutlined /> },
    { type: 'divider' },
    { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, onClick: handleLogout },
  ];

  const notificationMenuItems = unreadConversations.length
    ? [
        ...unreadConversations.slice(0, 5).map((conversation) => ({
          key: `message-${conversation.other_user_id}`,
          label: (
            <div className="college-navbar__notification">
              <Text strong>{conversation.other_user_name}</Text>
              <Text type="secondary" ellipsis>
                {conversation.last_message || 'New message'}
              </Text>
            </div>
          ),
          onClick: () => navigate('/messages'),
        })),
        { type: 'divider' },
        { key: 'all-messages', label: 'View all messages', onClick: () => navigate('/messages') },
      ]
    : [
        { key: 'empty', label: <Text type="secondary">No new notifications</Text>, disabled: true },
        { type: 'divider' },
        { key: 'all-messages', label: 'View messages', onClick: () => navigate('/messages') },
      ];

  return (
    <Header
      className="college-navbar"
    >
      <div className="college-navbar__inner">
        <div className="college-navbar__left">
          <Link
            to="/"
            className="college-navbar__brand"
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

        <div className="college-navbar__right">
          <div className="desktop-search">
            <Search
              placeholder="Search products..."
              onSearch={(value) => navigate(value ? `/products?search=${encodeURIComponent(value)}` : '/products')}
            />
          </div>

          {isAuthenticated ? (
            <>
              <Dropdown menu={{ items: notificationMenuItems }} placement="bottomRight" trigger={['click']}>
                <Badge count={unreadCount} size="small">
                  <Button
                    className="college-navbar__icon-button"
                    type="text"
                    icon={<BellOutlined />}
                    aria-label="Notifications"
                  />
                </Badge>
              </Dropdown>
              <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => navigate('/sell')}>
                Sell
              </Button>
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                <Space className="college-navbar__account">
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

          <Button className="college-navbar__menu-button" type="text" icon={<MenuOutlined />} onClick={() => setMobileMenuOpen(true)} />
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
