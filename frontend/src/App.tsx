import { useState } from "react";


const API = import.meta.env.VITE_API_ENDPOINT;

export default function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortUrl("");

    try {
      const res = await fetch(`${API}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setShortUrl(`${API}/${data.code}`);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 font-sans p-8">
      <div className="bg-slate-800 rounded-2xl p-10 w-full max-w-lg shadow-[0_25px_50px_rgba(0,0,0,0.4)]">
        <h1 className="text-sky-400 text-2xl font-bold mb-2">URL Shortener</h1>
        <p className="text-slate-400 text-sm mb-8">
          Paste a long URL and get a short one back.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="url"
            placeholder="https://example.com/very/long/url"
            value={url}
            onChange={(e: React.ChangeEvent<HTMLInputElement> ) => setUrl(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm mb-4 outline-none box-border focus:border-sky-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-sky-400 text-slate-900 font-bold text-base border-none rounded-lg cursor-pointer hover:bg-sky-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Shortening..." : "Shorten"}
          </button>
        </form>

        {error && (
          <p className="text-red-400 mt-4">{error}</p>
        )}

        {shortUrl && (
          <div className="mt-6 p-4 bg-slate-950 rounded-lg border border-blue-900">
            <p className="text-slate-400 text-xs mb-2">Your short URL:</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 break-all hover:text-sky-300 transition-colors"
            >
              {shortUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

//! placeholder frontend, will be modified later