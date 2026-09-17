/**
 * =========================================================
 * GOVERNMENT: ANALYTICS & VISUALIZATION (js/government/analytics.js)
 * Chart.js Line Trends & Commodity Donut Charts
 * =========================================================
 */

let trendChartInstance = null;
let cropPieChartInstance = null;

export function renderAnalyticsCharts() {
  const trendCtx = document.getElementById('trendChart')?.getContext('2d');
  if (trendCtx && window.Chart) {
    if (trendChartInstance) trendChartInstance.destroy();
    trendChartInstance = new window.Chart(trendCtx, {
      type: 'line',
      data: {
        labels: ['26 Aug', '27 Aug', '28 Aug', '29 Aug', '30 Aug', '31 Aug', 'Today'],
        datasets: [{
          label: 'Procured Volume (Quintals)',
          data: [850, 1120, 940, 1350, 1210, 1480, 1250],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }

  const pieCtx = document.getElementById('cropPieChart')?.getContext('2d');
  if (pieCtx && window.Chart) {
    if (cropPieChartInstance) cropPieChartInstance.destroy();
    cropPieChartInstance = new window.Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['Wheat', 'Paddy', 'Mustard', 'Gram'],
        datasets: [{
          data: [62, 24, 8, 6],
          backgroundColor: ['#16a34a', '#eab308', '#f97316', '#8b5cf6']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
}
