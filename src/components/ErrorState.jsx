export default function ErrorState({ title = "Something went wrong", message }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
      <div className="font-semibold">{title}</div>
      {message ? <div className="mt-1 text-sm">{String(message)}</div> : null}
    </div>
  );
}
