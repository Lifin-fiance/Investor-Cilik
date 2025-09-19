// js/achievements.js
import { showNotification } from './ui.js';
import { playSound } from './audio.js';

const achievements = [
    { id: 'first_profit', title: 'Keuntungan Pertama!', description: 'Lakukan penjualan pertamamu yang menguntungkan.', unlocked: false },
    { id: 'doubled_wealth', title: 'Kekayaan Berlipat!', description: 'Gandakan investasi awalmu sebesar Rp100.000.000.', unlocked: false },
    { id: 'tech_mogul', title: 'Juragan Teknologi', description: 'Miliki saham teknologi senilai lebih dari Rp50.000.000.', unlocked: false },
    { id: 'diversified', title: 'Investor Terdiversifikasi', description: 'Miliki saham dari setidaknya 4 industri yang berbeda.', unlocked: false },
    { id: 'market_master', title: 'Master Pasar Saham', description: 'Selesaikan permainan dengan kekayaan lebih dari Rp250.000.000.', unlocked: false }
];

function getAchievements() {
    return achievements;
}

function unlockAchievement(id) {
    const achievement = achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        // The UI will be updated separately to avoid circular dependencies
        showNotification(`Achievement Unlocked: ${achievement.title}`, 'success');
        playSound('achievement-sound');
        return true; // Indicates a new achievement was unlocked
    }
    return false;
}

function checkAchievements(portfolioData) {
    const { totalWealth, stocks } = portfolioData;

    // Check for 'First Profit' - This one is tricky and is best handled right after a sale in main.js
    // For now, we'll focus on the others.

    // Check for 'Doubled Wealth'
    if (totalWealth >= 20000) {
        unlockAchievement('doubled_wealth');
    }

    // Check for 'Tech Mogul'
    const techStockValue = stocks
        .filter(s => s.industry === 'Technology')
        .reduce((total, s) => total + (s.price * s.quantity), 0);
    if (techStockValue >= 5000) {
        unlockAchievement('tech_mogul');
    }

    // Check for 'Diversified Investor'
    const uniqueIndustries = new Set(stocks.map(s => s.industry));
    if (uniqueIndustries.size >= 4) {
        unlockAchievement('diversified');
    }

    // Check for 'Market Master' - This is checked at the end of the game in main.js
}

function resetAchievements() {
    achievements.forEach(a => a.unlocked = false);
}

export { getAchievements, checkAchievements, unlockAchievement, resetAchievements };