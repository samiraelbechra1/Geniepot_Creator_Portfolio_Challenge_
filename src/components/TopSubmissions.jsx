import React, { useEffect, useMemo, useState } from "react";
import { getSubmissions } from "../api/mockApi";

export default function TopSubmissions({ creatorId, limit = 10 }) {
  const [submissions, setSubmissions] = useState([]);
  const [sortBy, setSortBy] = useState("views"); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!creatorId) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getSubmissions(creatorId);
        if (cancelled) return;
        setSubmissions(Array.isArray(data) ? data : []);
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || "Failed to load submissions.");
        setSubmissions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [creatorId]);

  const top = useMemo(() => {
    const list = Array.isArray(submissions) ? [...submissions] : [];

    list.sort((a, b) => {
      const av = Number(a?.views) || 0;
      const bv = Number(b?.views) || 0;
      const ae = Number(a?.earning_mad) || 0;
      const be = Number(b?.earning_mad) || 0;
      return sortBy === "earnings" ? be - ae : bv - av;
    });

    return list.slice(0, limit);
  }, [submissions, sortBy, limit]);

  const formatNumber = (n) => new Intl.NumberFormat().format(Number(n) || 0);
  const formatMoneyMAD = (n) =>
    `${new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(n) || 0)} MAD`;

  if (loading) {
    return (
      <section className="rounded-2xl border border-genieDark2/60 bg-genieDark2/30 p-5">
        <div className="text-white/80 text-sm">Loading top submissions...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-genieDark2/60 bg-genieDark2/30 p-5">
        <div className="text-white font-bold">Error</div>
        <div className="text-white/75 text-sm mt-1">{error}</div>
      </section>
    );
  }

  if (!top.length) {
    return (
      <section className="rounded-2xl border border-genieDark2/60 bg-genieDark2/30 p-5">
        <div className="text-white font-bold">Top Submissions</div>
        <div className="text-white/75 text-sm mt-1">No submissions yet.</div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-genieDark2/60 bg-genieDark2/30 p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-white font-extrabold text-lg">Top Submissions</h2>

        <div className="flex items-center gap-2">
          <span className="text-white/70 text-xs">Sort</span>

          <button
            className={`rounded-full px-3 py-1 text-xs font-semibold border transition ${
              sortBy === "views"
                ? "border"
                : "border"
            }`}
            onClick={() => setSortBy("views")}
          >
            Views
          </button>

          <button
            className={`rounded-full px-3 py-1 text-xs font-semibold border transition ${
              sortBy === "earnings"
                ? " border"
                : "border"
            }`}
            onClick={() => setSortBy("earnings")}
          >
            Earnings
          </button>
        </div>
      </div>

      {/* GRID: lg = 5 */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {top.map((s) => (
          <SubmissionVideoCard
            key={s?.id}
            sub={s}
            formatNumber={formatNumber}
            formatMoneyMAD={formatMoneyMAD}
          />
        ))}
      </div>
    </section>
  );
}

function SubmissionVideoCard({ sub, formatNumber, formatMoneyMAD }) {
  const title = sub?.campaign_title || "Submission";
  const brand = sub?.brand_name || "Unknown brand";
  const platform = sub?.platform || "Unknown";
  const status = sub?.status || "unknown";
  const videoUrl = sub?.video_url || "";

  const statusClasses =
    status === "validated"
      ? "text-genieLime border-genieLime/40 bg-genieLime/10"
      : "text-yellow-300 border-yellow-400/40 bg-yellow-400/10";

  return (
    <article className="rounded-2xl overflow-hidden border  transition">
      {/* VIDEO */}
      <div className="relative w-full aspect-video bg-black">
        {videoUrl ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={videoUrl}
            title={sub?.id || "video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/70 text-xs">
            No video
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="p-3 space-y-3">
        {/* TITLE + BRAND */}
        <div>
          <h3 className="text-white text-sm font-extrabold leading-tight break-words">
            {title}
          </h3>
          <p className="text-white/80 text-xs mt-1 break-words">{brand}</p>
        </div>

        {/* PLATFORM + STATUS */}
        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] font-bold border  px-2 py-1 rounded-full">
            {platform}
          </span>
          <span
            className={`text-[10px] font-bold border px-2 py-1 rounded-full ${statusClasses}`}
          >
            {status}
          </span>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <MiniStat label="Views" value={formatNumber(sub?.views)} />
          <MiniStat label="Likes" value={formatNumber(sub?.likes)} />
          <MiniStat label="Comments" value={formatNumber(sub?.comments)} />
          <MiniStat label="Shares" value={formatNumber(sub?.shares)} />
          <MiniStat
            label="Earnings"
            value={formatMoneyMAD(sub?.earning_mad)}
            accent
          />
          <MiniStat label="ID" value={sub?.id || "-"} />
        </div>
      </div>
    </article>
  );
}

function MiniStat({ label, value, accent = false }) {
  return (
    <div className="rounded-lg border px-2 py-2">
      <div className="text-white/60 text-[9px] uppercase tracking-wide">
        {label}
      </div>
      <div
        className={`mt-1 text-xs font-semibold wrap-break-words ${
          accent ? "text-genieLime" : "text-white"
        }`}
      >
        {value}
      </div>
    </div>
  );
}