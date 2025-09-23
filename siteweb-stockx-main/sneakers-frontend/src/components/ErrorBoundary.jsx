// sneakers-frontend/src/components/ErrorBoundary.jsx
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
  }
  static getDerivedStateFromError(error) {
    return { err: error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary catch:", error, info);
  }
  render() {
    const { err } = this.state;
    if (!err) return this.props.children;
    return (
      <div
        style={{
          padding: 24,
          margin: 16,
          background: "#fee2e2",
          color: "#7f1d1d",
          border: "1px solid #fecaca",
          borderRadius: 12,
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Oups, une erreur est survenue.</h2>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {err?.stack || err?.message || String(err)}
        </pre>
      </div>
    );
  }
}
