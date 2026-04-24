import React, { useEffect, useState } from 'react';
import {
  Button,
  Empty,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
  message,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  PlusOutlined,
  ReloadOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import {
  createProduct,
  deleteProduct,
  getUserProducts,
  updateProduct,
} from '../services/productService';
import { normalizeProduct } from '../utils/transforms';
import { formatPrice } from '../utils/helpers';
import { CATEGORIES, CONDITIONS, STATUS_COLORS } from '../utils/constants';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

const defaultProductValues = {
  status: 'active',
};

const MyProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getUserProducts();
      setProducts((data || []).map(normalizeProduct));
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to load your products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFileList([]);
    form.resetFields();
    form.setFieldsValue(defaultProductValues);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFileList([]);
    form.setFieldsValue({
      title: product.title,
      description: product.description,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      category: product.category,
      condition: product.condition,
      location: product.location,
      status: product.status || 'active',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setFileList([]);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      if (editingProduct) {
        const response = await updateProduct(editingProduct.id, values);
        const updatedProduct = normalizeProduct(response.product);
        setProducts((items) => items.map((item) => (item.id === updatedProduct.id ? updatedProduct : item)));
        message.success(response.message || 'Product updated successfully');
      } else {
        const images = fileList.map((file) => file.originFileObj || file);
        const response = await createProduct({ ...values, images });
        const createdProduct = normalizeProduct(response.product);
        setProducts((items) => [createdProduct, ...items]);
        message.success(response.message || 'Product created successfully');
      }
      closeModal();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts((items) => items.filter((item) => item.id !== productId));
      message.success('Product deleted successfully');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const uploadProps = {
    multiple: true,
    maxCount: 5,
    fileList,
    beforeUpload: (file) => {
      if (!file.type.startsWith('image/')) {
        message.error('You can only upload image files');
        return Upload.LIST_IGNORE;
      }
      if (file.size / 1024 / 1024 >= 5) {
        message.error('Image must be smaller than 5MB');
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    onChange: ({ fileList: nextFileList }) => setFileList(nextFileList),
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'title',
      render: (_, product) => (
        <Space>
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              width={56}
              height={56}
              style={{ objectFit: 'cover', borderRadius: 6 }}
              preview={false}
            />
          ) : (
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 6,
                background: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingOutlined style={{ color: '#8c8c8c' }} />
            </div>
          )}
          <Space direction="vertical" size={0}>
            <Link to={`/product/${product.id}`}>{product.title}</Link>
            <Text type="secondary">{product.category || 'Uncategorised'}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (price) => <Text strong>{formatPrice(price)}</Text>,
      responsive: ['sm'],
    },
    {
      title: 'Condition',
      dataIndex: 'condition',
      responsive: ['md'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status = 'active') => (
        <Tag color={STATUS_COLORS[status] || 'default'}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Views',
      dataIndex: 'views',
      responsive: ['lg'],
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, product) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEditModal(product)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete product?"
            description="This will permanently remove this listing."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(product.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space align="start" style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }} wrap>
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>My Products</Title>
          <Text type="secondary">Create and manage the products you have listed for sale.</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={loadProducts}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Add Product
          </Button>
        </Space>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={products}
        loading={loading}
        locale={{ emptyText: <Empty description="You have not added any products yet" /> }}
        scroll={{ x: 760 }}
      />

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        open={modalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={defaultProductValues}>
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Title is required' }]}>
            <Input placeholder="e.g., Calculus Textbook 9th Edition" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <TextArea rows={4} placeholder="Describe the item condition, features, and pickup notes" />
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Price is required' }]}>
            <InputNumber min={0} style={{ width: '100%' }} prefix="£" />
          </Form.Item>
          <Form.Item label="Original Price" name="originalPrice">
            <InputNumber min={0} style={{ width: '100%' }} prefix="£" />
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select options={CATEGORIES.map((item) => ({ value: item.value, label: item.label }))} />
          </Form.Item>
          <Form.Item label="Condition" name="condition" rules={[{ required: true, message: 'Condition is required' }]}>
            <Select options={CONDITIONS.map((item) => ({ value: item.label, label: item.label }))} />
          </Form.Item>
          <Form.Item label="Pickup Location" name="location">
            <Input placeholder="e.g., Main Campus Library" />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select
              disabled={!editingProduct}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'sold', label: 'Sold' },
                { value: 'expired', label: 'Expired' },
              ]}
            />
          </Form.Item>
          {!editingProduct ? (
            <Form.Item label="Images">
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag photos to upload</p>
                <p className="ant-upload-hint">Upload up to 5 clear images. Each image must be under 5MB.</p>
              </Dragger>
            </Form.Item>
          ) : null}
          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={closeModal}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={saving}>
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MyProductsPage;
