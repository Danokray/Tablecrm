const ProductList = ({ items, onRemove, onUpdateQuantity }) => {
  if (items.length === 0) {
    return null;
  }

  const formatAmount = (amount) => {
    if (amount % 1 === 0) {
      return `${amount}`;
    }
    return `${amount.toFixed(2)}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
      {items.map((item, index) => {
        const itemPrice = parseFloat(item.price) || 0;
        const itemQuantity = parseFloat(item.quantity) || 1;
        const totalAmount = itemPrice * itemQuantity;

        return (
          <div
            key={item.id || index}
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px' }}>
                {item.name || item.title || 'Товар'}
              </p>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                {formatAmount(itemPrice)} ₽
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => {
                  const newQuantity = itemQuantity - 1;
                  if (newQuantity > 0) {
                    onUpdateQuantity(index, newQuantity, item);
                  } else {
                    onRemove(index);
                  }
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                −
              </button>
              <span style={{ minWidth: '24px', textAlign: 'center', fontSize: '14px', fontWeight: 500 }}>
                {itemQuantity}
              </span>
              <button
                onClick={() => {
                  const newQuantity = itemQuantity + 1;
                  onUpdateQuantity(index, newQuantity, item);
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                +
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
