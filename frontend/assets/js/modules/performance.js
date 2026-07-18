const PerformanceModule = (function() {
    
    let radarChartInstance = null;
    let lineChartInstance = null;

    function init() {
        // Since the HTML is injected, we need a slight delay to ensure the canvas elements are fully rendered before initializing Chart.js
        setTimeout(() => {
            if (typeof Chart !== 'undefined') {
                initRadarChart();
                initLineChart();
            } else {
                console.error("Chart.js is not loaded.");
            }
        }, 100);
    }

    function initRadarChart() {
        const ctx = document.getElementById('skillRadarChart');
        if (!ctx) return;

        // Destroy previous instance if it exists
        if(radarChartInstance) {
            radarChartInstance.destroy();
        }

        const data = {
            labels: [
                'Data Structures',
                'Algorithms',
                'System Design',
                'Web Dev',
                'Databases',
                'Aptitude'
            ],
            datasets: [{
                label: 'Your Skill Level',
                data: [92, 75, 52, 78, 85, 90],
                fill: true,
                backgroundColor: 'rgba(13, 110, 253, 0.2)', // Primary color with opacity
                borderColor: 'rgba(13, 110, 253, 1)',
                pointBackgroundColor: 'rgba(13, 110, 253, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(13, 110, 253, 1)'
            },
            {
                label: 'Batch Average',
                data: [65, 55, 45, 70, 60, 75],
                fill: true,
                backgroundColor: 'rgba(108, 117, 125, 0.1)',
                borderColor: 'rgba(108, 117, 125, 0.5)',
                pointBackgroundColor: 'rgba(108, 117, 125, 1)',
                pointBorderColor: '#fff',
                borderDash: [5, 5]
            }]
        };

        const config = {
            type: 'radar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        pointLabels: {
                            font: {
                                size: 12,
                                family: "'Inter', sans-serif",
                                weight: '500'
                            },
                            color: '#6c757d'
                        },
                        ticks: {
                            display: false,
                            min: 0,
                            max: 100
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                family: "'Inter', sans-serif"
                            }
                        }
                    }
                }
            }
        };

        radarChartInstance = new Chart(ctx, config);
    }

    function initLineChart() {
        const ctx = document.getElementById('progressLineChart');
        if (!ctx) return;

        if(lineChartInstance) {
            lineChartInstance.destroy();
        }

        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Average Test Score (%)',
                data: [62, 65, 68, 72, 70, 76, 85],
                borderColor: 'rgba(25, 135, 84, 1)', // Success color
                backgroundColor: 'rgba(25, 135, 84, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4, // Smooth curve
                pointBackgroundColor: '#fff',
                pointBorderColor: 'rgba(25, 135, 84, 1)',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0,0,0,0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            font: { family: "'Inter', sans-serif" }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: { family: "'Inter', sans-serif" }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        titleFont: { size: 13, family: "'Inter', sans-serif" },
                        bodyFont: { size: 14, family: "'Inter', sans-serif", weight: 'bold' },
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
            }
        };

        lineChartInstance = new Chart(ctx, config);
    }

    return {
        init
    };
})();
