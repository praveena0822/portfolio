import { useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import Section from './ui/Section.jsx';
import { messagesApi, errorMessage } from '../services/api.js';

const EMPTY = { name: '', email: '', subject: '', message: '', website: '' };

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  if (v.subject.trim().length < 3) e.subject = 'Please enter a subject (at least 3 characters).';
  if (v.message.trim().length < 10) e.message = 'Message must be at least 10 characters.';
  if (v.message.length > 5000) e.message = 'Message must be 5000 characters or fewer.';
  return e;
}

export default function Contact({ profile }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: 'idle', text: '' });
  const sending = status.type === 'sending';

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus({ type: 'error', text: 'Please fix the highlighted fields.' });
      document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setStatus({ type: 'sending', text: '' });
    try {
      const res = await messagesApi.send({ ...values });
      setStatus({ type: 'success', text: res.message || 'Message sent. Thank you!' });
      setValues(EMPTY);
    } catch (err) {
      setStatus({ type: 'error', text: errorMessage(err, 'Your message could not be sent. Please try again.') });
    }
  };

  const field = (name, label, props = {}) => (
    <div>
      <label htmlFor={`contact-${name}`} className="label">{label}</label>
      {props.rows ? (
        <textarea id={`contact-${name}`} value={values[name]} onChange={set(name)} className="input" aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `err-${name}` : undefined} maxLength={5000} required {...props} />
      ) : (
        <input id={`contact-${name}`} value={values[name]} onChange={set(name)} className="input" aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `err-${name}` : undefined} required {...props} />
      )}
      {errors[name] && <p id={`err-${name}`} className="mt-1 text-sm text-red-700 dark:text-red-400">{errors[name]}</p>}
    </div>
  );

  return (
    <Section id="contact" title="Contact">
      <div className="grid gap-6 md:grid-cols-5">
        <div className="text-sm md:col-span-2">
          <p className="leading-relaxed">
            Interested in collaboration, research discussions or academic opportunities? Send a message and I will reply by email.
          </p>
          {profile.email && (
            <p className="mt-3">
              Or write directly to <a className="link" href={`mailto:${profile.email}`}>{profile.email}</a>
            </p>
          )}
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-4 md:col-span-3" aria-describedby="contact-status">
          {field('name', 'Name', { type: 'text', autoComplete: 'name', maxLength: 120 })}
          {field('email', 'Email', { type: 'email', autoComplete: 'email', maxLength: 160 })}
          {field('subject', 'Subject', { type: 'text', maxLength: 200 })}
          {field('message', 'Message', { rows: 5 })}
          {/* Honeypot: hidden from people, tempting for bots. */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label>Website<input tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} /></label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className="btn-primary" disabled={sending}>
              {sending ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
              {sending ? 'Sending…' : 'Send message'}
            </button>
            <p id="contact-status" role={status.type === 'error' ? 'alert' : 'status'} className={`flex items-center gap-1.5 text-sm ${status.type === 'error' ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
              {status.type === 'success' && <CheckCircle2 size={16} aria-hidden="true" />}
              {status.text}
            </p>
          </div>
        </form>
      </div>
    </Section>
  );
}
