import { useState } from "react";
import "./Home.css";

const Comments = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Please enter some text before analyzing.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data || Object.keys(data).length === 0) {
        throw new Error("No results received from API.");
      }

      setResult(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setResult(null);
    setError(null);
  };

  const getColorBySeverity = (severity) => {
    switch (severity) {
      case "Severe":
        return "#b91c1c";
      case "High":
        return "#dc2626";
      case "Medium":
        return "#f97316";
      case "Low":
        return "#2563eb";
      case "Minimal":
        return "#16a34a";
      default:
        return "#6b7280";
    }
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "20px",
        textAlign: "center",
        background: "#f9fafb",
        borderRadius: "12px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}> Media-Verse Comments Analyzer</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your comment here..."
        rows="5"
        style={{
          width: "100%",
          padding: "14px",
          fontSize: "16px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          resize: "none",
          boxSizing: "border-box",
        }}
      />
      <div style={{ marginTop: "10px", fontSize: "15px", color: "#555" }}>
        📝 Words: {text.trim() ? text.trim().split(/\s+/).length : 0} | Characters: {text.length}
      </div>

      <div style={{ marginTop: "15px" }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "10px 25px",
            marginRight: "12px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
        <button
          onClick={handleClear}
          style={{
            padding: "10px 25px",
            backgroundColor: "#e5e7eb",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            color: "#111827",
            fontSize: "15px",
          }}
        >
          Clear
        </button>
      </div>

      {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "35px", animation: "fadeIn 0.5s ease-in-out" }}>
          <h3 style={{ marginBottom: "20px", fontSize: "1.5rem" }}>Analysis Summary</h3>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: "800px",
                borderCollapse: "separate",
                borderSpacing: "0 10px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#e5e7eb" }}>
                  <th style={cellStyle}>Category</th>
                  <th style={cellStyle}>Confidence</th>
                  <th style={cellStyle}>Severity</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(result).map(([label, details]) => (
                  <tr
                    key={label}
                    style={{
                      backgroundColor: "#ffffff",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                      borderRadius: "8px",
                    }}
                  >
                    <td style={cellStyle}>{label.replace("_", " ")}</td>
                    <td style={cellStyle}>{(details.predicted * 100).toFixed(2)}%</td>
                    <td style={cellStyle}>
                      <span
                        style={{
                          backgroundColor: getColorBySeverity(details.severity),
                          color: "white",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontWeight: "bold",
                          fontSize: "14px",
                          display: "inline-block",
                          minWidth: "80px",
                        }}
                      >
                        {details.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const cellStyle = {
  padding: "16px 20px",
  textAlign: "center",
  fontSize: "15px",
};

export default Comments;


