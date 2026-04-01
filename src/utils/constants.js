export const CATEGORIES = [
  { value: 'books', label: 'Books', icon: '📚', color: '#1890ff' },
  { value: 'electronics', label: 'Electronics', icon: '💻', color: '#52c41a' },
  { value: 'calculators', label: 'Calculators', icon: '🧮', color: '#faad14' },
  { value: 'lab-equipment', label: 'Lab Equipment', icon: '🔬', color: '#f5222d' },
  { value: 'furniture', label: 'Furniture', icon: '🪑', color: '#722ed1' },
  { value: 'stationery', label: 'Stationery', icon: '✏️', color: '#13c2c2' },
  { value: 'other', label: 'Other', icon: '📦', color: '#8c8c8c' },
];

export const CONDITIONS = [
  { value: 'like-new', label: 'Like New', color: 'green', description: 'Perfect condition, no signs of use' },
  { value: 'excellent', label: 'Excellent', color: 'blue', description: 'Lightly used, minimal wear' },
  { value: 'good', label: 'Good', color: 'orange', description: 'Used but fully functional, some wear' },
  { value: 'fair', label: 'Fair', color: 'red', description: 'Significant wear but functional' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export const PAGE_SIZES = [12, 24, 48, 96];
export const DEFAULT_PAGE_SIZE = 12;

export const PRICE_RANGE = {
  min: 0,
  max: 1000,
  step: 10,
};

export const STATUS_COLORS = {
  active: 'green',
  pending: 'orange',
  sold: 'default',
  expired: 'red',
};

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  OFFER: 'offer',
};