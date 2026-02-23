import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCreator } from "../api/mockApi";
import ProfileHeader from "../components/ProfileHeader";
import { ErrorBlock, LoadingBlock } from "../components/StateBlocks";
import logo from "/assets/log.svg";
import PerformanceStats from "../components/PerformanceStats";
import PastCampaigns from "../components/PastCampaigns";
import TopSubmissions from "../components/TopSubmissions";


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
  <PerformanceStats creatorId={id} />


  return (
    <div className="min-h-screen bg-[#005701]}">
      {/* Topbar */}
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <div className="flex items-center ">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Geniepot" className="h-9 w-auto" />
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
              <PerformanceStats creatorId={id} />
              <PastCampaigns creatorId={id} />
              <TopSubmissions creatorId={id} limit={5} />

              
            </div>

          )}
        </div>
      </div>
    </div>
  );
}