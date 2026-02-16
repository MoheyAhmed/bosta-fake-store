import { memo } from "react";

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-6">
      <button
        className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
        disabled={!canPrev}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>

      <div className="text-sm text-slate-600">
        Page <span className="font-semibold">{page}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </div>

      <button
        className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
        disabled={!canNext}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}

export default memo(Pagination);
