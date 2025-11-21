import { useState, useEffect } from 'react';
import { getNomenclature } from '../services/api';

const ProductModal = ({ isOpen, onClose, onAddProduct, token }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (isOpen && token) {
      loadProducts();
    }
  }, [isOpen, token]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getNomenclature({ search });
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadProducts();
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setPrice(product.price || 0);
    setQuantity(1);
  };

  const handleAdd = () => {
    if (selectedProduct) {
      onAddProduct({
        ...selectedProduct,
        quantity: parseFloat(quantity) || 1,
        price: parseFloat(price) || 0,
      });
      setSelectedProduct(null);
      setQuantity(1);
      setPrice(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Выбор товара</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Поиск товара..."
              className="flex-1"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Найти
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="text-center text-gray-500">Загрузка...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500">Товары не найдены</p>
          ) : (
            <div className="space-y-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedProduct?.id === product.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <p className="font-medium">{product.name || product.title}</p>
                  {product.article && (
                    <p className="text-sm text-gray-600">Артикул: {product.article}</p>
                  )}
                  {product.price && (
                    <p className="text-sm text-gray-600">Цена: {product.price}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedProduct && (
          <div className="p-4 border-t space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Количество</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Цена</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <button
              onClick={handleAdd}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
            >
              Добавить товар
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductModal;
