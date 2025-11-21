import { useState, useEffect, useCallback } from 'react';
import { setAuthToken, getPayboxes, getOrganizations, getWarehouses, getPriceTypes, createSale, searchClients, getAllClients } from './services/api';
import SelectField from './components/SelectField';
import ProductSearch from './components/ProductSearch';
import ProductList from './components/ProductList';

function App() {
  const [token, setToken] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [client, setClient] = useState(null);
  const [clientPhone, setClientPhone] = useState('');
  const [clients, setClients] = useState([]);
  const [payboxes, setPayboxes] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [priceTypes, setPriceTypes] = useState([]);
  const [selectedPaybox, setSelectedPaybox] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [selectedPriceType, setSelectedPriceType] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (token && isAuthenticated) {
      console.log('Token and authenticated, loading data...');
      setAuthToken(token);
      loadData();
    }
  }, [token, isAuthenticated]);

  const loadData = async () => {
    console.log('Loading data...');
    setLoading(true);
    try {
      console.log('Making API calls...');
      const [payboxesData, orgsData, whData, ptData] = await Promise.all([
        getPayboxes(),
        getOrganizations(),
        getWarehouses(),
        getPriceTypes(),
      ]);
      
      console.log('API responses:', {
        payboxes: payboxesData,
        organizations: orgsData,
        warehouses: whData,
        priceTypes: ptData
      });
      
      const payboxes = payboxesData || [];
      const organizations = orgsData || [];
      const warehouses = whData || [];
      const priceTypes = ptData || [];
      
      console.log('Processed data:', {
        payboxes: payboxes.length,
        organizations: organizations.length,
        warehouses: warehouses.length,
        priceTypes: priceTypes.length
      });
      
      if (payboxes.length > 0) {
        console.log('First paybox example:', payboxes[0]);
      }
      if (organizations.length > 0) {
        console.log('First organization example:', organizations[0]);
      }
      if (warehouses.length > 0) {
        console.log('First warehouse example:', warehouses[0]);
      }
      if (priceTypes.length > 0) {
        console.log('First price type example:', priceTypes[0]);
      }
      
      setPayboxes(payboxes);
      setOrganizations(organizations);
      setWarehouses(warehouses);
      setPriceTypes(priceTypes);

      if (payboxes.length === 0 && organizations.length === 0 && warehouses.length === 0 && priceTypes.length === 0) {
        setMessage({ 
          type: 'error', 
          text: 'Не удалось загрузить данные. Проверьте токен и попробуйте снова.' 
        });
      } else {
        const missingData = [];
        if (payboxes.length === 0) missingData.push('счета');
        if (organizations.length === 0) missingData.push('организации');
        if (warehouses.length === 0) missingData.push('склады');
        if (priceTypes.length === 0) missingData.push('типы цен');
        
        if (missingData.length > 0) {
          setMessage({ 
            type: 'error', 
            text: `Не удалось загрузить: ${missingData.join(', ')}` 
          });
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
      let errorMessage = 'Ошибка загрузки данных';
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Ошибка авторизации. Проверьте токен';
        } else if (err.response.status === 403) {
          errorMessage = 'Доступ запрещен. Проверьте права доступа';
        } else if (err.response.status >= 500) {
          errorMessage = 'Ошибка сервера. Попробуйте позже';
        } else if (err.response.status === 422) {
          const detail = err.response.data?.detail;
          if (Array.isArray(detail)) {
            const errors = detail.map(d => {
              if (typeof d === 'string') return d;
              if (d.msg) return d.msg;
              if (d.loc) return `${d.loc.join('.')}: ${d.msg || d.type || 'Ошибка'}`;
              return JSON.stringify(d);
            }).join(', ');
            errorMessage = `Ошибка валидации: ${errors}`;
          } else if (typeof detail === 'string') {
            errorMessage = detail;
          } else {
            errorMessage = 'Неверный формат запроса. Проверьте параметры API';
          }
          console.error('422 Error details:', err.response.data);
        } else if (err.response.status === 404) {
          errorMessage = 'Endpoint не найден. Проверьте настройки API';
        } else {
          const detail = err.response.data?.detail;
          const message = err.response.data?.message;
          if (Array.isArray(detail)) {
            errorMessage = detail.map(d => typeof d === 'string' ? d : d.msg || JSON.stringify(d)).join(', ');
          } else if (typeof detail === 'string') {
            errorMessage = detail;
          } else if (typeof message === 'string') {
            errorMessage = message;
          } else {
            errorMessage = `Ошибка ${err.response.status}: ${errorMessage}`;
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      const errorText = typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage);
      setMessage({ type: 'error', text: errorText });
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = () => {
    const trimmedToken = tokenInput.trim();
    if (trimmedToken) {
      console.log('Setting token:', trimmedToken.substring(0, 10) + '...');
      setToken(trimmedToken);
      localStorage.setItem('tablecrm_token', trimmedToken);
      setIsAuthenticated(true);
      setAuthToken(trimmedToken);
      setMessage({ type: 'success', text: 'Токен установлен. Загрузка данных...' });
    } else {
      setMessage({ type: 'error', text: 'Введите токен' });
    }
  };

  const handleLoadAllClients = useCallback(async () => {
    if (!token) {
      return;
    }
    
    console.log('Loading all clients');
    setLoading(true);
    try {
      const data = await getAllClients();
      console.log('All clients result:', data);
      const clients = Array.isArray(data) ? data : [];
      console.log('Setting all clients:', clients.length);
      setClients(clients);
    } catch (err) {
      console.error('Error loading all clients:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
      }
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleClientSearch = useCallback(async () => {
    if (!clientPhone.trim() || !token) {
      console.log('Client search skipped:', { hasPhone: !!clientPhone.trim(), hasToken: !!token });
      if (!clientPhone.trim()) {
        await handleLoadAllClients();
      } else {
        setClients([]);
      }
      return;
    }
    
    console.log('Searching clients with phone:', clientPhone);
    setLoading(true);
    try {
      const data = await searchClients(clientPhone);
      console.log('Clients search result:', data);
      const clients = Array.isArray(data) ? data : [];
      console.log('Setting clients:', clients.length, clients);
      setClients(clients);
      
      if (clients.length === 0 && clientPhone.trim().length >= 3) {
        setMessage({ type: 'error', text: 'Клиент с таким телефоном не найден' });
      }
    } catch (err) {
      console.error('Error searching clients:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
      }
      setClients([]);
      
      let errorMessage = 'Ошибка поиска клиента';
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Ошибка авторизации. Проверьте токен';
        } else if (err.response.status === 404) {
          errorMessage = 'Клиент не найден';
        } else {
          const detail = err.response.data?.detail;
          const message = err.response.data?.message;
          if (Array.isArray(detail)) {
            errorMessage = detail.map(d => typeof d === 'string' ? d : d.msg || JSON.stringify(d)).join(', ');
          } else if (typeof detail === 'string') {
            errorMessage = detail;
          } else if (typeof message === 'string') {
            errorMessage = message;
          }
        }
      }
      const errorText = typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage);
      setMessage({ type: 'error', text: errorText });
    } finally {
      setLoading(false);
    }
  }, [clientPhone, token, handleLoadAllClients]);

  useEffect(() => {
    if (clientPhone.trim() && token && clientPhone.trim().length >= 3) {
      console.log('Auto-search triggered for phone:', clientPhone);
      const timer = setTimeout(() => {
        handleClientSearch();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setClients([]);
    }
  }, [clientPhone, token, handleClientSearch]);

  const handleSelectClient = (selectedClient) => {
    setClient(selectedClient);
    const clientPhoneNum = selectedClient.phone || selectedClient.phone_number || '';
    setClientPhone(clientPhoneNum);
    setClients([]);
  };

  const handleClearClient = () => {
    setClient(null);
    setClientPhone('');
    setClients([]);
  };

  const handleAddProduct = (product) => {
    const existingIndex = cartItems.findIndex(item => item.id === product.id);
    if (existingIndex >= 0) {
      const updatedItems = [...cartItems];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: (parseFloat(updatedItems[existingIndex].quantity) || 0) + (parseFloat(product.quantity) || 1)
      };
      setCartItems(updatedItems);
    } else {
      setCartItems([...cartItems, { ...product, id: product.id || Date.now() }]);
    }
  };

  const handleRemoveProduct = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index, quantity, updatedItem = null) => {
    const newItems = [...cartItems];
    if (updatedItem) {
      newItems[index] = { ...updatedItem, quantity };
    } else {
      newItems[index] = { ...newItems[index], quantity };
    }
    setCartItems(newItems);
  };

  const handleCreateSale = async (conduct = false) => {
    console.log('handleCreateSale called with conduct:', conduct);
    console.log('Current state:', {
      client,
      selectedPaybox,
      selectedOrganization,
      selectedWarehouse,
      selectedPriceType,
      cartItemsLength: cartItems.length,
      token: token ? 'present' : 'missing'
    });

    if (!client || !selectedPaybox || !selectedOrganization || !selectedWarehouse || !selectedPriceType) {
      setMessage({ type: 'info', text: 'Заполните все обязательные поля' });
      return;
    }
    if (cartItems.length === 0) {
      setMessage({ type: 'error', text: 'Добавьте товары в заказ' });
      return;
    }

    if (!token) {
      setMessage({ type: 'error', text: 'Токен не установлен' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const clientId = client.id || client.pk || client._id;
    const clientIdNum = typeof clientId === 'string' ? parseInt(clientId, 10) : clientId;
    console.log('Client ID:', clientId, 'Client ID (parsed):', clientIdNum, 'Client object:', client);

    const payload = {
      contragent: isNaN(clientIdNum) ? clientId : clientIdNum,
      pbox: isNaN(parseInt(selectedPaybox, 10)) ? selectedPaybox : parseInt(selectedPaybox, 10),
      organization: isNaN(parseInt(selectedOrganization, 10)) ? selectedOrganization : parseInt(selectedOrganization, 10),
      warehouse: isNaN(parseInt(selectedWarehouse, 10)) ? selectedWarehouse : parseInt(selectedWarehouse, 10),
      price_type: isNaN(parseInt(selectedPriceType, 10)) ? selectedPriceType : parseInt(selectedPriceType, 10),
      items: cartItems.map((item) => {
        const itemId = item.id || item.pk || item._id;
        const itemIdNum = typeof itemId === 'string' ? parseInt(itemId, 10) : itemId;
        console.log('Mapping item:', item, 'Item ID:', itemId, 'Item ID (parsed):', itemIdNum);
        return {
          nomenclature: isNaN(itemIdNum) ? itemId : itemIdNum,
          quantity: parseFloat(item.quantity) || 1,
          price: parseFloat(item.price) || 0,
        };
      }),
    };

    console.log('Sending payload:', JSON.stringify(payload, null, 2));
    console.log('Conduct:', conduct);

    try {
      const result = await createSale(payload, conduct);
      console.log('Sale created successfully:', result);
      
      if (result) {
        const successMessage = conduct 
          ? 'Продажа успешно создана и проведена' 
          : 'Продажа успешно создана';
        setMessage({ type: 'success', text: successMessage });
        
        setCartItems([]);
        setClient(null);
        setClientPhone('');
        setSelectedPaybox('');
        setSelectedOrganization('');
        setSelectedWarehouse('');
        setSelectedPriceType('');
      } else {
        setMessage({ type: 'error', text: 'Не удалось создать продажу. Ответ сервера пуст' });
      }
    } catch (err) {
      console.error('Error creating sale:', err);
      
      let errorMessage = 'Ошибка при создании продажи';
      
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
        
        if (err.response.status === 401) {
          errorMessage = 'Ошибка авторизации. Проверьте токен';
        } else if (err.response.status === 400) {
          const detail = err.response.data?.detail;
          const message = err.response.data?.message;
          if (Array.isArray(detail)) {
            console.error('Detail array:', detail);
            detail.forEach((d, idx) => {
              console.error(`Detail[${idx}]:`, d);
            });
            errorMessage = detail.map(d => {
              if (typeof d === 'string') return d;
              if (d.msg) return d.msg;
              if (d.loc) return `${d.loc.join('.')}: ${d.msg || d.type || 'Ошибка'}`;
              return JSON.stringify(d);
            }).join(', ');
          } else if (typeof detail === 'string') {
            errorMessage = detail;
          } else if (typeof message === 'string') {
            errorMessage = message;
          } else {
            errorMessage = 'Неверные данные. Проверьте заполненные поля';
          }
        } else if (err.response.status === 422) {
          const detail = err.response.data?.detail;
          console.error('422 Validation errors:', detail);
          if (Array.isArray(detail)) {
            detail.forEach((d, idx) => {
              console.error(`Validation error[${idx}]:`, d);
              if (d.loc) {
                console.error(`  Field: ${d.loc.join('.')}`);
                console.error(`  Message: ${d.msg}`);
                console.error(`  Type: ${d.type}`);
              }
            });
            errorMessage = detail.map(d => {
              if (typeof d === 'string') return d;
              const field = d.loc ? d.loc.join('.') : 'Поле';
              const msg = d.msg || d.type || 'Ошибка валидации';
              return `${field}: ${msg}`;
            }).join(', ');
          } else if (typeof detail === 'string') {
            errorMessage = detail;
          } else {
            errorMessage = 'Ошибка валидации данных. Проверьте заполненные поля';
          }
        } else if (err.response.status === 403) {
          errorMessage = 'Доступ запрещен. Недостаточно прав для создания продажи';
        } else if (err.response.status >= 500) {
          errorMessage = 'Ошибка сервера. Попробуйте позже';
        } else {
          const detail = err.response.data?.detail;
          const message = err.response.data?.message;
          if (Array.isArray(detail)) {
            errorMessage = detail.map(d => typeof d === 'string' ? d : d.msg || JSON.stringify(d)).join(', ');
          } else if (typeof detail === 'string') {
            errorMessage = detail;
          } else if (typeof message === 'string') {
            errorMessage = message;
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      const errorText = typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage);
      setMessage({ type: 'error', text: errorText });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + (parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0);
  }, 0);

  const formatAmount = (amount) => {
    const num = parseFloat(amount) || 0;
    return num % 1 === 0 ? num.toString() : num.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {message && message.type === 'success' && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 32px)',
            maxWidth: '420px',
            padding: '12px 16px',
            borderRadius: '10px',
            backgroundColor: '#00c566',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 500,
            fontSize: '14px',
            zIndex: 9999,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {message.text}
        </div>
      )}

      {message && message.type === 'info' && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 32px)',
            maxWidth: '420px',
            padding: '12px 16px',
            borderRadius: '10px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            textAlign: 'center',
            fontWeight: 500,
            fontSize: '14px',
            zIndex: 9999,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          {message.text}
        </div>
      )}

      <div 
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#fff',
          borderRadius: '16px',
          padding: '16px 16px 24px',
          boxShadow: '0 4px 12px #0f172a14',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {message && message.type === 'error' && (
          <div
            className="p-3 rounded-lg bg-red-50 text-red-800 border border-red-200"
          >
            {message.text}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label className="block text-sm font-medium">
                Токен
              </label>
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTokenSubmit()}
                placeholder="Введите токен"
                disabled={isAuthenticated}
              />
              <button
                onClick={handleTokenSubmit}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Продолжить
              </button>
            </div>

            {isAuthenticated && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
                  <label className="block text-sm font-medium">
                    Контрагент (поиск по телефону)
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => {
                        if (!client) {
                          setClientPhone(e.target.value);
                          console.log('Client phone changed:', e.target.value);
                        }
                      }}
                      onFocus={() => {
                        console.log('Client input focused');
                        if (!client && token) {
                          handleLoadAllClients();
                        }
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && !client && handleClientSearch()}
                      placeholder="Введите номер телефона"
                      disabled={!!client}
                      style={{ flex: 1, width: 'auto', paddingRight: client ? '40px' : '12px' }}
                    />
                    {client && (
                      <button
                        type="button"
                        onClick={handleClearClient}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          border: 'none',
                          backgroundColor: '#e5e7eb',
                          color: '#6b7280',
                          fontSize: '16px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: '1'
                        }}
                      >
                        ×
                      </button>
                    )}
                    
                    {clients.length > 0 && !client && (
                      <div 
                        className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto" 
                        style={{ 
                          top: '100%', 
                          marginTop: '4px',
                          left: 0,
                          right: 0
                        }}
                      >
                        {clients.map((c, index) => {
                          const clientId = c.id || c.pk || c._id || index;
                          const clientPhoneNum = c.phone || c.phone_number || '';
                          const clientName = c.name || c.title || c.label || '';
                          console.log('Rendering client:', { clientId, clientPhoneNum, clientName });
                          return (
                            <div
                              key={clientId}
                              onClick={() => {
                                console.log('Client selected:', c);
                                handleSelectClient(c);
                              }}
                              className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                              style={{ padding: '12px 16px' }}
                            >
                              <p className="font-medium text-sm" style={{ wordSpacing: '4px', paddingLeft: '4px' }}>
                                {clientPhoneNum} {clientPhoneNum && clientName ? <span style={{ color: '#6b7280' }}>—</span> : ''} <span style={{ color: '#6b7280' }}>{clientName}</span>
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {loading && clientPhone.trim().length >= 3 && clients.length === 0 && !client && (
                      <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-3" style={{ top: '100%', marginTop: '4px', left: 0, right: 0 }}>
                        <p className="text-sm text-gray-600">Поиск...</p>
                      </div>
                    )}
                  </div>
                  
                  {client && (
                    <p className="text-sm font-bold text-black">
                      Выбран контрагент: {client.name || client.title || 'Клиент'}
                    </p>
                  )}
                </div>

                <SelectField
                  label="Счёт поступления"
                  value={selectedPaybox}
                  options={payboxes}
                  onChange={setSelectedPaybox}
                  loading={loading}
                />

                <SelectField
                  label="Склад отгрузки"
                  value={selectedWarehouse}
                  options={warehouses}
                  onChange={setSelectedWarehouse}
                  loading={loading}
                />

                <SelectField
                  label="Организация"
                  value={selectedOrganization}
                  options={organizations}
                  onChange={setSelectedOrganization}
                  loading={loading}
                />

                <SelectField
                  label="Тип цены"
                  value={selectedPriceType}
                  options={priceTypes}
                  onChange={setSelectedPriceType}
                  loading={loading}
                />

                <ProductSearch
                  token={token}
                  onAddProduct={handleAddProduct}
                  cartItems={cartItems}
                />

                <ProductList
                  items={cartItems}
                  onRemove={handleRemoveProduct}
                  onUpdateQuantity={handleUpdateQuantity}
                />

                <div className="pt-4 space-y-3 border-t">
                  {client && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Контрагент:</span>
                      <span className="text-sm font-semibold">{client.name || client.title || 'Клиент'}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Итого товаров:</span>
                    <span className="text-sm font-semibold">{cartItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Сумма:</span>
                    <span className="text-sm font-semibold">{formatAmount(totalAmount)} ₽</span>
                  </div>
      </div>

                <div 
                  style={{
                    marginTop: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Create sale button clicked');
                      handleCreateSale(false);
                    }}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
                  >
                    Создать продажу
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Create and conduct button clicked');
                      handleCreateSale(true);
                    }}
                    disabled={loading}
                    className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors font-medium"
                  >
                    Создать и провести
        </button>
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
}

export default App;