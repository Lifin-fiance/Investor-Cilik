document.addEventListener('DOMContentLoaded', () => {
    const mainPage = document.getElementById('main-page');
    const detailPage = document.getElementById('detail-page');
    const backButton = document.getElementById('back-button');
    let detailChartInstance = null;

    const stocks = {
        mcer: {
            name: 'Mainan Ceria Tbk.', ticker: 'MCER',
            description: 'Perusahaan pembuat mainan edukatif terbesar di negeri.',
            sector: 'Konsumen Primer',
            initialPrice: 1000, ohlcHistory: [],
            keyStats: { marketCap: '5 Triliun', eps: 67, der: 0.8, per: 15, roe: '18.5%', dividend: '2.1%' },
            analystRating: { buy: 75, hold: 20, sell: 5 },
            news: ["Rilis Mainan Robot Cerdas, Saham MCER Melonjak!", "MCER Laporkan Kenaikan Laba 20% di Kuartal Ini."]
        },
        eskr: {
            name: 'Es Krim Lezat Tbk.', ticker: 'ESKR',
            description: 'Produsen es krim dengan rasa buah-buahan asli.',
            sector: 'Konsumen Primer',
            initialPrice: 500, ohlcHistory: [],
            keyStats: { marketCap: '2 Triliun', eps: 20, der: 1.2, per: 25, roe: '12.0%', dividend: '1.5%' },
            analystRating: { buy: 40, hold: 50, sell: 10 },
            news: ["Harga Bahan Baku Naik, Laba ESKR Diprediksi Turun.", "ESKR Buka Pabrik Baru untuk Penuhi Permintaan Ekspor."]
        },
        buku: {
            name: 'Buku Pintar Tbk.', ticker: 'BUKU',
            description: 'Penerbit buku cerita anak dan pelajaran sekolah.',
            sector: 'Media',
            initialPrice: 2000, ohlcHistory: [],
            keyStats: { marketCap: '8 Triliun', eps: 200, der: 0.4, per: 10, roe: '22.5%', dividend: '3.0%' },
            analystRating: { buy: 85, hold: 10, sell: 5 },
            news: ["Penjualan Buku Digital BUKU Tumbuh Pesat.", "BUKU Akuisisi Penerbit Komik untuk Perluas Pasar."]
        }
    };

    function showDetailPage(stockId) {
        mainPage.classList.add('hidden');
        detailPage.classList.remove('hidden');
        populateDetailPage(stockId);
    }

    function showMainPage() {
        detailPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        if (detailChartInstance) detailChartInstance.destroy();
    }

    function populateDetailPage(stockId) {
        const stock = stocks[stockId];
        document.getElementById('detail-company-name').textContent = `${stock.name} (${stock.ticker})`;
        document.getElementById('detail-company-desc').textContent = stock.description;
        
        document.getElementById('stat-market-cap').textContent = stock.keyStats.marketCap;
        document.getElementById('stat-eps').textContent = `Rp ${stock.keyStats.eps}`;
        document.getElementById('stat-der').textContent = stock.keyStats.der;
        document.getElementById('stat-per').textContent = stock.keyStats.per;
        document.getElementById('stat-roe').textContent = stock.keyStats.roe;
        document.getElementById('stat-dividend').textContent = stock.keyStats.dividend;

        const newsList = document.getElementById('news-list');
        newsList.innerHTML = '';
        stock.news.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            newsList.appendChild(li);
        });

        document.getElementById('rating-buy').style.width = `${stock.analystRating.buy}%`;
        document.getElementById('rating-hold').style.width = `${stock.analystRating.hold}%`;
        document.getElementById('rating-sell').style.width = `${stock.analystRating.sell}%`;

        generateTutorTip(stock);
        createDetailChart(stock);
    }

    function generateTutorTip(stock) {
        const tipElement = document.getElementById('tutor-tip');
        if (stock.keyStats.roe.replace('%', '') > 20) {
            tipElement.textContent = "ROE di atas 20% itu keren! Artinya perusahaan sangat efisien dalam menghasilkan laba.";
        } else if (stock.keyStats.der < 0.5) {
            tipElement.textContent = "Hutangnya sangat rendah! Ini menunjukkan fundamental perusahaan yang kuat dan aman.";
        } else {
            tipElement.textContent = "Lihat berita terbaru. Berita positif bisa jadi sinyal bagus untuk masa depan perusahaan.";
        }
    }

    function createDetailChart(stock) {
        const ctx = document.getElementById('detail-chart')?.getContext('2d');
        if (!ctx) return;
        if (detailChartInstance) detailChartInstance.destroy();

        detailChartInstance = new Chart(ctx, {
            type: 'candlestick',
            data: { datasets: [{ data: stock.ohlcHistory.map(d => ({ x: d.time, o: d.open, h: d.high, l: d.low, c: d.close })) }] },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    x: { type: 'time', time: { unit: 'second' }, grid: { color: '#eef2f5' }, ticks: { color: '#828a9a' } },
                    y: { grid: { color: '#eef2f5' }, ticks: { color: '#828a9a' } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
    
    function updateMainPagePrices() {
        for (const stockId in stocks) {
            const stock = stocks[stockId];
            const priceEl = document.getElementById(`price-${stockId}`);
            const changeEl = document.getElementById(`change-${stockId}`);
            
            const lastClose = stock.ohlcHistory.length > 0 ? stock.ohlcHistory[stock.ohlcHistory.length-1].close : stock.initialPrice;
            const newPrice = lastClose * (1 + (Math.random() - 0.5) * 0.05);
            
            stock.ohlcHistory.push({ time: Date.now(), open: lastClose, high: Math.max(lastClose, newPrice), low: Math.min(lastClose, newPrice), close: newPrice });
             if (stock.ohlcHistory.length > 50) stock.ohlcHistory.shift();
            
            const priceChange = newPrice - stock.initialPrice;
            const percentageChange = (priceChange / stock.initialPrice) * 100;
            
            priceEl.textContent = `Rp ${newPrice.toFixed(0)}`;
            changeEl.textContent = `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(0)} (${percentageChange.toFixed(2)}%)`;
            changeEl.classList.toggle('up', priceChange >= 0);
            changeEl.classList.toggle('down', priceChange < 0);
        }
    }

    function initializeData() {
        for (const stockId in stocks) {
            const stock = stocks[stockId];
            document.getElementById(`sector-${stockId}`).textContent = stock.sector;
            let lastPrice = stock.initialPrice;
            let currentTime = Date.now() - 50 * 2000;
            for (let i = 0; i < 50; i++) {
                const open = lastPrice;
                const high = open * (1 + Math.random() * 0.05);
                const low = open * (1 - Math.random() * 0.05);
                const close = low + Math.random() * (high - low);
                stock.ohlcHistory.push({ time: currentTime + i * 2000, open, high, low, close });
                lastPrice = close;
            }
        }
        updateMainPagePrices();
    }

    document.querySelectorAll('.stock-card').forEach(card => {
        card.addEventListener('click', () => showDetailPage(card.dataset.stockId));
    });
    backButton.addEventListener('click', showMainPage);

    initializeData();
    setInterval(updateMainPagePrices, 3000);
});
