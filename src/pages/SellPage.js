import React, { useState } from 'react';
import { 
  Form, Input, Button, Card, Typography, Upload, Select, 
  InputNumber, message, Steps, Space, Divider, Alert
} from 'antd';
import { 
  InboxOutlined, 
  DollarOutlined, 
  BookOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { formatPrice } from '../utils/helpers';
import { createProduct } from '../services/productService';
import { CATEGORIES, CONDITIONS } from '../utils/constants';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const SellPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const uploadProps = {
    name: 'file',
    multiple: true,
    fileList,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return false;
      }
      setFileList([...fileList, file]);
      return false;
    },
    onRemove: (file) => {
      setFileList(fileList.filter(f => f.uid !== file.uid));
    },
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      await createProduct({ ...values, images: fileList });
      message.success('Item listed successfully!');
      form.resetFields();
      setFileList([]);
      setCurrentStep(0);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to list item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const validateStep = async () => {
    const stepFields = [
      ['title', 'category', 'description'],
      ['price', 'originalPrice', 'condition', 'location'],
      ['images'],
    ];

    await form.validateFields(stepFields[currentStep]);
    if (currentStep === 2 && fileList.length === 0) {
      message.error('Please upload at least one photo');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const steps = [
    { title: 'Item Details', icon: <BookOutlined /> },
    { title: 'Price & Condition', icon: <DollarOutlined /> },
    { title: 'Images', icon: <InboxOutlined /> },
    { title: 'Review & Submit', icon: <CheckCircleOutlined /> },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2}>Sell Your Item</Title>
          <Text type="secondary">
            List your textbooks, gadgets, and equipment to help fellow students save money
          </Text>
        </div>

        <Steps
          current={currentStep}
          items={steps}
          style={{ marginBottom: 32 }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="large"
        >
          {currentStep === 0 && (
            <>
              <Form.Item
                label="Item Title"
                name="title"
                rules={[{ required: true, message: 'Please enter item title' }]}
              >
                <Input placeholder="e.g., Calculus Textbook 9th Edition" />
              </Form.Item>

              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  {CATEGORIES.map(cat => (
                    <Option key={cat.value} value={cat.value}>{cat.label}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: 'Please enter description' },
                  { min: 20, message: 'Description must be at least 20 characters' }
                ]}
              >
                <TextArea 
                  rows={4} 
                  placeholder="Describe the item condition, features, why you're selling, etc." 
                />
              </Form.Item>
            </>
          )}

          {currentStep === 1 && (
            <>
              <Form.Item
                label="Price (GBP)"
                name="price"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <InputNumber
                  min={0}
                  step={5}
                  style={{ width: '100%' }}
                  placeholder="Enter your price"
                  prefix="£"
                />
              </Form.Item>

              <Form.Item
                label="Original Price (Optional)"
                name="originalPrice"
              >
                <InputNumber
                  min={0}
                  step={5}
                  style={{ width: '100%' }}
                  placeholder="Original retail price"
                  prefix="£"
                />
              </Form.Item>

              <Form.Item
                label="Condition"
                name="condition"
                rules={[{ required: true, message: 'Please select condition' }]}
              >
                <Select placeholder="Select condition">
                  {CONDITIONS.map(cond => (
                    <Option key={cond.label} value={cond.label}>{cond.label}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Pickup Location"
                name="location"
                rules={[{ required: true, message: 'Please enter pickup location' }]}
              >
                <Input placeholder="e.g., Main Campus Library" />
              </Form.Item>

              <Alert
                message="Condition Guidelines"
                description={
                  <ul style={{ marginTop: 8, marginBottom: 0 }}>
                    <li><strong>Like New:</strong> Perfect condition, no signs of use</li>
                    <li><strong>Excellent:</strong> Lightly used, minimal wear</li>
                    <li><strong>Good:</strong> Used but fully functional, some wear</li>
                    <li><strong>Fair:</strong> Significant wear but functional</li>
                  </ul>
                }
                type="info"
                showIcon
              />
            </>
          )}

          {currentStep === 2 && (
            <>
              <Form.Item
                label="Upload Photos"
                name="images"
                rules={[{ validator: () => (fileList.length ? Promise.resolve() : Promise.reject(new Error('Please upload at least one photo'))) }]}
              >
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag photos to upload</p>
                  <p className="ant-upload-hint">
                    Upload clear photos of your item. Max 5 images per listing.
                  </p>
                </Dragger>
              </Form.Item>

              <Alert
                message="Photo Tips"
                description="Take clear photos in good lighting. Include multiple angles and show any imperfections."
                type="info"
                showIcon
                style={{ marginTop: 16 }}
              />
            </>
          )}

          {currentStep === 3 && (
            <div style={{ background: '#f5f5f5', padding: 24, borderRadius: 8 }}>
              <Title level={4}>Review Your Listing</Title>
              <Divider />
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div><Text strong>Title:</Text> {form.getFieldValue('title') || 'Not provided'}</div>
                <div><Text strong>Category:</Text> {form.getFieldValue('category') || 'Not provided'}</div>
                <div><Text strong>Price:</Text> {formatPrice(form.getFieldValue('price') || 0)}</div>
                {form.getFieldValue('originalPrice') && (
                  <div><Text strong>Original Price:</Text> {formatPrice(form.getFieldValue('originalPrice'))}</div>
                )}
                <div><Text strong>Condition:</Text> {form.getFieldValue('condition') || 'Not provided'}</div>
                <div><Text strong>Pickup Location:</Text> {form.getFieldValue('location') || 'Not provided'}</div>
                <div><Text strong>Description:</Text></div>
                <div style={{ marginLeft: 16 }}>{form.getFieldValue('description') || 'Not provided'}</div>
                <div><Text strong>Photos:</Text> {fileList.length} uploaded</div>
              </Space>
            </div>
          )}

          <Form.Item style={{ marginTop: 32 }}>
            <Space>
              {currentStep > 0 && (
                <Button onClick={() => setCurrentStep(currentStep - 1)}>
                  Previous
                </Button>
              )}
              {currentStep < 3 && (
                <Button 
                  type="primary" 
                  onClick={validateStep}
                >
                  Next
                </Button>
              )}
              {currentStep === 3 && (
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={submitting}
                >
                  List Item
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SellPage;
