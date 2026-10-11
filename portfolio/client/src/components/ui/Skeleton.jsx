export const Bar = ({ className = '' }) => (
  <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`} />
);

export default function PageSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-6" role="status" aria-label="Loading portfolio">
      <div className="card overflow-hidden !p-0">
        <Bar className="h-36 !rounded-none sm:h-44" />
        <div className="space-y-3 p-6">
          <Bar className="-mt-16 h-28 w-28 !rounded-full border-4 border-white dark:border-surface-dark sm:h-36 sm:w-36" />
          <Bar className="h-6 w-2/3" />
          <Bar className="h-4 w-full" />
          <Bar className="h-4 w-1/2" />
        </div>
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="card space-y-3">
          <Bar className="h-5 w-40" />
          <Bar className="h-4 w-full" />
          <Bar className="h-4 w-5/6" />
        </div>
      ))}
    </div>
  );
}
