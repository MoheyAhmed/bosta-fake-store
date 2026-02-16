import { memo } from "react";

function SortBar({
  sortPrice,
  setSortPrice,
  category,
  setCategory,
  categories,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div>
          <label className="block text-xs font-medium text-slate-600">Sort by price</label>
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={sortPrice}
            onChange={(e) => setSortPrice(e.target.value)}
          >
            <option value="none">None</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600">Category</label>
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All</option>
            {categories?.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

    </div>
  );
}

export default memo(SortBar);
