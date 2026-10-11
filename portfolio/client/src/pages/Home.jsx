import { useEffect } from 'react';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio.js';
import Navbar from '../components/Navbar.jsx';
import ProfileHeader from '../components/ProfileHeader.jsx';
import About from '../components/About.jsx';
import Experience from '../components/Experience.jsx';
import Projects from '../components/Projects.jsx';
import Education from '../components/Education.jsx';
import Skills from '../components/Skills.jsx';
import Certifications from '../components/Certifications.jsx';
import Contact from '../components/Contact.jsx';
import Footer from '../components/Footer.jsx';
import PageSkeleton from '../components/ui/Skeleton.jsx';

export default function Home() {
  const { data, error, loading, slow, reload } = usePortfolio();
  const name = data?.profile?.fullName;

  useEffect(() => {
    if (name) document.title = `${name} | Portfolio`;
  }, [name]);

  if (loading && !data) {
    return (
      <>
        <Navbar />
        <PageSkeleton />
        {slow && (
          <p className="pb-8 text-center text-sm text-muted dark:text-muted-dark" role="status">
            <Loader2 size={14} className="mr-1 inline animate-spin" />The server is waking up. This can take up to 30 seconds on free hosting.
          </p>
        )}
      </>
    );
  }

  if (error || !data?.profile) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-md px-4 py-16 text-center">
          <AlertTriangle className="mx-auto mb-3 text-amber-600" size={32} aria-hidden="true" />
          <h1 className="text-xl font-semibold">Portfolio unavailable</h1>
          <p className="mt-2 text-sm text-muted dark:text-muted-dark" role="alert">{error || 'The profile has not been set up yet. Run the seed script, then reload.'}</p>
          <button className="btn-primary mt-5" onClick={reload}><RefreshCw size={16} aria-hidden="true" />Try again</button>
        </main>
      </>
    );
  }

  const { profile, experience, projects, education, skills, certifications } = data;
  return (
    <>
      <Navbar name={profile.fullName} />
      <main className="mx-auto max-w-4xl space-y-4 px-4 py-6">
        <ProfileHeader profile={profile} />
        <About about={profile.about} />
        <Experience items={experience} />
        <Projects items={projects} />
        <Education items={education} />
        <Skills items={skills} />
        <Certifications items={certifications} />
        <Contact profile={profile} />
      </main>
      <Footer name={profile.fullName} />
    </>
  );
}
