export default function PageHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/25">
            <Icon size={18} />
          </span>
        )}
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{title}</h1>
      </div>
      {subtitle && <p className="mt-3 text-zinc-600 dark:text-zinc-400">{subtitle}</p>}
    </div>
  );
}
