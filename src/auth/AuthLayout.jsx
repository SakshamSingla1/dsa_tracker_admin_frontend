import { FiBarChart2, FiLayers, FiShield } from "react-icons/fi";

const FEATURES = [
  { icon: FiLayers, text: "Manage sheets, topics, and problems from one place" },
  { icon: FiShield, text: "Role-based access -- grant exactly the permissions each admin needs" },
  { icon: FiBarChart2, text: "See users, submissions, and activity at a glance" },
];

/** Shared shell for the auth screens -- deliberately always-dark/glass regardless of the
 *  rest of the app's (currently light-only) theme, matching the reference design this was
 *  ported from: a desktop split-screen (branding panel + glass card), single centered card
 *  on mobile. */
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex relative overflow-hidden" style={{ background: "radial-gradient(ellipse at 30% 20%, #1e293b 0%, #020617 60%)" }}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl animate-float"
          style={{ background: "rgba(139, 92, 246, 0.28)", animationDuration: "7s" }}
        />
        <span
          className="absolute top-1/3 -right-20 h-80 w-80 rounded-full blur-3xl animate-float"
          style={{ background: "rgba(192, 38, 211, 0.22)", animationDuration: "9s", animationDelay: "1.5s" }}
        />
        <span
          className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full blur-3xl animate-float"
          style={{ background: "rgba(34, 211, 238, 0.18)", animationDuration: "8s", animationDelay: "0.5s" }}
        />
      </div>

      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative z-10 max-w-xl">
        <div className="flex items-center gap-2.5">
          <span className="h-9 w-9 rounded-lg bg-[#8b5cf6] text-white flex items-center justify-center text-[14px] font-bold">
            {"</>"}
          </span>
          <span className="text-white font-semibold text-[15px]">DSA Tracker Admin</span>
        </div>

        <div>
          <h1 className="text-white text-3xl font-semibold leading-tight mb-4">
            Run the whole problem sheet,
            <br />
            from one portal.
          </h1>
          <ul className="space-y-3 mt-6">
            {FEATURES.map((f) => (
              <li key={f.text} className="flex items-start gap-3 text-white/70 text-[14px]">
                <span className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <f.icon className="h-3.5 w-3.5 text-white/80" aria-hidden="true" />
                </span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-white/40 text-[12px]">© {new Date().getFullYear()} DSA Tracker</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div
          className="w-full max-w-md rounded-2xl border border-white/10 p-8 animate-fade-up"
          style={{ background: "rgba(12, 16, 32, 0.96)", backdropFilter: "blur(28px)", boxShadow: "0 25px 60px -15px rgba(0,0,0,0.5)" }}
        >
          <div className="flex items-center gap-2.5 mb-6 lg:hidden">
            <span className="h-8 w-8 rounded-lg bg-[#8b5cf6] text-white flex items-center justify-center text-[13px] font-bold">
              {"</>"}
            </span>
            <span className="text-white font-semibold text-[14px]">DSA Tracker Admin</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
