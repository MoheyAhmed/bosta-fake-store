import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchProducts } from "../api/endpoints";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import SortBar from "../components/SortBar";
import { useLocalProductsStore } from "../store/localProductsStore";

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const [sortPrice, setSortPrice] = useState("none"); // none | asc | desc
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  const localProducts = useLocalProductsStore((s) => s.localProducts);

  const productsQ = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const categoriesQ = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
  });

  // ✅ merge local (created) + api products (avoid duplicates by id)
  const mergedProducts = useMemo(() => {
    const apiList = Array.isArray(productsQ.data) ? productsQ.data : [];
    const localList = Array.isArray(localProducts) ? localProducts : [];
    const map = new Map();

    // local first so they appear on top
    for (const p of localList) map.set(String(p.id), p);
    for (const p of apiList) {
      const key = String(p.id);
      if (!map.has(key)) map.set(key, p);
    }
    return Array.from(map.values());
  }, [productsQ.data, localProducts]);

  const filteredSorted = useMemo(() => {
    let out = mergedProducts;

    if (category !== "all") out = out.filter((p) => p.category === category);

    if (sortPrice === "asc") out = [...out].sort((a, b) => a.price - b.price);
    if (sortPrice === "desc") out = [...out].sort((a, b) => b.price - a.price);

    return out;
  }, [mergedProducts, category, sortPrice]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredSorted.slice(start, start + PAGE_SIZE);
  }, [filteredSorted, safePage]);

  if (productsQ.isLoading) return <Loader label="Fetching products..." />;
  if (productsQ.isError)
    return <ErrorState message={productsQ.error?.message || "Failed to load products."} />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">Products</h1>
        <p className="mt-1 text-sm text-slate-600">
          Browse products, sort, paginate, and add to cart.
        </p>
      </div>

      <div className="mb-5 rounded-2xl border bg-white p-4">
        {categoriesQ.isError ? (
          <ErrorState title="Categories error" message="Could not load categories." />
        ) : (
          <SortBar
            sortPrice={sortPrice}
            setSortPrice={(v) => {
              setSortPrice(v);
              setPage(1);
            }}
            category={category}
            setCategory={(v) => {
              setCategory(v);
              setPage(1);
            }}
            categories={categoriesQ.data || []}
          />
        )}
      </div>

      {filteredSorted.length === 0 ? (
        <EmptyState message="No products found" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {pageItems.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>

          <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
