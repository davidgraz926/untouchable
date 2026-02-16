import Sidebar from "./Sidebar";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const router = useRouter();
  const isLoginPage = router.pathname === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-40 glass px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white capitalize">
              {router.pathname === "/" ? "Dashboard" : router.pathname.replace(/\//g, " ").replace("predictions ", "")}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-700 border border-dark-500">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-live" />
              <span className="text-xs text-gray-300">LIVE</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
              D
            </div>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
