import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/format";
import { useCartStore } from "../store/cartStore";

const PLACEHOLDER =
  "https://via.placeholder.com/300x300.png?text=No+Image";

function ProductCard({ p }) {
  const addToCart = useCartStore((s) => s.addToCart);
  const [imgSrc, setImgSrc] = useState(p.image || PLACEHOLDER);

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border bg-white">
          <img
            src={imgSrc}
            alt={p.title}
            className="h-full w-full object-contain p-2"
            loading="lazy"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            onError={() => setImgSrc(PLACEHOLDER)}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="line-clamp-2 text-sm font-semibold text-slate-900">
            {p.title}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-slate-100 px-2 py-1">
              {p.category}
            </span>
            <span className="font-semibold text-slate-900">
              {formatPrice(p.price)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to={`/products/${p.id}`}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50"
            >
              View Details
            </Link>

            <button
              onClick={() => addToCart(p, 1)}
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
