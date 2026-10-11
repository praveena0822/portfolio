import { useCallback, useEffect, useState } from 'react';
import { Inbox, Loader2, Mail, MailOpen, Trash2 } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import { messagesApi, errorMessage } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function MessagesManager() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await messagesApi.list());
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const toggleRead = async (m, read) => {
    try {
      const updated = await messagesApi.setRead(m._id, read);
      setItems((list) => list.map((x) => (x._id === m._id ? updated : x)));
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  const expand = (m) => {
    const next = openId === m._id ? null : m._id;
    setOpenId(next);
    if (next && !m.read) toggleRead(m, true);
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await messagesApi.remove(deleting._id);
      toast.success('Message deleted.');
      setDeleting(null);
      load();
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const unread = items.filter((m) => !m.read).length;

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Messages{unread > 0 && <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-xs text-white">{unread} new</span>}</h2>
      {loading ? (
        <div className="flex items-center gap-2 py-8" role="status"><Loader2 className="animate-spin" size={18} />Loading…</div>
      ) : error ? (
        <div role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-900 dark:bg-red-950 dark:text-red-100">{error} <button className="underline" onClick={load}>Try again</button></div>
      ) : items.length === 0 ? (
        <EmptyState icon={Inbox} title="No messages yet">Messages sent from your contact form will appear here.</EmptyState>
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line dark:divide-line-dark dark:border-line-dark">
          {items.map((m) => (
            <li key={m._id} className={m.read ? '' : 'bg-brand/5'}>
              <button className="flex w-full items-start gap-3 p-3 text-left" onClick={() => expand(m)} aria-expanded={openId === m._id}>
                {m.read ? <MailOpen size={18} className="mt-0.5 shrink-0 text-muted" aria-hidden="true" /> : <Mail size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />}
                <span className="min-w-0 flex-1">
                  <span className={`block truncate ${m.read ? '' : 'font-semibold'}`}>{m.subject}</span>
                  <span className="block truncate text-sm text-muted dark:text-muted-dark">{m.name} · {new Date(m.createdAt).toLocaleString()}</span>
                </span>
              </button>
              {openId === m._id && (
                <div className="space-y-3 px-4 pb-4 pl-11 text-sm">
                  <p className="whitespace-pre-wrap">{m.message}</p>
                  <p className="text-muted dark:text-muted-dark">
                    From {m.name} &lt;{m.email}&gt;{!m.emailNotified && ' · email notification was not sent'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a className="btn-outline !py-1.5" href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}>Reply by email</a>
                    <button className="btn-ghost !py-1.5" onClick={() => toggleRead(m, !m.read)}>Mark as {m.read ? 'unread' : 'read'}</button>
                    <button className="btn-ghost !py-1.5 hover:!text-red-700" onClick={() => setDeleting(m)}><Trash2 size={14} aria-hidden="true" />Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {deleting && (
        <Modal title="Delete this message?" onClose={() => !busy && setDeleting(null)}>
          <p className="text-sm">The message from {deleting.name} will be permanently deleted.</p>
          <div className="mt-5 flex justify-end gap-2">
            <button className="btn-ghost" onClick={() => setDeleting(null)} disabled={busy}>Cancel</button>
            <button className="btn-danger" onClick={confirmDelete} disabled={busy}>{busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
