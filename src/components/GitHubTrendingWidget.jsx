/*Fetches trending repositories by stars created within the last 7 days using GitHub Search API.*/
import { useEffect, useState } from "react";
import { formatDistanceToNow, subDays } from "date-fns";

const STORAGE_KEY = "devdash-gh-trending-cache";

export default function GitHubTrendingWidget({ language = "" }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cached = (() => {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
      } catch {
        return null;
      }
    })();

    if (
      cached &&
      cached.timestamp &&
      Date.now() - cached.timestamp < 1000 * 60 * 10
    ) {
      setRepos(cached.repos);
      setLoading(false);
      return;
    }

    async function fetchTrending() {
      setLoading(true);
      setError(null);
      try {
        const since = subDays(new Date(), 7).toISOString().slice(0, 10); // YYYY-MM-DD
        const q = encodeURIComponent(
          `created:>${since}${language ? ` language:${language}` : ""}`
        );
        const url = `https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=10`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
        const json = await res.json();
        const list = (json.items || []).map((r) => ({
          id: r.id,
          name: r.full_name,
          desc: r.description,
          stars: r.stargazers_count,
          url: r.html_url,
          language: r.language,
          updated: r.updated_at,
        }));
        setRepos(list);
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ timestamp: Date.now(), repos: list })
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
  }, [language]);

  return (
    <div className="p-4 bg-gray-800 text-gray-400 rounded-2xl shadow ">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Trending GitHub Repos</h3>
        <div className="text-xs font-semibold text-slate-500">Last 7 days</div>
      </div>

      {loading && <div className="text-sm">Loading...</div>}
      {error && <div className="text-sm text-red-500">Error: {error}</div>}

      <ul className="space-y-3">
        {repos.map((r) => (
          <li
            key={r.id}
            className="p-2 border rounded text-white hover:bg-slate-900 dark:hover:bg-gray-700  overflow-hidden"
          >
            <a href={r.url} target="_blank" rel="noreferrer" className="block">
              <div className="flex items-center justify-between">
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-yellow-500">{r.stars} ★</div>
              </div>
              <div className="text-sm text-slate-200 mt-1">{r.desc}</div>
              <div className="text-xs text-slate-400 mt-1">
                {r.language || "—"} • updated{" "}
                {formatDistanceToNow(new Date(r.updated))} ago
              </div>
            </a>
          </li>
        ))}
        {repos.length === 0 && !loading && (
          <li className="text-sm text-slate-500">No trending repos found.</li>
        )}
      </ul>
    </div>
  );
}
