import React, { useEffect, useMemo, useState } from "react";
import { getCampaigns } from "../api/mockApi";

export default function PastCampaigns({ creatorId }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!creatorId) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getCampaigns(creatorId);
        if (cancelled) return;
        setCampaigns(Array.isArray(data) ? data : []);
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || "Failed to load campaigns.");
        setCampaigns([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [creatorId]);

  const sorted = useMemo(() => {
    return [...campaigns].sort((a, b) =>
      String(a?.title || "").localeCompare(String(b?.title || ""))
    );
  }, [campaigns]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-genieDark2/60 bg-genieDark2/30 p-5">
        <div className="text-white/80 text-sm">Loading campaigns...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-genieDark2/60 bg-genieDark2/30 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-white font-bold">Error</div>
            <div className="text-white/75 text-sm">{error}</div>
          </div>
          <button
            className="rounded-full border border-genieLime/50 text-genieLime px-4 py-2 text-sm font-semibold hover:bg-genieLime hover:text-genieDark transition"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!sorted.length) {
    return (
      <div className="rounded-2xl border border-genieDark2/60 bg-genieDark2/30 p-5">
        <div className="text-white font-bold">Past Campaigns</div>
        <div className="text-white/75 text-sm mt-1">
          This creator has not joined any campaigns yet.
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-genieDark2/60 bg-genieDark2/30 p-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-white font-extrabold text-lg">Past Campaigns</h2>
        <span className="text-genieLime text-xs font-semibold border border-genieLime/30 px-3 py-1 rounded-full">
          {sorted.length} campaigns
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {sorted.map((c) => (
          <CampaignCard key={c?.id} campaign={c} />
        ))}
      </div>
    </section>
  );
}

function CampaignCard({ campaign }) {
  const title = campaign?.title || "Untitled";
  const brand = campaign?.brand || "Unknown brand";
  const platform = campaign?.platform || "Unknown";

  return (
    <div className="rounded-xl border border-genieDark2/60 bg-genieDark/30 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-white font-bold">{title}</div>
          <div className="text-white/75 text-sm mt-1">{brand}</div>
        </div>

        <span className="text-genieLime text-xs font-semibold border border-genieLime/30 px-3 py-1 rounded-full">
          {platform}
        </span>
      </div>

      {campaign?.id && (
        <div className="text-white/50 text-xs mt-3">ID: {campaign.id}</div>
      )}
    </div>
  );
}