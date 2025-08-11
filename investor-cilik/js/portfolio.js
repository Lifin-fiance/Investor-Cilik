import { showNotification } from './ui.js';
import { playSound } from './audio.js';
import { getStockById } from './stock.js';

// UBAH BARIS INI
const INITIAL_CASH = 100000000; // Dari 10000 menjadi 100 juta
const DAILY_INTEREST_RATE = 0.001; 
let cash = INITIAL_CASH;
// ... (sisa kode tetap sama)
// The map will now store { id, name, quantity, averageCost }
const portfolioStocks = new Map();

function resetPortfolio() {
    cash = INITIAL_CASH;
    portfolioStocks.clear();
}

/**
 * Calculates and adds interest to the current cash balance.
 */
function addInterest() {
    const interestEarned = cash * DAILY_INTEREST_RATE;
    cash += interestEarned;
    // Notify the player about the interest earned
    if (interestEarned > 0.01) {
       showNotification(`You earned ${formatCurrency(interestEarned)} in interest!`, 'success');
    }
}

function getPortfolioData() {
    const portfolioEntries = Array.from(portfolioStocks.values());
    let stockValue = 0;

    const stocksWithCurrentPrices = portfolioEntries.map(ownedStock => {
        const currentMarketData = getStockById(ownedStock.id);
        if (currentMarketData) {
            stockValue += currentMarketData.price * ownedStock.quantity;
            return {
                ...ownedStock,
                price: currentMarketData.price,
                ticker: currentMarketData.ticker
            };
        }
        return ownedStock;
    });

    const totalWealth = cash + stockValue;
    return { cash, stocks: stocksWithCurrentPrices, totalWealth };
}


function buyStock(stock, quantity) {
    const cost = stock.price * quantity;
    if (cash >= cost) {
        cash -= cost;
        const existingStock = portfolioStocks.get(stock.id);

        if (existingStock) {
            // Calculate the new average cost
            const totalCost = (existingStock.averageCost * existingStock.quantity) + cost;
            const totalQuantity = existingStock.quantity + quantity;
            existingStock.averageCost = totalCost / totalQuantity;
            existingStock.quantity = totalQuantity;
        } else {
            // It's a new stock, so the average cost is the current price
            portfolioStocks.set(stock.id, {
                id: stock.id,
                name: stock.name,
                quantity: quantity,
                averageCost: stock.price
            });
        }
        playSound('buy-sound');
        return true;
    } else {
        showNotification("Not enough cash to make this purchase!");
        return false;
    }
}

function sellStock(stockId, quantityToSell) {
    const ownedStock = portfolioStocks.get(stockId);

    if (ownedStock && quantityToSell > 0 && quantityToSell <= ownedStock.quantity) {
        const currentMarketData = getStockById(stockId);
        if (!currentMarketData) return false;

        const revenue = currentMarketData.price * quantityToSell;
        cash += revenue;
        ownedStock.quantity -= quantityToSell;

        if (ownedStock.quantity <= 0) {
            portfolioStocks.delete(stockId);
        }
        playSound('sell-sound');
        return true;
    }
    return false;
}

// Helper function to format currency, can be used locally
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export { getPortfolioData, buyStock, sellStock, resetPortfolio, addInterest };