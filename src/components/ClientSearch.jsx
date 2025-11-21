import { useState } from 'react';
import { searchClients } from '../services/api';

const ClientSearch = ({ token, onSelectClient, selectedClient }) => {
  const [phone, setPhone] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!phone.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await searchClients(phone);
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Ошибка при поиске клиента');
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (client) => {
    onSelectClient(client);
    setPhone('');
    setClients([]);
  };

  return (
    <div className="w-full space-y-2">
      <label className="block text-sm font-medium">
        Телефон клиента
      </label>
      <div className="flex gap-2">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Введите телефон"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '...' : 'Найти'}
        </button>
      </div>
      
      {selectedClient && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800">
            Выбран: {selectedClient.name || selectedClient.title || 'Клиент'}
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {clients.length > 0 && !selectedClient && (
        <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
          {clients.map((client) => (
            <div
              key={client.id}
              onClick={() => handleSelect(client)}
              className="p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer"
            >
              <p className="font-medium">{client.name || client.title}</p>
              {client.phone && (
                <p className="text-sm text-gray-600">{client.phone}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientSearch;
