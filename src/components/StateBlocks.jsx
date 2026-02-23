import React from "react";

export function LoadingBlock({ text = "Loading..." }) {
  return (
    <div className="rounded-2xl border border-[#074316]/60 bg-[#005701] px-5 py-4">
      <div className="text-white/80 text-sm">{text}</div>
    </div>
  );
}

export function ErrorBlock({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="rounded-2xl border border-[#074316]/60 bg-[#005701]/30 px-5 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-white font-bold">Error</div>
          <div className="text-white/75 text-sm">{message}</div>
        </div>

        {onRetry && (
          <button
            className="rounded-full border  px-4 py-2 text-sm font-semibold  transition"
            onClick={onRetry}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

export default function EmptyBlocks({
  title = "Nothing here",
  text = "No data found.",
}) {
  return (
    <div className="rounded-2xl border border-genieDark2/60 bg-genieDark2/30 px-5 py-4">
      <div className="text-white font-bold">{title}</div>
      <div className="text-white/75 text-sm">{text}</div>
    </div>
  );
}

export function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-genieDark text-genieLime border border-genieLime/25 px-3 py-1 text-xs font-semibold">
      {children}
    </span>
  );
}