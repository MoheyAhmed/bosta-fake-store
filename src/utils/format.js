export const formatPrice = (n) => {
  const num = Number(n);
  if (Number.isNaN(num)) return "$0.00";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num);
};
