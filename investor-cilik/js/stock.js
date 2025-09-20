// js/stock.js

const initialStocks = [
    {
        id: 'MCT',
        name: 'PT Mega Cipta Teknologi Tbk',
        ticker: 'MCT',
        price: 1500000,
        history: [],
        industry: 'Teknologi',
        change: 0,
        description: 'Penyedia perangkat lunak, AI, dan solusi digital nasional untuk sektor publik & swasta.'
    },
    {
        id: 'KJF',
        name: 'PT Kian Jaya Farma Tbk',
        ticker: 'KJF',
        price: 1200000,
        history: [],
        industry: 'Kesehatan',
        change: 0,
        description: 'Produsen obat generik dan alat kesehatan terbesar di Asia Tenggara.'
    },
    {
        id: 'TEN',
        name: 'PT Tegar Energi Nusantara Tbk',
        ticker: 'TEN',
        price: 1000000,
        history: [],
        industry: 'Energi Terbarukan',
        change: 0,
        description: 'Pembangkit listrik tenaga surya dan angin terdepan yang mendukung transisi hijau nasional.'
    },
    {
        id: 'MKI',
        name: 'PT Mandiri Kapital Investama Tbk',
        ticker: 'MKI',
        price: 2000000,
        history: [],
        industry: 'Keuangan',
        change: 0,
        description: 'Grup keuangan terintegrasi: bank, investasi, asuransi, dan layanan digital.'
    },
    {
        id: 'NMP',
        name: 'PT Nusantara Motor Prima Tbk',
        ticker: 'NMP',
        price: 1700000,
        history: [],
        industry: 'Otomotif',
        change: 0,
        description: 'Produsen kendaraan roda empat dan kendaraan listrik buatan Indonesia.'
    },
    {
        id: 'RBP',
        name: 'PT Ritel Blambangan Pradipta Tbk',
        ticker: 'RBI',
        price: 850000,
        history: [],
        industry: 'Ritel',
        change: 0,
        description: 'Jaringan ritel modern dengan ribuan gerai kebutuhan harian dan elektronik.'
    }
];

let stocks = [];

function initializeStocks() {
    stocks = JSON.parse(JSON.stringify(initialStocks));
    stocks.forEach(stock => {
        stock.history = [{ day: 0, price: stock.price }];
        stock.change = 0;
    });
}

function getStocks() {
    return stocks;
}

function getStockById(id) {
    return stocks.find(stock => stock.id === id);
}

/**
 * Updates a stock's price and records its history.
 * @param {string} id - The stock's ID.
 * @param {number} newPrice - The new current price.
 * @param {number} day - The current day to record in history.
 */
function updateStockPrice(id, newPrice, day) {
    const stock = getStockById(id);
    if (stock) {
        stock.price = Math.max(1, newPrice);
        stock.history.push({ day: day, price: stock.price });
    }
}

export { initializeStocks, getStocks, getStockById, updateStockPrice };
