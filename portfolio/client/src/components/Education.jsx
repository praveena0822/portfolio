import { GraduationCap } from 'lucide-react';
import Section from './ui/Section.jsx';
import EmptyState from './ui/EmptyState.jsx';

export default function Education({ items }) {
  return (
    <Section id="education" title="Education">
      {items.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No education added yet">Add degrees from the admin dashboard.</EmptyState>
      ) : (
        <ul className="space-y-5">
          {items.map((e) => (
            <li key={e._id} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-brand/10 text-brand dark:text-brand-light" aria-hidden="true">
                <GraduationCap size={22} />
              </span>
              <div>
                <h3 className="font-semibold">{e.degree}{e.specialization && `, ${e.specialization}`}</h3>
                {e.institution && <p className="text-sm">{e.institution}</p>}
                {e.university && <p className="text-sm">{e.university}</p>}
                {(e.duration || e.grade) && (
                  <p className="text-sm text-muted dark:text-muted-dark">
                    {e.duration}{e.duration && e.grade ? ' · ' : ''}{e.grade}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
