// helpers/stock.js
function validateStock(requestedQty, availableStock) {
  if (requestedQty <= 0) return false;
  if (availableStock < 0) return false;
  return requestedQty <= availableStock;
}

module.exports = { validateStock };
