import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { debounce } from '../utils/helpers';

const { Search } = Input;

const SearchBar = ({ onSearch, placeholder = 'Search books, gadgets, equipment...', initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);

  const debouncedSearch = debounce((searchValue) => {
    onSearch(searchValue);
  }, 500);

  useEffect(() => {
    debouncedSearch(value);
  }, [value]);

  const handleSearch = () => {
    onSearch(value);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <Search
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onSearch={handleSearch}
      enterButton={<Button type="primary" icon={<SearchOutlined />}>Search</Button>}
      size="large"
      allowClear
    />
  );
};

export default SearchBar;