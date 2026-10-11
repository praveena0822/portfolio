import { Award, ExternalLink } from 'lucide-react';
import Section from './ui/Section.jsx';
import EmptyState from './ui/EmptyState.jsx';
import { safeHref } from '../utils/helpers.js';

const KIND_LABEL = { certification: 'Certification', achievement: 'Achievement', award: 'Award', workshop: 'Workshop' };

export default function Certifications({ items }) {
  return (
    <Section id="certifications" title="Certifications & Achievements">
      {items.length === 0 ? (
        <EmptyState icon={Award} title="Nothing added yet">Add certifications or achievements from the admin dashboard.</EmptyState>
      ) : (
        <ul className="space-y-4">
          {items.map((c) => (
            <li key={c._id} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-brand/10 text-brand dark:text-brand-light" aria-hidden="true">
                <Award size={22} />
              </span>
              <div>
                <h3 className="font-semibold">{c.title}</h3>
                <p className="text-sm text-muted dark:text-muted-dark">
                  {KIND_LABEL[c.kind]}
                  {c.issuer && ` · ${c.issuer}`}
                  {c.date && ` · ${c.date}`}
                </p>
                {c.description && <p className="mt-1 text-sm">{c.description}</p>}
                {safeHref(c.credentialUrl) && (
                  <a href={safeHref(c.credentialUrl)} target="_blank" rel="noopener noreferrer" className="link mt-1 inline-flex items-center gap-1 text-sm">
                    Show credential <ExternalLink size={13} aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
