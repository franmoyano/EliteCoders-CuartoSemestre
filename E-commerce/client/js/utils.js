export function formatPrice(price) {
  return price.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
};