import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-muted dark:text-muted-dark">The page you are looking for does not exist.</p>
        <Link to="/" className="btn-primary mt-6">Back to portfolio</Link>
      </div>
    </main>
  );
}
