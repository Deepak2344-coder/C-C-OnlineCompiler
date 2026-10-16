export async function getServerStatus() {
  const res = await fetch("/api/status");
  return res.json();
}

/* ---------- bug reports ---------- */
export async function submitBug(report) {
  const res = await fetch("/api/bugs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function fetchBugs(key) {
  const res = await fetch(`/api/bugs?key=${encodeURIComponent(key)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data.bugs || [];
}

export async function deleteBug(id, key) {
  const res = await fetch(`/api/bugs/${encodeURIComponent(id)}?key=${encodeURIComponent(key)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Could not delete report.");
}

export async function markAllRead(key) {
  const res = await fetch(`/api/bugs/read-all?key=${encodeURIComponent(key)}`, { method: "POST" });
  if (!res.ok) throw new Error("Could not mark as read.");
}
