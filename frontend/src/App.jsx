import { useEffect, useState } from "react";

function App() {
  const [snippets, setSnippets] = useState([]);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    const loadSnippets = async () => {
      const res = await fetch("http://localhost:5000/snippets");
      const data = await res.json();
      setSnippets(data);
    };

    loadSnippets();
  }, []);

  const createSnippet = async (e) => {
  e.preventDefault();

  if (!title.trim() || !language.trim() || !code.trim()) {
    alert("Please fill all fields before saving.");
    return;
  }

  await fetch("http://localhost:5000/snippets", {
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

  setTitle("");
  setLanguage("");
  setCode("");

  const res = await fetch("http://localhost:5000/snippets");
  const data = await res.json();
  setSnippets(data);
};

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Code Snippet Manager</h1>

      <form onSubmit={createSnippet}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <br />

        <input
          placeholder="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
        <br />
        <br />

        <textarea
          placeholder="Code"
          rows="6"
          cols="50"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <br />
        <br />

        <button type="submit">Save Snippet</button>
      </form>

      <hr />

      <h2>Saved Snippets</h2>

      {snippets.map((s) => (
        <div
          key={s._id}
          style={{
            marginBottom: "20px",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          <h3>{s.title}</h3>
          <p>{s.language}</p>
          <pre>{s.code}</pre>

          <button onClick={() => navigator.clipboard.writeText(s.code)}>
            Copy
          </button>

          <button
            onClick={async () => {
  const confirmDelete = window.confirm("Are you sure you want to delete this snippet?");
  if (!confirmDelete) return;

  await fetch(`http://localhost:5000/snippets/${s._id}`, {
    method: "DELETE",
  });

  const res = await fetch("http://localhost:5000/snippets");
  const data = await res.json();
  setSnippets(data);
}}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
