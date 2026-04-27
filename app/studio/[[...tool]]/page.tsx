export default function StudioPlaceholderPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        color: "#fff7e7"
      }}
    >
      <div
        style={{
          maxWidth: 720,
          padding: "2rem",
          borderRadius: 24,
          background: "rgba(25, 19, 15, 0.72)",
          border: "1px solid rgba(248, 232, 196, 0.2)"
        }}
      >
        <h1 style={{ marginTop: 0 }}>Sanity Studio draait apart via Sanity</h1>
        <p>
          Voor In den Boule hosten we de Studio niet in deze website, maar als aparte Sanity
          Studio zoals bij Music Hall. De schema&apos;s en deploy-config staan wel in deze codebase,
          zodat je ze van hieruit kunt publiceren.
        </p>
        <p style={{ marginBottom: 0 }}>
          Gebruik lokaal <code>npm run sanity:deploy</code> om de Studio te publiceren naar een
          Sanity-hosted URL.
        </p>
      </div>
    </main>
  );
}
