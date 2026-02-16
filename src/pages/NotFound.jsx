import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-xl font-bold">404</h1>
        <p className="mt-2 text-sm text-slate-600">Page not found.</p>
        <Link to="/products" className="mt-4 inline-block rounded-lg border px-3 py-2 text-sm hover:bg-slate-50">
          Go to Products
        </Link>
      </div>
    </div>
  );
}
