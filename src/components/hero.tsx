import type { Profile } from "@/types/api";

export function Hero({ profile }: { profile: Profile }) {
  const stats = profile.stats ?? [];

  return (
    <section
      id="about"
      className="relative overflow-hidden max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-12 gap-12 items-center"
    >
      <div className="glow-bg w-96 h-96 bg-accent top-0 -left-20" />
      <div className="glow-bg w-96 h-96 bg-accent-2 top-1/3 -right-20" />

      <div className="lg:col-span-7 space-y-6">
        {profile.tagline && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-xs font-semibold text-accent border border-accent/30">
            <span className="w-2 h-2 rounded-full bg-accent pulse-dot" />
            {profile.tagline}
          </div>
        )}

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          Architecting <span className="text-gradient">Enterprise .NET</span> &amp; AI Solutions
        </h1>

        {profile.summary && (
          <p className="text-lg text-muted leading-relaxed max-w-2xl">{profile.summary}</p>
        )}

        <div className="flex flex-wrap gap-4 pt-2">
          <a
            href="#projects"
            className="px-6 py-3.5 rounded-xl font-bold text-black bg-gradient-to-r from-accent to-accent-2 hover:opacity-90 shadow-lg shadow-accent/10 hover:-translate-y-0.5 transition-all"
          >
            Explore Projects <i className="fa-solid fa-arrow-right ml-2 text-xs" aria-hidden="true" />
          </a>
          <a
            href="#contact"
            className="px-6 py-3.5 rounded-xl font-semibold glass-card hover:bg-accent/5 hover:-translate-y-0.5 transition-all"
          >
            Get in Touch
          </a>
        </div>

        {stats.length > 0 && (
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-card-border max-w-lg">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-extrabold text-accent">{stat.value}</div>
                <div className="text-xs text-muted mt-1 uppercase font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-5">
        <div className="rounded-2xl bg-[#0d1117] border border-white/10 shadow-2xl overflow-hidden font-mono text-sm">
          <div className="bg-[#161b22] px-4 py-3 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            </div>
            <span className="text-xs text-slate-500">developer.json</span>
          </div>
          <div className="p-6 text-slate-300 leading-relaxed overflow-x-auto">
            <span className="text-pink-400">const</span> developer = {"{"}
            <br />
            &nbsp;&nbsp;<span className="text-blue-400">name</span>:{" "}
            <span className="text-emerald-300">&quot;{profile.name}&quot;</span>,<br />
            &nbsp;&nbsp;<span className="text-blue-400">title</span>:{" "}
            <span className="text-emerald-300">&quot;{profile.title}&quot;</span>,<br />
            &nbsp;&nbsp;<span className="text-blue-400">experience</span>:{" "}
            <span className="text-purple-400">{profile.yearsExperience ?? 0}</span>,<br />
            &nbsp;&nbsp;<span className="text-blue-400">available</span>:{" "}
            <span className="text-purple-400">
              {String(!profile.availability || /avail|open/i.test(profile.availability))}
            </span>
            <br />
            {"}"};
          </div>
        </div>
      </div>
    </section>
  );
}
