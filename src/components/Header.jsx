import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";

const navClass = ({ isActive }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium ${
    isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
  }`;

export default function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const items = useCartStore((s) => s.items);
  const count = useMemo(() => {
    const list = Object.values(items || {});
    return list.reduce((sum, it) => sum + (it?.quantity || 0), 0);
  }, [items]);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAuthed = useAuthStore((s) => s.isAuthed);

  // اقفل المنيو عند تغيير الصفحة
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // اقفل بالـ ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // امنع اسكرول الصفحة والمنيو مفتوحة (UX)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="relative">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/products" className="flex items-center gap-2">
            <div className="rounded-xl bg-slate-900 px-3 py-1.5 text-sm font-bold text-white">
              Bosta
            </div>
            <div className="text-sm font-semibold text-slate-800">Fake Store</div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/products" className={navClass}>
              Products
            </NavLink>

            <NavLink to="/create" className={navClass}>
              Create
            </NavLink>

            <NavLink to="/cart" className={navClass}>
              Cart{" "}
              <span className="ml-1 rounded-md bg-slate-200 px-2 py-0.5 text-xs">
                {count}
              </span>
            </NavLink>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {isAuthed() ? (
              <>
                <div className="hidden sm:block text-sm text-slate-700">
                  Hi, <span className="font-semibold">{user?.username}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="hidden rounded-lg border px-3 py-2 text-sm hover:bg-slate-50 md:block"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" className="hidden md:block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                Login
              </NavLink>
            )}

            {/* Mobile Button */}
            <button
              className="inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm hover:bg-slate-50 md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <span className="relative block h-4 w-5">
                <span
                  className={`absolute left-0 top-0 h-0.5 w-5 bg-slate-800 transition ${
                    open ? "translate-y-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 h-0.5 w-5 bg-slate-800 transition ${
                    open ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-3 h-0.5 w-5 bg-slate-800 transition ${
                    open ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile overlay */}
        {open ? (
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setOpen(false)}
          />
        ) : null}

        {/* Mobile dropdown menu (under header) */}
        <div
          className={`md:hidden absolute left-0 right-0 z-50 transition ${
            open ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-2"
          }`}
          style={{ top: "100%" }}
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="rounded-2xl border bg-white p-3 shadow-lg">
              <div className="space-y-2">
                <NavLink to="/products" className={navClass}>
                  Products
                </NavLink>

                <NavLink to="/create" className={navClass}>
                  Create
                </NavLink>

                <NavLink to="/cart" className={navClass}>
                  Cart{" "}
                  <span className="ml-1 rounded-md bg-slate-200 px-2 py-0.5 text-xs">
                    {count}
                  </span>
                </NavLink>

                <div className="my-2 border-t" />

                {isAuthed() ? (
                  <div className="space-y-2">
                    <div className="px-3 text-sm text-slate-700">
                      Hi, <span className="font-semibold">{user?.username}</span>
                    </div>
                    <button
                      onClick={onLogout}
                      className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <NavLink to="/login" className={navClass}>
                    Login
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
