const AGENTS = [
  "Contract-to-Cash",
  "Runway Autopilot",
  "Payables",
  "Receivables",
  "Treasuries Autopilot",
  "Tender Agent",
  "Dual-Use Co-pilot",
  "Loan Conditions Guard",
];

// Endless ticker of the eight Autopilot agents.
export function AgentMarquee() {
  const row = [...AGENTS, ...AGENTS];
  return (
    <div className="relative overflow-hidden border-y border-white/[0.07] py-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-12">
        {row.map((a, i) => (
          <span key={i} className="flex items-center gap-12 whitespace-nowrap text-lg font-medium tracking-tight text-white/45">
            {a}
            <span className="h-1.5 w-1.5 rotate-45 bg-gradient-to-br from-sky to-magenta" />
          </span>
        ))}
      </div>
    </div>
  );
}
