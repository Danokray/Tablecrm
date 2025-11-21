import { useState, useEffect, useCallback } from 'react';
import { getNomenclature } from '../services/api';

const ProductSearch = ({ token, onAddProduct, cartItems }) => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const performSearch = useCallback(async () => {
    if (!search.trim() || search.trim().length < 2) {
      return;
    }

    setErrorMessage('');
    console.log('Searching products with query:', search);
    setLoading(true);
    try {
      const data = await getNomenclature({ search });
      console.log('Products search result:', data);
      const products = data || [];
      setProducts(products);
      setShowResults(true);
      console.log('Set products:', products.length, 'Show results:', true);
      
      if (products.length === 0) {
        console.warn('No products found for search:', search);
      }
    } catch (err) {
      console.error('Error searching products:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
      }
      setProducts([]);
      setShowResults(false);
      
      if (err.response?.status === 401) {
        console.error('Authorization error while searching products');
      }
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (search.trim().length >= 2 && token) {
      setErrorMessage('');
      const timer = setTimeout(() => {
        performSearch();
      }, 500);
      return () => clearTimeout(timer);
    } else if (search.trim().length > 0 && search.trim().length < 2) {
      setErrorMessage('Введите хотя бы 2 символа');
      setProducts([]);
      setShowResults(false);
    } else {
      setProducts([]);
      setShowResults(false);
    }
  }, [search, token, performSearch]);

  const handleSelectProduct = (product) => {
    onAddProduct({
      ...product,
      quantity: 1,
      price: product.price || 0,
    });
    setSearch('');
    setProducts([]);
    setShowResults(false);
    setErrorMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (search.trim().length < 2) {
        setErrorMessage('Введите хотя бы 2 символа');
        setProducts([]);
        setShowResults(false);
      } else {
        performSearch();
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
      <label className="block text-sm font-medium">
        Поиск товара
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          onKeyPress={handleKeyPress}
          onFocus={() => {
            if (products.length > 0) {
              setShowResults(true);
            }
            if (search.trim().length === 0) {
              setErrorMessage('Введите хотя бы 2 символа');
            } else if (search.trim().length < 2) {
              setErrorMessage('Введите хотя бы 2 символа');
            }
          }}
          placeholder="Введите название"
        />
        
        {errorMessage && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto" style={{ zIndex: 1000, top: '100%', marginTop: '4px', left: 0, right: 0 }}>
            <div className="border-b border-gray-200 last:border-b-0" style={{ padding: '12px 16px' }}>
              <p className="font-medium">{errorMessage}</p>
            </div>
          </div>
        )}
        
        {showResults && products.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto" style={{ zIndex: 1000, top: '100%', marginTop: '4px', left: 0, right: 0 }}>
            {products.map((product, index) => {
              const productId = product.id || product.pk || product._id || index;
              const productName = product.name || product.title || product.label || 'Товар';
              return (
                <div
                  key={productId}
                  className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                  style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ flex: 1 }}>
                    <p className="font-medium">{productName}</p>
                    {product.article && (
                      <p className="text-sm text-gray-600">Артикул: {product.article}</p>
                    )}
                    {product.price && (
                      <p className="text-sm text-gray-600">Цена: {product.price}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleSelectProduct(product)}
                    className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    style={{ marginLeft: '12px', whiteSpace: 'nowrap' }}
                  >
                    добавить
                  </button>
                </div>
              );
            })}
          </div>
        )}
        
        {loading && !errorMessage && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3" style={{ top: '100%', marginTop: '4px', left: 0, right: 0 }}>
            <p className="text-sm text-gray-600">Поиск...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
