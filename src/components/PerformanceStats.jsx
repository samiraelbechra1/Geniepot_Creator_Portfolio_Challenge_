import React, { useEffect, useMemo, useState } from "react"
import { getSubmissions } from "../api/mockApi";


export default function PerformanceStats({  creatorId }) {
    const [submissions, setSubmissions] = useState([]);
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
            } catch (err) {
                if (cancelled) return;
                setError(err?.message || "failed to load submissions");
 
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [creatorId]);

    const stats = useMemo(() => {
        const list = Array.isArray(submissions) ? submissions : [];
        const totalSubmissions = list.length;
        const totalViews = list.reduce((acc, s) => acc + (Number (s.views) || 0), 0);
        const totalEarnings = list.reduce(
            (acc, s) => acc + (Number (s.earning_mad) || 0),
            0
        );
        const avgViews = totalSubmissions === 0 ? 0 : totalViews / totalSubmissions;

        const platformViews = list.reduce((acc, s) => {
            const p = s.platform || "Unknown";
            acc[p] = (acc[p] || 0) + (Number(s.views) || 0);
            return acc;
        }, {});
        let bestPlatfrom = "N/A";
        let bestViews = -1;
        for(const [p, v] of Object.entries(platformViews)) {
            if(v > bestViews) {
                bestViews = v;
                bestPlatfrom = p;
            }
        }

        return{
            totalSubmissions,
            totalViews,
            totalEarnings,
            avgViews,
            bestPlatform: bestPlatfrom,
        };
    }, [submissions]);

    const formatNumber = (n) => new Intl.NumberFormat().format(Number (n) || 0);
    const formatMoneyMAD = (n) => 
        `${new Intl.NumberFormat(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(n) || 0)} MAD`;
    if(loading) {
        return (
        <div className="rounded-2xl border px-5 py-4">
            <div className="rounded-2xl border px-5 py-4">
            </div>
        </div>
        );
        }
if (error) {
    return (
      <div className="rounded-2xl border px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-white font-bold">Error</div>
            <div className="text-white/75 text-sm">{error}</div>
          </div>
          <button
            className="rounded-full border  px-4 py-2 text-sm font-semibold  transition"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!submissions.length) {
    return (
      <div className="rounded-2xl border   px-5 py-4">
        <div className="text-white font-bold">No submissions</div>
        <div className="text-white/75 text-sm">
          This creator has no submissions yet.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border   p-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-white font-extrabold text-lg">Performance Stats</h2>
        <span className=" text-xs font-semibold border  px-3 py-1 rounded-full">
          Aggregated from submissions
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="Total submissions" value={formatNumber(stats.totalSubmissions)} />
        <StatCard label="Total views" value={formatNumber(stats.totalViews)} />
        <StatCard label="Total earnings" value={formatMoneyMAD(stats.totalEarnings)} />
        <StatCard label="Avg views / submission" value={formatNumber(Math.round(stats.avgViews))} />
        <StatCard label="Best platform" value={stats.bestPlatform} accent />
      </div>
    </div>
  );
}

function StatCard({ label, value, accent = false }) {
  return (
    <div className="rounded-xl border px-4 py-3">
      <div className="text-white/70 text-xs">{label}</div>
      <div className={`mt-2 text-lg font-extrabold ${accent ? "text-[#B7FF00]" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}

