import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [snippets, setSnippets] = useState([]);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSnippets = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("http://localhost:5000/snippets");
        if (!res.ok) {
          const message = await res.text();
          throw new Error(message || res.statusText);
        }

        const data = await res.json();
        setSnippets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load snippets", err);
        setError("Unable to load snippets. Is the backend running?");
        setSnippets([]);
      } finally {
        setLoading(false);
      }
    };

    loadSnippets();
  }, []);

  const createSnippet = async (e) => {
    e.preventDefault();

    if (!title.trim() || !language.trim() || !code.trim()) {
      alert("Please fill all fields before saving.");
      return;
    }

    setError(null);

    try {
      const res = await fetch("http://localhost:5000/snippets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          language,
          code,
          tags: [],
        }),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || res.statusText);
      }

      setTitle("");
      setLanguage("");
      setCode("");

      const updated = await fetch("http://localhost:5000/snippets");
      const data = await updated.json();
      setSnippets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to save snippet. Is the backend running?");
    }
  };

  const deleteSnippet = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this snippet?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/snippets/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || res.statusText);
      }

      const updated = await fetch("http://localhost:5000/snippets");
      const data = await updated.json();
      setSnippets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to delete snippet. Is the backend running?");
    }
  };

  const copySnippet = (text) => {
    navigator.clipboard.writeText(text).catch(() => {
      alert("Failed to copy snippet. Please try again.");
    });
  };

  return (
    <div className="app">
      <header className="appHeader">
        <div className="headerContent">
          <h1>Code Snippet Manager</h1>
          <p className="subtitle">Save, browse, copy, and manage reusable code snippets.</p>
        </div>
      </header>

      <main className="main">
        {loading && <div className="statusBanner">Loading snippets…</div>}
        {error && <div className="statusBanner error">{error}</div>}

        <section className="panel">
          <div className="panelHeader">
            <h2 className="panelTitle">Add a snippet</h2>
          </div>

          <form className="form" onSubmit={createSnippet}>
            <div className="formRow">
              <label className="formLabel">
                <span>Title</span>
                <input
                  placeholder="Enter snippet title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>

              <label className="formLabel">
                <span>Language</span>
                <input
                  placeholder="e.g. JavaScript, Python, Bash"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                />
              </label>
            </div>

            <label className="formLabel">
              <span>Code</span>
              <textarea
                placeholder="Paste code here..."
                rows={8}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </label>

            <div className="formActions">
              <button type="submit" className="primaryButton">
                Save snippet
              </button>
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="panelHeader">
            <h2 className="panelTitle">Saved snippets</h2>
            <span className="snippetCount">{snippets.length} saved</span>
          </div>

          <div className="snippetGrid">
            {snippets.length === 0 ? (
              <div className="emptyState">
                No snippets yet. Add a new one using the form above.
              </div>
            ) : (
              snippets.map((s) => (
                <article key={s._id} className="snippetCard">
                  <div className="snippetHeader">
                    <div>
                      <h3 className="snippetTitle">{s.title}</h3>
                      <p className="snippetMeta">{s.language}</p>
                    </div>

                    <div className="snippetActions">
                      <button
                        type="button"
                        className="iconButton"
                        onClick={() => copySnippet(s.code)}
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        className="iconButton danger"
                        onClick={() => deleteSnippet(s._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <pre className="codeBlock">{s.code}</pre>

                  {s.tags?.length > 0 && (
                    <div className="tagList">
                      {s.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>Powered by React + Express + MongoDB</span>
      </footer>
    </div>
  );
}

export default App;
