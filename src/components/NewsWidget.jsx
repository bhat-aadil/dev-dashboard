import { useEffect, useState } from "react";

export default function NewsWidget() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchHN() {
      setLoading(true);
      setError(null);
      try {
        // Algolia HN search API
        const url = `https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=10`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch news");
        const json = await res.json();
        console.log(json);
        if (!ignore) setItems(json.hits || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHN();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="space-y-3">
      {loading && (
        <div className="text-sm text-gray-200">Loading Hacker News...</div>
      )}
      {error && <div className="text-sm text-red-500">Error: {error}</div>}

      {!loading && !error && (
        <ul className="space-y-2">
          {items.map((it) => (
            <li
              key={it.objectID}
              className="  text-gray-300 bg-gray-800 hover:bg-gray-900 p-2 border rounded"
            >
              <a
                href={
                  it.url ||
                  `https://news.ycombinator.com/item?id=${it.objectID}`
                }
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <div className="font-medium text-sm">{it.title}</div>
                <div className="text-xs text-slate-500">
                  by {it.author} • {it.points} points
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
