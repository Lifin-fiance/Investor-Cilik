// js/ui.js
import { getStockById } from './stock.js';
import { getAchievements } from './achievements.js';

let activeStockId = null;
let stockChartInstance = null;
let portfolioChartInstance = null;

// --- DOM Elements ---
const cashEl = document.getElementById('portfolio-cash');
const totalWealthEl = document.getElementById('total-wealth');
const portfolioStocksEl = document.getElementById('portfolio-stocks');
const stockMarketListEl = document.getElementById('stock-market-list');
const newsFeedEl = document.getElementById('news-feed');
const currentDayEl = document.getElementById('current-day');
const achievementsListEl = document.getElementById('achievements-list');
const notificationEl = document.getElementById('notification');
const nextDayBtn = document.getElementById('next-day-btn');

// Modal Elements
const stockModal = document.getElementById('stock-modal');
const closeModalBtn = document.getElementById('close-stock-modal');
const stockModalName = document.getElementById('stock-modal-name');
const stockModalDesc = document.getElementById('stock-modal-desc');
const stockModalPrice = document.getElementById('stock-modal-price');
const stockModalOwned = document.getElementById('stock-modal-owned');
const buyBtn = document.getElementById('buy-btn');
const sellBtn = document.getElementById('sell-btn');
const transactionQuantityInput = document.getElementById('transaction-quantity');

// --- News Modal Functions ---

function toggleNewsModal(show) {
    const modal = document.getElementById('news-modal');
    if (show) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    } else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function showNewsDetail(newsItem) {
    document.getElementById('news-modal-headline').textContent = newsItem.headline || 'No Headline';

    const predictionEl = document.getElementById('news-modal-prediction');
    if (newsItem.prediction) {
        predictionEl.innerHTML = `<strong class="text-blue-700">Prediction:</strong> ${newsItem.prediction}`;
        predictionEl.classList.remove('hidden');
    } else {
        predictionEl.classList.add('hidden');
    }

    const rumorEl = document.getElementById('news-modal-rumor');
    if (newsItem.rumor) {
        rumorEl.innerHTML = `<strong class="text-gray-700">Rumor:</strong> ${newsItem.rumor}`;
        rumorEl.classList.remove('hidden');
    } else {
        rumorEl.classList.add('hidden');
    }

    toggleNewsModal(true);
}

// --- Main UI Functions ---

function initializeUI(stockSelectHandler, buyHandler, sellHandler) {
    stockMarketListEl.addEventListener('click', (e) => {
        const stockCard = e.target.closest('.stock-card');
        if (stockCard) {
            activeStockId = stockCard.dataset.id;
            stockSelectHandler(activeStockId);
        }
    });

    closeModalBtn.addEventListener('click', closeStockModal);

    buyBtn.addEventListener('click', () => {
        const quantity = parseInt(transactionQuantityInput.value, 10);
        if (quantity > 0) {
            buyHandler(activeStockId, quantity);
        }
    });

    sellBtn.addEventListener('click', () => {
        const quantity = parseInt(transactionQuantityInput.value, 10);
        if (quantity > 0) {
            sellHandler(activeStockId, quantity);
        }
    });
    
    nextDayBtn.addEventListener('mouseenter', () => {
        nextDayBtn.classList.add('animate-pulse-fast');
    });
    nextDayBtn.addEventListener('mouseleave', () => {
        nextDayBtn.classList.remove('animate-pulse-fast');
    });

    const closeNewsBtn = document.getElementById('close-news-modal');
    if (closeNewsBtn) {
        closeNewsBtn.addEventListener('click', () => toggleNewsModal(false));
    }

    const newsModalOverlay = document.getElementById('news-modal');
    if (newsModalOverlay) {
        newsModalOverlay.addEventListener('click', (event) => {
            if (event.target === newsModalOverlay) {
                toggleNewsModal(false);
            }
        });
    }
}

function updatePortfolio(portfolioData) {
    cashEl.textContent = formatCurrency(portfolioData.cash);
    totalWealthEl.textContent = formatCurrency(portfolioData.totalWealth);

    portfolioStocksEl.innerHTML = '';
    if (portfolioData.stocks.length === 0) {
        portfolioStocksEl.innerHTML = '<p class="text-gray-500 p-2">Your portfolio is empty. Buy some stocks!</p>';
    } else {
        portfolioData.stocks.forEach(stock => {
            const stockEl = document.createElement('div');
            stockEl.className = 'portfolio-stock-item';
            stockEl.innerHTML = `
                <div>
                    <p class="font-bold">${stock.name} (${stock.ticker})</p>
                    <p class="text-sm text-gray-600">${stock.quantity} shares</p>
                </div>
                <div class="font-semibold">${formatCurrency(stock.price * stock.quantity)}</div>
            `;
            portfolioStocksEl.appendChild(stockEl);
        });
    }
    
    updatePortfolioChart(portfolioData);
}

function updatePortfolioChart(portfolioData) {
    const chartCtx = document.getElementById('portfolio-pie-chart').getContext('2d');
    const labels = portfolioData.stocks.map(s => s.ticker);
    const data = portfolioData.stocks.map(s => s.price * s.quantity);
    
    labels.push('Cash');
    data.push(portfolioData.cash);
    
    if (portfolioChartInstance) {
        portfolioChartInstance.destroy();
    }
    
    portfolioChartInstance = new Chart(chartCtx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Portfolio Distribution',
                data: data,
                backgroundColor: ['#4ade80', '#fbbf24', '#60a5fa', '#f87171', '#c084fc', '#facc15', '#a3e635'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: labels.length > 1, position: 'top' },
                title: { display: true, text: 'Portfolio Diversity' }
            }
        }
    });
}

function updateStockMarket(stocks) {
    stockMarketListEl.innerHTML = '';
    stocks.forEach(stock => {
        const stockEl = document.createElement('div');
        stockEl.className = 'stock-card';
        stockEl.dataset.id = stock.id; 

        let priceChangeColor = 'text-gray-500';
        if (stock.change > 0) priceChangeColor = 'text-green-500';
        if (stock.change < 0) priceChangeColor = 'text-red-500';

        const previousPrice = stock.price - stock.change;
        const percentageChange = previousPrice !== 0 ? (stock.change / previousPrice) * 100 : 0;
        
        const changeSign = stock.change > 0 ? '+' : '';
        const changeText = `${changeSign}${formatCurrency(stock.change)} (${changeSign}${percentageChange.toFixed(2)}%)`;

        stockEl.innerHTML = `
            <div class="stock-card-header">
                <span class="stock-name">${stock.name}</span>
                <span class="stock-ticker">${stock.ticker}</span>
            </div>
            <div class="stock-price-container">
                <span class="stock-price">${formatCurrency(stock.price)}</span>
                <span class="stock-change ${priceChangeColor}">${changeText}</span>
            </div>
            <div class="text-sm text-gray-500">${stock.industry}</div>
        `;
        stockMarketListEl.appendChild(stockEl);
    });
}

/**
 * Updates the news feed to show ONLY the current day's news.
 * @param {object} newsItem - The structured news object for the current day.
 * @param {number} day - The current day number.
 */
function updateNewsFeed(newsItem, day) {
    // ===== THIS IS THE KEY CHANGE =====
    // Clear the news feed before adding the new item.
    newsFeedEl.innerHTML = '';
    // ===================================

    const article = document.createElement('div');
    article.className = 'news-article p-3 bg-gray-100 rounded-lg shadow-sm cursor-pointer hover:bg-gray-200 transition-colors duration-200';
    
    let headlineText = `Day ${day}: `;
    
    if (typeof newsItem === 'string') {
        headlineText += newsItem;
    } else {
        headlineText += newsItem.headline;
    }

    article.innerHTML = `<p class="font-semibold text-gray-800">${headlineText}</p>`;
    
    article.addEventListener('click', () => {
        if (typeof newsItem !== 'string') {
            showNewsDetail(newsItem);
        }
    });
    
    // Now just append the single article to the empty feed.
    newsFeedEl.appendChild(article);
}

function updateDay(day) {
    currentDayEl.textContent = day;
}

function updateAchievements() {
    const achievements = getAchievements();
    achievementsListEl.innerHTML = '';
    const unlockedAchievements = achievements.filter(a => a.unlocked);

    if (unlockedAchievements.length === 0) {
        achievementsListEl.innerHTML = '<li class="text-gray-500">No achievements unlocked yet!</li>';
    } else {
        unlockedAchievements.forEach(ach => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-trophy text-yellow-400"></i> <strong>${ach.title}:</strong> ${ach.description}`;
            achievementsListEl.appendChild(li);
        });
    }
}

function openStockModal(stock, portfolioStock) {
    stockModalName.textContent = `${stock.name} (${stock.ticker})`;
    stockModalDesc.textContent = stock.description;
    stockModalPrice.textContent = formatCurrency(stock.price);
    stockModalOwned.textContent = portfolioStock ? portfolioStock.quantity : 0;
    transactionQuantityInput.value = '1';

    const chartCtx = document.getElementById('stock-chart').getContext('2d');
    if (stockChartInstance) {
        stockChartInstance.destroy();
    }
    stockChartInstance = new Chart(chartCtx, {
        type: 'line',
        data: {
            labels: stock.history.map(h => `Day ${h.day}`),
            datasets: [{
                label: 'Price History',
                data: stock.history.map(h => h.price),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.2
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    stockModal.classList.remove('hidden');
}

function closeStockModal() {
    stockModal.classList.add('hidden');
    if (stockChartInstance) {
        stockChartInstance.destroy();
        stockChartInstance = null;
    }
    activeStockId = null;
}

function showNotification(message, type = 'success') {
    notificationEl.textContent = message;
    notificationEl.className = 'notification';
    notificationEl.classList.add(type);
    notificationEl.classList.remove('hidden');

    setTimeout(() => {
        notificationEl.classList.add('hidden');
    }, 3000);
}

// Ganti fungsi lama dengan yang ini
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

export {
    initializeUI,
    updatePortfolio,
    updateStockMarket,
    updateNewsFeed,
    updateDay,
    updateAchievements,
    showNotification,
    openStockModal,
    closeStockModal,
    formatCurrency
};