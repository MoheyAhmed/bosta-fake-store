import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProductById } from "../api/endpoints";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import { formatPrice } from "../utils/format";
import { useCartStore } from "../store/cartStore";
import { useLocalProductsStore } from "../store/localProductsStore";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const addToCart = useCartStore((s) => s.addToCart);

  const queryClient = useQueryClient();
  const getLocalProductById = useLocalProductsStore(
    (s) => s.getLocalProductById,
  );

  // 1) Try local product (created by user)
  const localProduct = useMemo(
    () => getLocalProductById(id),
    [getLocalProductById, id],
  );

  // 2) Try cached products list (React Query cache) to avoid extra calls
  const cachedFromList = useMemo(() => {
    const list = queryClient.getQueryData(["products"]);
    if (!Array.isArray(list)) return null;
    return list.find((p) => String(p.id) === String(id)) || null;
  }, [queryClient, id]);

  const productFromMemory = localProduct || cachedFromList;

  // 3) Fetch from API only if not found locally or in cache
  const q = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: Boolean(id) && !productFromMemory, // مهم: لا تعمل fetch للمنتجات المحلية
    staleTime: 60 * 1000,
  });

  const product = productFromMemory || q.data;

  if (!product && q.isLoading) return <Loader label="Loading product..." />;

  // لو مش local ومفيش data وجال error
  if (!product && q.isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Link
          to="/products"
          className="inline-flex rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
        >
          Back to Products
        </Link>

        <div className="mt-4">
          <ErrorState
            title="Product not found"
            message="This product doesn't exist on the API (it may be a locally created item that was removed)."
          />
        </div>
      </div>
    );
  }

  // حماية إضافية
  if (!product) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <Link
          to="/products"
          className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
        >
          Back to Products
        </Link>

        <button
          onClick={() => addToCart(product, 1)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Add to Cart
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 rounded-2xl border bg-white p-5 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4">
          <img
            src={
              product.image ||
              "https://via.placeholder.com/600x600.png?text=No+Image"
            }
            alt={product.title}
            className="mx-auto h-80 w-full object-contain"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/600x600.png?text=No+Image";
            }}
          />
        </div>

        <div className="min-w-0">
          <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
            {product.category}
          </div>

          <h1 className="mt-3 text-xl font-bold text-slate-900">
            {product.title}
          </h1>

          <div className="mt-2 text-lg font-semibold text-slate-900">
            {formatPrice(product.price)}
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-700">
            {product.description}
          </p>

         
        </div>
      </div>
    </div>
  );
}
