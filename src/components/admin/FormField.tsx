interface FormFieldOption {
  label: string;
  value: string;
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'textarea' | 'number' | 'select';
  value?: string | number;
  error?: string;
  options?: FormFieldOption[];
  required?: boolean;
  placeholder?: string;
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  error,
  options = [],
  required = false,
  placeholder,
}: FormFieldProps) {
  const baseClasses =
    'w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10';
  const borderClass = error ? 'border-red-300' : 'border-gray-300';
  const inputClasses = `${baseClasses} ${borderClass}`;

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          defaultValue={value}
          required={required}
          placeholder={placeholder}
          rows={4}
          className={`${inputClasses} resize-y`}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          defaultValue={value}
          required={required}
          className={inputClasses}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={value}
          required={required}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
