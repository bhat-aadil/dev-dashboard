import { useEffect, useState } from "react";

/*
- Fetches hot questions from Stack Exchange API.
- Default-tag=javascript
- Caches results for 15 mins in localStorage.
 */

const STORAGE_KEY = "devdash-stackoverflow-cache";

export default function StackOverflowWidget({ tag = "javascript" }) {
  const [questions, setQuestions] = useState([]);
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

    if (cached && Date.now() - cached.timestamp < 15 * 60 * 1000) {
      setQuestions(cached.questions);
      setLoading(false);
      return;
    }

    async function fetchQuestions() {
      setLoading(true);
      try {
        const url = `https://api.stackexchange.com/2.3/questions?order=desc&sort=hot&tagged=${tag}&site=stackoverflow&pagesize=10`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const json = await res.json();
        const qs = (json.items || []).map((q) => ({
          id: q.question_id,
          title: q.title,
          link: q.link,
          score: q.score,
          answers: q.answer_count,
          owner: q.owner?.display_name,
        }));
        setQuestions(qs);
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ timestamp: Date.now(), questions: qs })
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [tag]);

  return (
    <div className="p-4 bg-gray-800 text-gray-400 rounded-2xl shadow h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Stack Overflow Hot</h3>
        <span className="text-xs font-semibold text-slate-500">#{tag}</span>
      </div>

      {loading && <div className="text-sm">Loading...</div>}
      {error && <div className="text-sm text-red-500">Error: {error}</div>}

      <ul className="space-y-3 overflow-auto">
        {questions.map((q) => (
          <li
            key={q.id}
            className="p-2 border rounded text-white hover:bg-slate-900"
          >
            <a href={q.link} target="_blank" rel="noreferrer" className="block">
              <div className="font-medium text-sm">{q.title}</div>
              <div className="text-xs text-slate-500 mt-1">
                {q.score} votes • {q.answers} answers • by {q.owner || "anon"}
              </div>
            </a>
          </li>
        ))}
      </ul>

      {!loading && questions.length === 0 && (
        <div className="text-sm text-slate-500">No questions found.</div>
      )}
    </div>
  );
}
