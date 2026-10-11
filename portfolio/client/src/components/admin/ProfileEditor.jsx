import { useEffect, useRef, useState } from 'react';
import { FileText, Loader2, Upload } from 'lucide-react';
import FormField from './FormField.jsx';
import { errorMessage, profileApi, uploadApi } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { initials, safeHref } from '../../utils/helpers.js';

const FIELDS = [
  { name: 'fullName', label: 'Full name', type: 'text', required: true, max: 120 },
  { name: 'headline', label: 'Professional headline', type: 'text', max: 220 },
  { name: 'summary', label: 'Short summary (shown in the profile header)', type: 'textarea', rows: 3, max: 600 },
  { name: 'about', label: 'About me (first person, 3–4 sentences)', type: 'textarea', rows: 6, max: 3000 },
  { name: 'location', label: 'Location', type: 'text', max: 120 },
  { name: 'email', label: 'Public email', type: 'email', max: 160 },
  { name: 'phone', label: 'Phone', type: 'text', max: 40 },
  { name: 'showPhone', label: 'Show my phone number on the public site', type: 'checkbox', help: 'Off by default. Your phone number is never exposed unless this is on.' },
];
const SOCIAL = [
  ['linkedin', 'LinkedIn URL'],
  ['github', 'GitHub URL'],
  ['scholar', 'Google Scholar URL'],
  ['orcid', 'ORCID URL'],
  ['website', 'Personal website URL'],
];
const URL_RE = /^https?:\/\/\S+$/i;

function FileUpload({ label, accept, maxMb, kind, onUploaded, children, currentLabel }) {
  const toast = useToast();
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const onPick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > maxMb * 1024 * 1024) return toast.error(`File is too large. Maximum size is ${maxMb} MB.`);
    setBusy(true);
    try {
      const data = await uploadApi.send(kind, file);
      onUploaded(data);
      toast.success(`${label} uploaded.`);
    } catch (err) {
      toast.error(errorMessage(err, 'Upload failed.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {children}
      <div>
        <input ref={inputRef} type="file" accept={accept} className="sr-only" id={`upload-${kind}`} onChange={onPick} disabled={busy} />
        <label htmlFor={`upload-${kind}`} className={`btn-outline cursor-pointer ${busy ? 'pointer-events-none opacity-60' : ''}`}>
          {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Upload size={16} aria-hidden="true" />}
          {busy ? 'Uploading…' : currentLabel}
        </label>
        <p className="mt-1 text-xs text-muted dark:text-muted-dark">Max {maxMb} MB.</p>
      </div>
    </div>
  );
}

export default function ProfileEditor() {
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [values, setValues] = useState(null);
  const [errors, setErrors] = useState({});
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    profileApi
      .getAdmin()
      .then((p) => {
        setProfile(p);
        setValues({
          ...Object.fromEntries(FIELDS.map((f) => [f.name, p[f.name] ?? (f.type === 'checkbox' ? false : '')])),
          social: Object.fromEntries(SOCIAL.map(([k]) => [k, p.social?.[k] ?? ''])),
        });
      })
      .catch((e) => setLoadError(errorMessage(e)));
  }, []);

  if (loadError) return <p role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-900 dark:bg-red-950 dark:text-red-100">{loadError}</p>;
  if (!values) return <div className="flex items-center gap-2 py-8" role="status"><Loader2 className="animate-spin" size={18} />Loading…</div>;

  const submit = async (e) => {
    e.preventDefault();
    const found = {};
    if (!values.fullName.trim()) found.fullName = 'Full name is required.';
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) found.email = 'Enter a valid email address.';
    SOCIAL.forEach(([k]) => {
      const v = values.social[k].trim();
      if (v && !URL_RE.test(v)) found[`social.${k}`] = 'Enter a full link starting with http:// or https://';
    });
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      const trimmed = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]));
      trimmed.social = Object.fromEntries(Object.entries(values.social).map(([k, v]) => [k, v.trim()]));
      setProfile(await profileApi.update(trimmed));
      toast.success('Profile saved.');
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Profile</h2>

      <section aria-labelledby="media-title" className="space-y-5">
        <h3 id="media-title" className="font-semibold">Photo and resume</h3>
        <FileUpload label="Photo" kind="photo" accept="image/jpeg,image/png,image/webp" maxMb={3} currentLabel={profile.photoUrl ? 'Replace photo' : 'Upload photo'} onUploaded={(d) => setProfile((p) => ({ ...p, photoUrl: d.photoUrl }))}>
          {profile.photoUrl ? (
            <img src={profile.photoUrl} alt="Current profile" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-full bg-brand-dark text-xl font-semibold text-white" aria-hidden="true">{initials(profile.fullName)}</div>
          )}
        </FileUpload>
        <FileUpload label="Resume" kind="resume" accept="application/pdf" maxMb={5} currentLabel={profile.resumeUrl ? 'Replace resume (PDF)' : 'Upload resume (PDF)'} onUploaded={(d) => setProfile((p) => ({ ...p, resumeUrl: d.resumeUrl }))}>
          <div className="flex items-center gap-2 text-sm">
            <FileText size={20} aria-hidden="true" />
            {safeHref(profile.resumeUrl) ? <a className="link" href={safeHref(profile.resumeUrl)} target="_blank" rel="noopener noreferrer">Current resume (opens in a new tab)</a> : <span className="text-muted dark:text-muted-dark">No resume uploaded. The Download Resume button stays hidden until you upload one.</span>}
          </div>
        </FileUpload>
      </section>

      <form onSubmit={submit} noValidate className="space-y-4">
        <h3 className="font-semibold">Details</h3>
        {FIELDS.map((f) => (
          <FormField key={f.name} field={f} value={values[f.name]} error={errors[f.name]} onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))} />
        ))}
        <h3 className="pt-2 font-semibold">Social links</h3>
        {SOCIAL.map(([k, label]) => (
          <FormField
            key={k}
            field={{ name: `social-${k}`, label, type: 'url' }}
            value={values.social[k]}
            error={errors[`social.${k}`]}
            onChange={(v) => setValues((s) => ({ ...s, social: { ...s.social, [k]: v } }))}
          />
        ))}
        <div className="flex justify-end pt-2">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
