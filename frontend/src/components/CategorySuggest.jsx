import { useEffect, useState } from "react";
import api from "../api/axios";

// Customer describes the problem; the ML model suggests a service category.
// onSelect(categoryName) lets the parent page filter/select that category.
export default function CategorySuggest({ onSelect }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (text.trim().length < 3) {
      setResult(null);
      setError("");
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.post("/ml/suggest-category/", { text });
        setResult(data);
        setError("");
      } catch {
        setResult(null);
        setError("Could not get a suggestion right now.");
      }
    }, 400); // debounce
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div className="w-full">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe your problem, e.g. my tap is leaking"
        className="w-full border border-steel px-3 py-2 bg-paper"
      />

      {error && <p className="mt-2 text-sm text-red-800">{error}</p>}

      {result && (
        <div className="mt-3 text-sm flex items-center gap-2 flex-wrap">
          {result.confident ? (
            <>
              <span className="text-steel">Suggested category:</span>
              <button
                type="button"
                className="bg-signal text-paper font-display tracking-wide px-3 py-1"
                onClick={() => onSelect?.(result.suggestions[0].category)}
              >
                {result.suggestions[0].category}
              </button>
              <span className="text-steel">
                {Math.round(result.suggestions[0].confidence * 100)}% match
              </span>
            </>
          ) : (
            <span className="text-steel">
              Not sure. Try describing it differently, or pick a category below.
            </span>
          )}
        </div>
      )}
    </div>
  );
}