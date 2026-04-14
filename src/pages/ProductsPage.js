import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Drawer, Empty, Input, Pagination, Row, Select, Slider, Space, Typography } from 'antd';
import { FilterOutlined, SearchOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getProducts, saveProduct, unsaveProduct } from '../services/productService';
import { CONDITIONS, CATEGORIES } from '../utils/constants';
import { normalizeProduct } from '../utils/transforms';

const { Title, Text } = Typography;

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(Number(searchParams.get('page') || 1));
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [condition, setCondition] = useState(searchParams.get('condition') || '');
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get('minPrice') || 0),
    Number(searchParams.get('maxPrice') || 1000),
  ]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts({
        page,
        limit: 12,
        search: search || undefined,
        sort: sortBy,
        category: category === 'all' ? undefined : category,
        condition: condition || undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
      });

      setProducts((response.products || []).map(normalizeProduct));
      setTotal(response.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    setSearchParams({
      ...(search ? { search } : {}),
      ...(sortBy ? { sort: sortBy } : {}),
      ...(category !== 'all' ? { category } : {}),
      ...(condition ? { condition } : {}),
      ...(priceRange[0] > 0 ? { minPrice: String(priceRange[0]) } : {}),
      ...(priceRange[1] < 1000 ? { maxPrice: String(priceRange[1]) } : {}),
      page: String(page),
    });
  }, [page, search, sortBy, category, condition, priceRange]);

  const filterContent = useMemo(
    () => (
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Text strong>Category</Text>
          <Select value={category} onChange={(value) => { setCategory(value); setPage(1); }} style={{ width: '100%', marginTop: 8 }}>
            <Select.Option value="all">All Categories</Select.Option>
            {CATEGORIES.map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div>
          <Text strong>Condition</Text>
          <Select allowClear value={condition || undefined} onChange={(value) => { setCondition(value || ''); setPage(1); }} style={{ width: '100%', marginTop: 8 }}>
            {CONDITIONS.map((item) => (
              <Select.Option key={item.label} value={item.label}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div>
          <Text strong>Price Range</Text>
          <Slider range min={0} max={1000} value={priceRange} onChange={(value) => { setPriceRange(value); setPage(1); }} style={{ marginTop: 12 }} />
          <Text type="secondary">£{priceRange[0]} to £{priceRange[1]}</Text>
        </div>

        <Button onClick={() => { setCategory('all'); setCondition(''); setPriceRange([0, 1000]); setPage(1); }} block>
          Reset Filters
        </Button>
      </Space>
    ),
    [category, condition, priceRange]
  );

  const handleSave = async (productId) => {
    const target = products.find((item) => item.id === productId);

    try {
      if (target?.saved) {
        await unsaveProduct(productId);
      } else {
        await saveProduct(productId);
      }

      setProducts((currentProducts) =>
        currentProducts.map((item) => (item.id === productId ? { ...item, saved: !item.saved } : item))
      );
    } catch (error) {
      // Ignore here; the API already carries the authoritative state.
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <Title level={2} style={{ margin: 0 }}>
          Marketplace
        </Title>
        <Space wrap>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onPressEnter={() => setPage(1)}
            prefix={<SearchOutlined />}
            placeholder="Search products..."
            style={{ width: 280 }}
          />
          <Select value={sortBy} onChange={(value) => { setSortBy(value); setPage(1); }} style={{ width: 180 }} suffixIcon={<SortAscendingOutlined />}>
            <Select.Option value="newest">Newest First</Select.Option>
            <Select.Option value="price-low">Price: Low to High</Select.Option>
            <Select.Option value="price-high">Price: High to Low</Select.Option>
            <Select.Option value="rating">Top Rated</Select.Option>
          </Select>
          <Button icon={<FilterOutlined />} onClick={() => setFilterDrawerVisible(true)}>
            Filters
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={0} md={6}>
          <Card style={{ position: 'sticky', top: 88 }}>{filterContent}</Card>
        </Col>

        <Col xs={24} md={18}>
          <div style={{ marginBottom: 16 }}>
            <Text type="secondary">Showing {products.length} of {total} results</Text>
          </div>

          {loading ? (
            <LoadingSpinner tip="Loading products..." />
          ) : products.length === 0 ? (
            <Empty description="No products found" />
          ) : (
            <>
              <Row gutter={[16, 16]}>
                {products.map((product) => (
                  <Col xs={24} sm={12} lg={8} key={product.id}>
                    <ProductCard product={product} saved={product.saved} onSave={handleSave} />
                  </Col>
                ))}
              </Row>

              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <Pagination current={page} total={total} pageSize={12} onChange={setPage} showSizeChanger={false} />
              </div>
            </>
          )}
        </Col>
      </Row>

      <Drawer title="Filters" placement="right" width={320} onClose={() => setFilterDrawerVisible(false)} open={filterDrawerVisible}>
        {filterContent}
      </Drawer>
    </div>
  );
};

export default ProductsPage;
