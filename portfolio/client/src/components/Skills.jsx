import { Wrench } from 'lucide-react';
import Section from './ui/Section.jsx';
import EmptyState from './ui/EmptyState.jsx';
import { groupBy } from '../utils/helpers.js';

export default function Skills({ items }) {
  const groups = groupBy(items, (s) => s.category);
  return (
    <Section id="skills" title="Technical Skills">
      {groups.length === 0 ? (
        <EmptyState icon={Wrench} title="No skills added yet">Add skills from the admin dashboard.</EmptyState>
      ) : (
        <div className="space-y-5">
          {groups.map(([category, skills]) => (
            <div key={category}>
              <h3 className="mb-2 text-sm font-semibold text-muted dark:text-muted-dark">{category}</h3>
              <ul className="flex flex-wrap gap-2">
                {skills.map((s) => <li key={s._id} className="chip">{s.name}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
