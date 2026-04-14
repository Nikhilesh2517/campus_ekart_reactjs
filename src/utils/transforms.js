export const toAbsoluteUrl = (path) => {
  if (!path) {
    return null;
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const origin = apiBaseUrl.replace(/\/api\/?$/, '');

  return `${origin}${path}`;
};

export const normalizeUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    ...user,
    name: user.name || user.full_name || user.fullName || '',
    fullName: user.fullName || user.full_name || user.name || '',
    yearOfStudy: user.yearOfStudy || user.year_of_study || '',
    studentId: user.studentId || user.student_id || '',
    isVerified: typeof user.isVerified === 'boolean' ? user.isVerified : Boolean(user.is_verified),
    avatar: toAbsoluteUrl(user.avatar),
  };
};

export const normalizeProduct = (product) => {
  if (!product) {
    return null;
  }

  const images = Array.isArray(product.images) ? product.images.map(toAbsoluteUrl) : [];

  return {
    ...product,
    originalPrice: product.originalPrice ?? product.original_price ?? null,
    sellerName: product.sellerName || product.seller_name || '',
    sellerRating: Number(product.sellerRating ?? product.seller_rating ?? 0),
    location: product.location || '',
    images,
  };
};

export const normalizeOrder = (order) => {
  if (!order) {
    return null;
  }

  return {
    ...order,
    productTitle: order.productTitle || order.product_title || '',
    sellerName: order.sellerName || order.seller_name || order.otherPartyName || order.other_party_name || '',
    productImages: Array.isArray(order.productImages)
      ? order.productImages.map(toAbsoluteUrl)
      : Array.isArray(order.product_images)
        ? order.product_images.map(toAbsoluteUrl)
        : [],
  };
};
