const SelectField = ({ label, value, options, onChange, placeholder, loading }) => {
  console.log(`SelectField ${label}:`, { optionsCount: options?.length, options });
  
  if (!Array.isArray(options)) {
    console.warn(`SelectField ${label}: options is not an array`, options);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label className="block text-sm font-medium">
          {label}
        </label>
        <select disabled className="appearance-none pr-8">
          <option>Нет данных</option>
        </select>
      </div>
    );
  }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <label className="block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none pr-8"
          disabled={loading}
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23666\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
        >
          <option value="">{placeholder || 'Выберите...'}</option>
          {options.map((option) => {
            const optionId = option.id || option.pk || option._id;
            const optionName = option.name || option.title || option.label || optionId;
            return (
              <option key={optionId} value={optionId}>
                {optionName}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default SelectField;
