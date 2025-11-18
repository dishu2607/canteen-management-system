function calculateOrderTotal(cart = []) {
  if (!Array.isArray(cart) || cart.length === 0) return 0;

  let total = 0;
  for (const item of cart) {
    const price = Number(item.price) || 0;
    const qty = Number(item.qty) || 0;

    if (qty <= 0 || price < 0) continue;

    total += price * qty;
  }

  return total;
}

module.exports = { calculateOrderTotal };
