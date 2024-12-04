// Base metrics for 1H (updated with new values)
const baseMetrics = {
    '1h': {
        volume: 15281,
        buyVolume: 8841.96,
        sellVolume: 6439,
        newTokens: 2355,
        activeWallets: 8492,
        kothTokens: 89,
        raydiumReached: 22,
        avgPeakMarketCap: 13590,
        percentileROI: 286
    }
};

// Store historical data for percentage calculations
let historicalData = {
    '1h': {},
    '24h': {},
    '7d': {},
    '30d': {}
};

// Generate data for previous period (for % change calculations)
function generatePreviousPeriodData(currentData) {
    const variance = () => 0.85 + (Math.random() * 0.3); // Allow for both positive and negative changes
    const result = {};
    
    for (let key in currentData) {
        result[key] = currentData[key] * variance();
    }
    return result;
}

// Calculate percentage change
function calculatePercentageChange(current, previous) {
    return ((current - previous) / previous) * 100;
}

// Calculate other time periods with appropriate scaling
function calculateTimeMetrics() {
    const variance = () => 0.9 + (Math.random() * 0.2); // ±10% variance
    const smallVariance = () => 0.98 + (Math.random() * 0.04); // ±2% variance
    const walletScaling = {
        '24h': 1.45, // 45% more wallets over 24h
        '7d': 2.2,   // 120% more wallets over 7d
        '30d': 2.8   // 180% more wallets over 30d
    };

    return {
        '1h': baseMetrics['1h'],
        '24h': {
            volume: baseMetrics['1h'].volume * 24 * variance(),
            buyVolume: baseMetrics['1h'].buyVolume * 24 * variance(),
            sellVolume: baseMetrics['1h'].sellVolume * 24 * variance(),
            newTokens: baseMetrics['1h'].newTokens * 24 * variance(),
            activeWallets: Math.round(baseMetrics['1h'].activeWallets * walletScaling['24h'] * smallVariance()),
            kothTokens: baseMetrics['1h'].kothTokens * 24 * variance(),
            raydiumReached: baseMetrics['1h'].raydiumReached * 24 * variance(),
            avgPeakMarketCap: baseMetrics['1h'].avgPeakMarketCap * smallVariance(),
            percentileROI: baseMetrics['1h'].percentileROI * 1.4 * variance()
        },
        '7d': {
            volume: baseMetrics['1h'].volume * 24 * 7 * variance(),
            buyVolume: baseMetrics['1h'].buyVolume * 24 * 7 * variance(),
            sellVolume: baseMetrics['1h'].sellVolume * 24 * 7 * variance(),
            newTokens: baseMetrics['1h'].newTokens * 24 * 7 * variance(),
            activeWallets: Math.round(baseMetrics['1h'].activeWallets * walletScaling['7d'] * smallVariance()),
            kothTokens: baseMetrics['1h'].kothTokens * 24 * 7 * variance(),
            raydiumReached: baseMetrics['1h'].raydiumReached * 24 * 7 * variance(),
            avgPeakMarketCap: baseMetrics['1h'].avgPeakMarketCap * smallVariance(),
            percentileROI: baseMetrics['1h'].percentileROI * 2.1 * variance()
        },
        '30d': {
            volume: baseMetrics['1h'].volume * 24 * 30 * variance(),
            buyVolume: baseMetrics['1h'].buyVolume * 24 * 30 * variance(),
            sellVolume: baseMetrics['1h'].sellVolume * 24 * 30 * variance(),
            newTokens: baseMetrics['1h'].newTokens * 24 * 30 * variance(),
            activeWallets: Math.round(baseMetrics['1h'].activeWallets * walletScaling['30d'] * smallVariance()),
            kothTokens: baseMetrics['1h'].kothTokens * 24 * 30 * variance(),
            raydiumReached: baseMetrics['1h'].raydiumReached * 24 * 30 * variance(),
            avgPeakMarketCap: baseMetrics['1h'].avgPeakMarketCap * smallVariance(),
            percentileROI: baseMetrics['1h'].percentileROI * 3.2 * variance()
        }
    };
}

// Format numbers for display
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(2);
}

// Update a single metric card
function updateMetricCard(card, value, previousValue, suffix = '') {
    const valueElement = card.querySelector('.metric-value');
    const changeElement = card.querySelector('.change');
    const percentChange = calculatePercentageChange(value, previousValue);
    
    // Update value
    valueElement.textContent = typeof value === 'number' ? 
        `${suffix}${formatNumber(value)}` : value;
    
    // Update percentage change
    changeElement.textContent = `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%`;
    changeElement.className = `change ${percentChange >= 0 ? 'positive' : 'negative'}`;
    
    // Update chart color based on trend
    const chart = card.querySelector('.mini-chart');
    if (chart) {
        updateChartColor(chart, percentChange >= 0);
    }
}

// Update dashboard with selected time period
function updateDashboard(timeFrame) {
    const metrics = calculateTimeMetrics()[timeFrame];
    const previousMetrics = generatePreviousPeriodData(metrics);
    
    // Store current data for historical reference
    historicalData[timeFrame] = metrics;
    
    document.querySelectorAll('.metric-card').forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        let value = 0;
        let previousValue = 0;
        let prefix = '';
        
        if (title.includes('volume')) {
            if (title.includes('buy')) {
                value = metrics.buyVolume;
                previousValue = previousMetrics.buyVolume;
                prefix = '';
            } else if (title.includes('sell')) {
                value = metrics.sellVolume;
                previousValue = previousMetrics.sellVolume;
                prefix = '';
            } else {
                value = metrics.volume;
                previousValue = previousMetrics.volume;
                prefix = '';
            }
            updateMetricCard(card, value, previousValue, prefix + '');
        } else if (title.includes('market cap')) {
            value = metrics.avgPeakMarketCap;
            previousValue = previousMetrics.avgPeakMarketCap;
            updateMetricCard(card, value, previousValue, '$');
        } else if (title.includes('tokens') || title.includes('raydium')) {
            if (title.includes('koth')) {
                value = Math.round(metrics.kothTokens);
                previousValue = Math.round(previousMetrics.kothTokens);
            } else if (title.includes('raydium')) {
                value = Math.round(metrics.raydiumReached);
                previousValue = Math.round(previousMetrics.raydiumReached);
            } else {
                value = Math.round(metrics.newTokens);
                previousValue = Math.round(previousMetrics.newTokens);
            }
            updateMetricCard(card, value, previousValue);
        } else if (title.includes('wallets')) {
            value = Math.round(metrics.activeWallets);
            previousValue = Math.round(previousMetrics.activeWallets);
            updateMetricCard(card, value, previousValue);
        } else if (title.includes('roi')) {
            value = metrics.percentileROI;
            previousValue = previousMetrics.percentileROI;
            updateMetricCard(card, value, previousValue, '');
        }
    });
}

// Update chart color based on trend
function updateChartColor(canvas, isPositive) {
    const chart = Chart.getChart(canvas);
    if (chart) {
        const color = isPositive ? '#00ff88' : '#ff4466';
        chart.data.datasets[0].borderColor = color;
        chart.data.datasets[0].backgroundColor = `${color}20`;
        chart.update();
    }
}

// Generate chart data based on trend
function generateChartData(isPositive) {
    const points = 24;
    const trend = isPositive ? 1 : -1;
    const baseValue = 50;
    const variance = 5;
    
    return Array(points).fill(0).map((_, i) => {
        const progress = i / (points - 1);
        const trendValue = trend * progress * 20;
        const noise = (Math.random() - 0.5) * variance;
        return baseValue + trendValue + noise;
    });
}

// Initialize charts with dynamic colors
function initializeCharts() {
    document.querySelectorAll('.mini-chart').forEach(canvas => {
        const card = canvas.closest('.metric-card');
        const isPositive = Math.random() > 0.3; // 70% chance of positive trend
        const color = isPositive ? '#00ff88' : '#ff4466';
        
        new Chart(canvas, {
            type: 'line',
            data: {
                labels: Array(24).fill(''),
                datasets: [{
                    data: generateChartData(isPositive),
                    borderColor: color,
                    borderWidth: 1.5,
                    tension: 0.4,
                    pointRadius: 0,
                    fill: true,
                    backgroundColor: `${color}20`
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    });
}

// Event listeners for time period buttons
document.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.time-btn.active').classList.remove('active');
        btn.classList.add('active');
        updateDashboard(btn.dataset.time);
    });
});

// Initialize everything
initializeCharts();
updateDashboard('24h');
