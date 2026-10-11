import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Pencil, Plus, Trash2, Inbox } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import FormField from './FormField.jsx';
import { resourceApi, errorMessage } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { listToText, textToList } from '../../utils/helpers.js';

const URL_RE = /^https?:\/\/\S+$/i;

function initialValues(fields, record) {
  return Object.fromEntries(
    fields.map((f) => {
      const raw = record?.[f.name];
      if (f.type === 'list') return [f.name, listToText(raw, f.sep)];
      if (f.type === 'checkbox') return [f.name, Boolean(raw)];
      if (f.type === 'number') return [f.name, raw ?? 0];
      if (f.type === 'select') return [f.name, raw ?? f.options[0][0]];
      return [f.name, raw ?? ''];
    })
  );
}

function toPayload(fields, values) {
  return Object.fromEntries(
    fields.map((f) => {
      const v = values[f.name];
      if (f.type === 'list') return [f.name, textToList(v, f.sep)];
      if (f.type === 'number') return [f.name, Number(v) || 0];
      if (f.type === 'checkbox') return [f.name, Boolean(v)];
      return [f.name, typeof v === 'string' ? v.trim() : v];
    })
  );
}

function validate(fields, values) {
  const errors = {};
  fields.forEach((f) => {
    const v = values[f.name];
    if (f.required && !String(v).trim()) errors[f.name] = `${f.label} is required.`;
    else if (f.type === 'url' && String(v).trim() && !URL_RE.test(String(v).trim())) errors[f.name] = 'Enter a full link starting with http:// or https://';
    else if (f.type === 'list' && f.name === 'bullets' && textToList(v, f.sep).length > 8) errors[f.name] = 'Use at most 8 bullets.';
  });
  return errors;
}

function RecordForm({ config, record, onSaved, onCancel, api }) {
  const toast = useToast();
  const [values, setValues] = useState(() => initialValues(config.fields, record));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(config.fields, values);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true);
    setFormError('');
    try {
      const payload = toPayload(config.fields, values);
      if (record) await api.update(record._id, payload);
      else await api.create(payload);
      toast.success(`${record ? 'Changes saved' : 'Added'}.`);
      onSaved();
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {config.fields.map((f) => (
        <FormField
          key={f.name}
          field={f}
          value={values[f.name]}
          error={errors[f.name]}
          onChange={(v) => {
            setValues((s) => ({ ...s, [f.name]: v }));
            if (errors[f.name]) setErrors((er) => ({ ...er, [f.name]: undefined }));
          }}
        />
      ))}
      {formError && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-900 dark:bg-red-950 dark:text-red-100">{formError}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}

export default function ResourceManager({ config }) {
  const toast = useToast();
  const api = useMemo(() => resourceApi(config.endpoint), [config.endpoint]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | record
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await api.list());
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { load(); }, [load]);

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await api.remove(deleting._id);
      toast.success('Deleted.');
      setDeleting(null);
      load();
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{config.label}</h2>
        <button className="btn-primary" onClick={() => setEditing('new')}><Plus size={16} aria-hidden="true" />Add {config.singular}</button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-muted dark:text-muted-dark" role="status"><Loader2 className="animate-spin" size={18} />Loading…</div>
      ) : error ? (
        <div role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-900 dark:bg-red-950 dark:text-red-100">
          {error} <button className="underline" onClick={load}>Try again</button>
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={Inbox} title={`No ${config.label.toLowerCase()} yet`}>Use the button above to add your first {config.singular}.</EmptyState>
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line dark:divide-line-dark dark:border-line-dark">
          {items.map((r) => (
            <li key={r._id} className="flex items-center justify-between gap-3 p-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{config.title(r)}</p>
                <p className="truncate text-sm text-muted dark:text-muted-dark">{config.subtitle(r)}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button className="btn-ghost !p-2" onClick={() => setEditing(r)} aria-label={`Edit ${config.title(r)}`}><Pencil size={16} /></button>
                <button className="btn-ghost !p-2 hover:!text-red-700" onClick={() => setDeleting(r)} aria-label={`Delete ${config.title(r)}`}><Trash2 size={16} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <Modal wide title={editing === 'new' ? `Add ${config.singular}` : `Edit ${config.singular}`} onClose={() => setEditing(null)}>
          <RecordForm
            config={config}
            api={api}
            record={editing === 'new' ? null : editing}
            onCancel={() => setEditing(null)}
            onSaved={() => { setEditing(null); load(); }}
          />
        </Modal>
      )}

      {deleting && (
        <Modal title="Delete this entry?" onClose={() => !busy && setDeleting(null)}>
          <p className="text-sm">“{config.title(deleting)}” will be removed from your public portfolio. This cannot be undone.</p>
          <div className="mt-5 flex justify-end gap-2">
            <button className="btn-ghost" onClick={() => setDeleting(null)} disabled={busy}>Cancel</button>
            <button className="btn-danger" onClick={confirmDelete} disabled={busy}>
              {busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
