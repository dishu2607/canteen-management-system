function calculateTotalCost(price, quantity) {
    if (price < 0 || quantity <= 0) return 0;
    return price * quantity;
}

module.exports = calculateTotalCost;
