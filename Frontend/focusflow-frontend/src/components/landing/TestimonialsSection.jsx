export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "FocusFlow is the missing piece in our engineering workflow. The Kanban board and Pomodoro timer integration is brilliant.",
      author: "Marcus Chen",
      role: "Staff Engineer at Vercel",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80",
    },
    {
      quote: "The Notion/Linear design language feels right at home. It's clean, lightning fast, and helps me maintain deep focus.",
      author: "Sarah Jenkins",
      role: "Lead Designer at Notion",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80",
    },
    {
      quote: "Goal decomposition combined with daily focus heatmaps keeps our entire product team aligned and motivated.",
      author: "David Kim",
      role: "VP of Product at Stripe",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80",
    },
  ];

  return (
    <section className="py-20 bg-slate-100/50 dark:bg-slate-900/50">
      <div className="mx-auto max-w-6xl px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-4xl">
            Loved by High-Performance Teams
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            See how creators use FocusFlow to ship faster without burnout.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900/90"
            >
              <p className="text-xs italic text-slate-600 dark:text-slate-300 leading-relaxed">
                "{item.quote}"
              </p>

              <div className="flex items-center space-x-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.author}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
