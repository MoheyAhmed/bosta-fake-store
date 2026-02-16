import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { formatPrice } from "../utils/format";
import EmptyState from "../components/EmptyState";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const clear = useCartStore((s) => s.clear);

  const list = useMemo(() => {
    const map = items || {};
    return Object.values(map).filter(Boolean);
  }, [items]);

  const total = useMemo(() => {
    return list.reduce((sum, it) => {
      const price = Number(it?.product?.price || 0);
      const qty = Number(it?.quantity || 0);
      return sum + price * qty;
    }, 0);
  }, [list]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-bold text-slate-900">Cart</h1>
        <div className="flex gap-2">
          <Link
            to="/products"
            className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
          >
            Continue Shopping
          </Link>
          {list.length ? (
            <button
              onClick={clear}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState message="Your cart is empty" />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            {list.map(({ product, quantity }) => (
              <div key={product?.id} className="rounded-2xl border bg-white p-4">
                <div className="flex gap-4">
                  <div className="h-20 w-20 overflow-hidden rounded-xl border bg-white">
                    <img
                      src={product?.image}
                      alt={product?.title}
                      className="h-full w-full object-contain p-2"
                      loading="lazy"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/products/${product?.id}`}
                      className="line-clamp-2 text-sm font-semibold text-slate-900 hover:underline"
                    >
                      {product?.title}
                    </Link>
                    <div className="mt-1 text-xs text-slate-600">{product?.category}</div>
                    <div className="mt-2 text-sm font-semibold">
                      {formatPrice(product?.price)}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <label className="text-xs text-slate-600">Qty</label>
                      <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(product?.id, e.target.value)}
                        className="w-24 rounded-lg border px-2 py-1 text-sm"
                      />
                      <button
                        onClick={() => removeFromCart(product?.id)}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-sm font-semibold text-slate-900">
                    {formatPrice((Number(product?.price || 0) * Number(quantity || 0)) || 0)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-2xl border bg-white p-4">
            <div className="text-sm text-slate-600">Total</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">
              {formatPrice(total)}
            </div>
            <button className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">
              Checkout (demo)
            </button>
            <p className="mt-2 text-xs text-slate-500">
              Fake Store API demo — checkout flow is not required.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
