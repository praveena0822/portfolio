// Renders one labelled form control; used by every admin form.
export default function FormField({ field, value, onChange, error }) {
  const id = `f-${field.name}`;
  const describedBy = [field.help && `${id}-help`, error && `${id}-err`].filter(Boolean).join(' ') || undefined;
  const common = { id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy };

  if (field.type === 'checkbox') {
    return (
      <div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-gray-400 accent-brand" {...common} />
          {field.label}
        </label>
        {field.help && <p id={`${id}-help`} className="mt-1 text-xs text-muted dark:text-muted-dark">{field.help}</p>}
      </div>
    );
  }

  let control;
  if (field.type === 'textarea' || field.type === 'list') {
    control = <textarea {...common} className="input" rows={field.rows || 3} value={value} maxLength={field.max} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />;
  } else if (field.type === 'select') {
    control = (
      <select {...common} className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {field.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    );
  } else {
    control = (
      <input
        {...common}
        className="input"
        type={field.type === 'number' ? 'number' : field.type === 'url' ? 'url' : field.type === 'email' ? 'email' : 'text'}
        min={field.type === 'number' ? 0 : undefined}
        value={value}
        maxLength={field.max}
        placeholder={field.type === 'url' ? 'https://' : field.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <div>
      <label htmlFor={id} className="label">
        {field.label}{field.required && <span className="text-red-700 dark:text-red-400" aria-hidden="true"> *</span>}
      </label>
      {control}
      {field.help && <p id={`${id}-help`} className="mt-1 text-xs text-muted dark:text-muted-dark">{field.help}</p>}
      {error && <p id={`${id}-err`} className="mt-1 text-sm text-red-700 dark:text-red-400">{error}</p>}
    </div>
  );
}
