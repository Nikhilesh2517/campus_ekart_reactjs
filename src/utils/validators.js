export const validateEmail = (email) => {
  const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
  return re.test(email);
};

export const validateUniversityEmail = (email) => {
  const re = /^[^\s@]+@.*\.edu$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 8;
};

export const validatePhone = (phone) => {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(phone);
};

export const validatePrice = (price) => {
  return price && price > 0 && !isNaN(price);
};

export const validateProductTitle = (title) => {
  return title && title.length >= 3 && title.length <= 100;
};

export const validateProductDescription = (description) => {
  return description && description.length >= 20 && description.length <= 2000;
};

export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }
  if (file.size > maxSize) {
    return { valid: false, error: 'Image must be less than 5MB' };
  }
  return { valid: true, error: null };
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};