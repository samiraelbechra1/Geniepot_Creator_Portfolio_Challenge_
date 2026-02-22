import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCreator } from "../api/mockApi";
import ProfileHeader from "../components/ProfileHeader";
import { ErrorBlock, LoadingBlock } from "../components/StateBlocks";
import logo from "/assets/log.svg";

export default function CreatorPage() {
  const { id } = useParams();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const c = await getCreator(id);
      setCreator(c);
    } catch (e) {
      setError(e?.message || "Failed to load creator data");
      setCreator(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen bg-[#005701]}">
      {/* Topbar */}
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Geniepot" className="h-9 w-auto" />
          </div>
          

          <div className="text-genieLime/90 text-sm font-semibold">
            Route: /creators/{id}
          </div>
          
        </div>
        <h2 className="text-white font-bold py-2 tracking-wide">
              Creator Portfolio
        </h2>

        {/* Page content */}
        <div className="mt-6">
          {loading ? (
            <LoadingBlock text="Loading profile..." />
          ) : error ? (
            <ErrorBlock message={error} onRetry={load} />
          ) : (
            <div className="space-y-4">
              <ProfileHeader creator={creator} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}