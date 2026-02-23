import React from "react";
import { Badge } from "./StateBlocks";

function initials(name = "") {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "C";
}

export default function ProfileHeader({ creator }) {
  const name = creator?.name || "Unknown Creator";

  return (
    <div className="rounded-2xl overflow-hidden border border-genieDark2/60 bg-[#005701]">
      {/* Card header like geniepot */}
      <div className="px-6 py-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="h-14 w-14 rounded-2xl bg-genieDark text-[#B7FF00] flex items-center justify-center font-extrabold text-lg border ">
            {initials(name)}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl font-extrabold text-white">{name}</h1>
              <span className="text-[#B7FF00] font-semibold">
                {creator?.username || ""}
              </span>
            </div>

            <div className="mt-1 text-white/70 text-sm">
              {creator?.city ? `📍 ${creator.city}` : ""}
            </div>

            {creator?.bio && (
              <p className="mt-3 text-white/85 leading-relaxed">
                {creator.bio}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {(creator?.platforms || []).map((p) => (
                <Badge key={p}>{p}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}