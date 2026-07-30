"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Status = "loading" | "ok" | "error";

// Verifica la comunicación front <-> back llamando a /api/health.
export default function ApiStatus() {
  const [status, setStatus] = useState<Status>("loading");
  const [detail, setDetail] = useState<string>("");

  useEffect(() => {
    api
      .get("/api/health")
      .then((res) => {
        setStatus("ok");
        setDetail(res.data?.time ?? "");
      })
      .catch((err) => {
        setStatus("error");
        setDetail(err?.message ?? "Error desconocido");
      });
  }, []);

  const config = {
    loading: { color: "bg-mustard", text: "Conectando con la API…" },
    ok: { color: "bg-success", text: "API conectada ✓" },
    error: { color: "bg-error", text: "Sin conexión con la API" },
  }[status];

  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white px-5 py-4 shadow-sm">
      <span className={`h-3 w-3 rounded-full ${config.color}`} />
      <div>
        <p className="font-heading font-semibold">{config.text}</p>
        {detail && <p className="text-sm text-ink/60">{detail}</p>}
      </div>
    </div>
  );
}
