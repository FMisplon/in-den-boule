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
        <h1 style={{ marginTop: 0 }}>Sanity Studio komt hier</h1>
        <p>
          De schema&apos;s en config zijn voorbereid. Zodra de Sanity-packages volledig zijn
          geïnstalleerd, koppelen we deze route aan de embedded studio voor contentbeheer.
        </p>
      </div>
    </main>
  );
}
