import { UserRound } from 'lucide-react';
import Section from './ui/Section.jsx';
import EmptyState from './ui/EmptyState.jsx';

export default function About({ about }) {
  return (
    <Section id="about" title="About">
      {about ? (
        <div className="max-w-3xl space-y-3 leading-relaxed">
          {about.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
        </div>
      ) : (
        <EmptyState icon={UserRound} title="No introduction yet">Add one from the admin dashboard under Profile.</EmptyState>
      )}
    </Section>
  );
}
