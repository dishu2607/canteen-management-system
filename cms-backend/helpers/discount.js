function applyDiscount(total, discountPercent) {
  total = Number(total);
  discountPercent = Number(discountPercent);

  if (isNaN(total) || total < 0) return 0;
  if (isNaN(discountPercent) || discountPercent < 0 || discountPercent > 100)
    return total;

  const discountAmount = (total * discountPercent) / 100;
  return total - discountAmount;
}

module.exports = { applyDiscount };
