export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0d1b36] via-[#1a1040] to-[#5a1020] py-16 px-6">
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand-red opacity-10 rounded-full" />
      <div className="relative max-w-6xl mx-auto">
        <p className="text-[#b8d4f0] text-xs font-semibold tracking-[0.3em] uppercase mb-2">
          {eyebrow}
        </p>
        <h1 className="text-white text-4xl md:text-5xl font-black tracking-tight mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[#b8d4f0] text-sm md:text-base max-w-xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
