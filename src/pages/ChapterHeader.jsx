function ChapterHeader({ title }) {
    return (
        <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-400/50 text-emerald-300 text-sm font-semibold">
                SDG
            </span>
            <div className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Story Chapter
                </span>
                <span className="text-sm font-semibold text-slate-100">
                    {title}
                </span>
            </div>
        </div>
    );
}

export default ChapterHeader;
