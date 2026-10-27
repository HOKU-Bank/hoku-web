// Soft, slowly drifting light field behind the glass panels.
export function Aurora({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        className="absolute -left-[20%] -top-[30%] h-[80vh] w-[70vw] rounded-full opacity-90 blur-[110px]"
        style={{
          background: "radial-gradient(closest-side, rgba(255,255,255,0.20), transparent)",
          animation: "drift 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -right-[15%] top-[10%] h-[70vh] w-[60vw] rounded-full opacity-80 blur-[110px]"
        style={{
          background: "radial-gradient(closest-side, rgba(200,205,215,0.16), transparent)",
          animation: "drift-rev 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[-30%] left-[25%] h-[60vh] w-[55vw] rounded-full opacity-60 blur-[130px]"
        style={{
          background: "radial-gradient(closest-side, rgba(255,255,255,0.10), transparent)",
          animation: "drift 26s ease-in-out infinite",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,transparent_40%,var(--ink)_85%)]" />
    </div>
  );
}
