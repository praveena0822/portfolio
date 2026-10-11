import { Briefcase } from 'lucide-react';
import Section from './ui/Section.jsx';
import EmptyState from './ui/EmptyState.jsx';

export default function Experience({ items }) {
  return (
    <Section id="experience" title="Experience">
      {items.length === 0 ? (
        <EmptyState icon={Briefcase} title="No experience added yet">Add roles from the admin dashboard.</EmptyState>
      ) : (
        <ol className="relative ml-3 border-l-2 border-line dark:border-line-dark">
          {items.map((e) => (
            <li key={e._id} className="relative pb-8 pl-6 last:pb-0">
              <span
                className={`absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-white dark:border-surface-dark ${
                  e.current ? 'bg-brand' : 'bg-gray-400 dark:bg-gray-500'
                }`}
                aria-hidden="true"
              />
              <h3 className="text-base font-semibold">{e.role}</h3>
              <p>{e.organization}</p>
              <p className="text-sm text-muted dark:text-muted-dark">
                {e.duration}
                {e.current && <span className="ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand dark:text-brand-light">Current</span>}
                {e.location && <span> · {e.location}</span>}
              </p>
              {e.bullets?.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
                  {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}
