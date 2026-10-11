export default function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-line px-4 py-8 text-center dark:border-line-dark">
      {Icon && <Icon size={28} className="mb-2 text-muted dark:text-muted-dark" aria-hidden="true" />}
      <p className="font-medium">{title}</p>
      {children && <p className="mt-1 max-w-sm text-sm text-muted dark:text-muted-dark">{children}</p>}
    </div>
  );
}
