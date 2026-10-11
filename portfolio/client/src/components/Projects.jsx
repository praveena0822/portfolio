import { BookOpen, ExternalLink, FileText, FolderGit2, Github } from 'lucide-react';
import Section from './ui/Section.jsx';
import EmptyState from './ui/EmptyState.jsx';
import { safeHref } from '../utils/helpers.js';

function LinkButton({ href, icon: Icon, children }) {
  const safe = safeHref(href);
  if (!safe) return null;
  return (
    <a href={safe} target="_blank" rel="noopener noreferrer" className="btn-outline !px-3 !py-1.5 !text-xs">
      <Icon size={14} aria-hidden="true" />
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function ProjectCard({ p }) {
  const isPub = p.type === 'publication';
  const Icon = isPub ? FileText : FolderGit2;
  const hasLinks = safeHref(p.link) || safeHref(p.repoUrl) || safeHref(p.liveUrl);
  return (
    <article className="flex flex-col rounded-lg border border-line p-4 dark:border-line-dark">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-brand/10 text-brand dark:text-brand-light" aria-hidden="true">
          <Icon size={18} />
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold leading-snug">{p.title}</h3>
          {(p.venue || p.year) && (
            <p className="mt-1 text-sm text-muted dark:text-muted-dark">
              {p.venue}{p.venue && p.year ? ' · ' : ''}{p.year}
            </p>
          )}
        </div>
      </div>
      {p.authors && <p className="mt-2 text-sm"><span className="font-medium">Authors:</span> {p.authors}</p>}
      {p.summary && <p className="mt-2 text-sm leading-relaxed">{p.summary}</p>}
      {p.contribution && <p className="mt-2 text-sm leading-relaxed"><span className="font-medium">My contribution:</span> {p.contribution}</p>}
      {p.technologies?.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Topics and technologies">
          {p.technologies.map((t) => <li key={t} className="chip !px-2.5 !py-0.5 !text-xs">{t}</li>)}
        </ul>
      )}
      {hasLinks && (
        <div className="mt-4 flex flex-wrap gap-2">
          <LinkButton href={p.link} icon={BookOpen}>{isPub ? 'View paper' : 'Details'}</LinkButton>
          <LinkButton href={p.repoUrl} icon={Github}>GitHub</LinkButton>
          <LinkButton href={p.liveUrl} icon={ExternalLink}>Live demo</LinkButton>
        </div>
      )}
    </article>
  );
}

export default function Projects({ items }) {
  const pubs = items.filter((p) => p.type === 'publication');
  const projects = items.filter((p) => p.type !== 'publication');
  const title = pubs.length && !projects.length ? 'Research & Publications' : pubs.length ? 'Projects & Publications' : 'Projects';

  return (
    <Section id="projects" title={title}>
      {items.length === 0 ? (
        <EmptyState icon={FolderGit2} title="Nothing added yet">Add projects or publications from the admin dashboard.</EmptyState>
      ) : (
        <div className="space-y-6">
          {projects.length > 0 && (
            <div>
              {pubs.length > 0 && <h3 className="mb-3 text-sm font-semibold text-muted dark:text-muted-dark">Projects</h3>}
              <div className="grid gap-4 md:grid-cols-2">{projects.map((p) => <ProjectCard key={p._id} p={p} />)}</div>
            </div>
          )}
          {pubs.length > 0 && (
            <div>
              {projects.length > 0 && <h3 className="mb-3 text-sm font-semibold text-muted dark:text-muted-dark">Publications</h3>}
              <div className="grid gap-4 md:grid-cols-2">{pubs.map((p) => <ProjectCard key={p._id} p={p} />)}</div>
            </div>
          )}
        </div>
      )}
    </Section>
  );
}
