const Cart = ({ items, onRemove, onUpdateQuantity }) => {
  const total = items.reduce((sum, item) => {
    return sum + (parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0);
  }, 0);

  if (items.length === 0) {
    return (
      <div className="w-full p-4 border border-gray-200 rounded-lg text-center text-gray-500">
        Корзина пуста
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <h3 className="text-lg font-semibold">Товары в заказе</h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="p-3 border border-gray-200 rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="font-medium">{item.name || item.title}</p>
                {item.article && (
                  <p className="text-sm text-gray-600">Артикул: {item.article}</p>
                )}
              </div>
              <button
                onClick={() => onRemove(index)}
                className="text-red-600 hover:text-red-800 ml-2"
              >
                ×
              </button>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Количество</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={item.quantity || 1}
                  onChange={(e) => onUpdateQuantity(index, parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Цена</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price || 0}
                  onChange={(e) => {
                    const updatedItem = { ...item, price: parseFloat(e.target.value) || 0 };
                    onUpdateQuantity(index, item.quantity, updatedItem);
                  }}
                />
              </div>
              <div className="text-right">
                <label className="block text-xs text-gray-600 mb-1">Сумма</label>
                <p className="font-semibold">
                  {((parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Итого:</span>
          <span className="text-lg font-bold">{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Cart;
