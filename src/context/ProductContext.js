import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { getProducts } from '../services/productService';

const ProductContext = createContext();

const initialState = {
  products: [],
  loading: false,
  error: null,
  filters: {
    category: 'all',
    priceRange: [0, 1000],
    condition: [],
    search: '',
  },
  sortBy: 'newest',
  total: 0,
  currentPage: 1,
  pageSize: 12,
};

const productReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload.products, total: action.payload.total, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload }, currentPage: 1 };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload, currentPage: 1 };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_SEARCH':
      return { ...state, filters: { ...state.filters, search: action.payload }, currentPage: 1 };
    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters, sortBy: initialState.sortBy, currentPage: 1 };
    default:
      return state;
  }
};

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const fetchProducts = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { filters, sortBy, currentPage, pageSize } = state;
      const response = await getProducts({
        ...filters,
        sort: sortBy,
        page: currentPage,
        limit: pageSize,
      });
      dispatch({ type: 'SET_PRODUCTS', payload: response });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [state.filters, state.sortBy, state.currentPage, state.pageSize]);

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const setSort = (sortBy) => {
    dispatch({ type: 'SET_SORT', payload: sortBy });
  };

  const setPage = (page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  };

  const setSearch = (search) => {
    dispatch({ type: 'SET_SEARCH', payload: search });
  };

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  const value = {
    ...state,
    fetchProducts,
    setFilters,
    setSort,
    setPage,
    setSearch,
    resetFilters,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};