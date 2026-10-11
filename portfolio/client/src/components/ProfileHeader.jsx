import { Download, Github, Globe, GraduationCap, Linkedin, Mail, MapPin, Phone, Link2 } from 'lucide-react';
import { initials, safeHref } from '../utils/helpers.js';

const SOCIALS = [
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { key: 'github', label: 'GitHub', icon: Github },
  { key: 'scholar', label: 'Google Scholar', icon: GraduationCap },
  { key: 'orcid', label: 'ORCID', icon: Link2 },
  { key: 'website', label: 'Website', icon: Globe },
];

export default function ProfileHeader({ profile }) {
  const resume = safeHref(profile.resumeUrl);
  const socials = SOCIALS.filter((s) => safeHref(profile.social?.[s.key]));

  return (
    <section id="top" aria-labelledby="profile-name" className="card overflow-hidden !p-0">
      <div className="h-32 bg-gradient-to-r from-brand-dark to-brand sm:h-44" aria-hidden="true" />
      <div className="px-5 pb-6 sm:px-6">
        <div className="-mt-14 sm:-mt-[4.5rem]">
          {profile.photoUrl ? (
            <img
              src={profile.photoUrl}
              alt={`Portrait of ${profile.fullName}`}
              className="h-28 w-28 rounded-full border-4 border-white bg-white object-cover dark:border-surface-dark sm:h-36 sm:w-36"
            />
          ) : (
            <div
              className="grid h-28 w-28 place-items-center rounded-full border-4 border-white bg-brand-dark text-4xl font-semibold text-white dark:border-surface-dark sm:h-36 sm:w-36 sm:text-5xl"
              role="img"
              aria-label={`${profile.fullName} (initials avatar)`}
            >
              {initials(profile.fullName)}
            </div>
          )}
        </div>

        <h1 id="profile-name" className="mt-3 text-2xl font-bold sm:text-3xl">{profile.fullName}</h1>
        {profile.headline && <p className="mt-1 text-base sm:text-lg">{profile.headline}</p>}

        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted dark:text-muted-dark">
          {profile.location && (
            <li className="flex items-center gap-1.5"><MapPin size={15} aria-hidden="true" />{profile.location}</li>
          )}
          {profile.email && (
            <li className="flex items-center gap-1.5">
              <Mail size={15} aria-hidden="true" />
              <a className="link" href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
          )}
          {profile.phone && (
            <li className="flex items-center gap-1.5">
              <Phone size={15} aria-hidden="true" />
              <a className="link" href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>
            </li>
          )}
        </ul>

        {profile.summary && <p className="mt-4 max-w-2xl text-sm leading-relaxed sm:text-base">{profile.summary}</p>}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a href="#contact" className="btn-primary"><Mail size={16} aria-hidden="true" />Contact</a>
          {resume && (
            <a href={resume} target="_blank" rel="noopener noreferrer" className="btn-outline">
              <Download size={16} aria-hidden="true" />Download Resume
            </a>
          )}
          {socials.length > 0 && (
            <ul className="flex items-center gap-1">
              {socials.map(({ key, label, icon: Icon }) => (
                <li key={key}>
                  <a
                    href={safeHref(profile.social[key])}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in a new tab)`}
                    className="btn-ghost !p-2"
                  >
                    <Icon size={20} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
