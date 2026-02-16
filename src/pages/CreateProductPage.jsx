import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createProduct, fetchCategories } from "../api/endpoints";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import { useLocalProductsStore } from "../store/localProductsStore";

const initial = {
  title: "",
  description: "",
  price: "",
  category: "",
  image: "",
};

export default function CreateProductPage() {
  const addLocalProduct = useLocalProductsStore((s) => s.addLocalProduct);

  const [form, setForm] = useState(initial);
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState("");

  const categoriesQ = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
  });

  const errors = useMemo(() => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!String(form.price).trim()) e.price = "Price is required";
    const priceNum = Number(form.price);
    if (String(form.price).trim() && (Number.isNaN(priceNum) || priceNum <= 0))
      e.price = "Price must be a positive number";
    if (!form.category) e.category = "Category is required";
    if (!form.image.trim()) e.image = "Image URL is required";
    return e;
  }, [form]);

  const canSubmit = Object.keys(errors).length === 0;

  const mutation = useMutation({
    mutationFn: (payload) => createProduct(payload),
    onSuccess: (_createdFromApi, variables) => {
      setSuccess("Product created successfully!");
      setForm(initial);
      setTouched({});
      window.scrollTo({ top: 0, behavior: "smooth" });

      // ✅ Create a stable local product (API may not persist)
      const localProduct = {
        id: Date.now(), // always unique locally
        title: variables.title,
        description: variables.description,
        price: variables.price,
        category: variables.category,
        image: variables.image,
      };

      // ✅ persist locally so it always appears
      addLocalProduct(localProduct);
    },
    onError: () => setSuccess(""),
  });

  const onChange = (key) => (e) => {
    setSuccess("");
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const onBlur = (key) => () => setTouched((t) => ({ ...t, [key]: true }));

  const onSubmit = (e) => {
    e.preventDefault();
    setTouched({
      title: true,
      description: true,
      price: true,
      category: true,
      image: true,
    });
    if (!canSubmit) return;

    mutation.mutate({
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category,
      image: form.image.trim(),
    });
  };

  if (categoriesQ.isLoading) return <Loader label="Loading categories..." />;
  if (categoriesQ.isError)
    return <ErrorState title="Categories error" message="Failed to load categories." />;

  const categories = categoriesQ.data || [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-bold text-slate-900">Create Product</h1>
      <p className="mt-1 text-sm text-slate-600">
        Create a new product using Fake Store API.
      </p>

      {success ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          {success}
        </div>
      ) : null}

      {mutation.isError ? (
        <div className="mt-4">
          <ErrorState message="Failed to create product. Please try again." />
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-5 space-y-4 rounded-2xl border bg-white p-5">
        <Field
          label="Title"
          value={form.title}
          onChange={onChange("title")}
          onBlur={onBlur("title")}
          error={touched.title ? errors.title : ""}
        />

        <div>
          <label className="block text-sm font-medium text-slate-800">Description</label>
          <textarea
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
            rows={5}
            value={form.description}
            onChange={onChange("description")}
            onBlur={onBlur("description")}
            placeholder="Product description..."
          />
          {touched.description && errors.description ? (
            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
          ) : null}
        </div>

        <Field
          label="Price"
          type="number"
          value={form.price}
          onChange={onChange("price")}
          onBlur={onBlur("price")}
          error={touched.price ? errors.price : ""}
          placeholder="e.g. 29.99"
        />

        <div>
          <label className="block text-sm font-medium text-slate-800">Category</label>
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
            value={form.category}
            onChange={onChange("category")}
            onBlur={onBlur("category")}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {touched.category && errors.category ? (
            <p className="mt-1 text-xs text-red-600">{errors.category}</p>
          ) : null}
        </div>

        <Field
          label="Image URL"
          value={form.image}
          onChange={onChange("image")}
          onBlur={onBlur("image")}
          error={touched.image ? errors.image : ""}
          placeholder="https://..."
        />

        <button
          type="submit"
          disabled={!canSubmit || mutation.isPending}
          className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {mutation.isPending ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, error, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-800">{label}</label>
      <input
        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
        {...props}
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
