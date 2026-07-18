const AnalyticsManager = (function() {

    function applyFilters() {
        const dept = document.getElementById('analyticsDeptFilter').value;
        const section = document.getElementById('analyticsSectionFilter').value;
        const date = document.getElementById('analyticsDateFilter').value;

        // Visual simulation of data refresh
        const cards = document.querySelectorAll('.lux-card');
        
        cards.forEach(card => {
            card.style.opacity = '0.4';
            card.style.transition = 'opacity 0.3s ease';
        });

        setTimeout(() => {
            // Update a metric to mock the result change
            const scoreEl = document.getElementById('avgInstitutionScore');
            if (scoreEl) {
                // generate a random score between 60 and 95
                const newScore = Math.floor(Math.random() * (95 - 60 + 1) + 60);
                scoreEl.innerHTML = `${newScore}<span style="font-size:1.5rem;">%</span>`;
                
                const trend = document.getElementById('avgScoreTrend');
                if (trend) {
                    if (newScore > 75) {
                        trend.innerHTML = `<i class="fa-solid fa-arrow-trend-up"></i> +2% from last filter`;
                        trend.className = 'text-success mt-2';
                    } else {
                        trend.innerHTML = `<i class="fa-solid fa-arrow-trend-down"></i> -1% from last filter`;
                        trend.className = 'text-danger mt-2';
                    }
                }
            }

            cards.forEach(card => {
                card.style.opacity = '1';
            });
            
            // alert(`Filters Applied: Dept: ${dept || 'All'}, Section: ${section || 'All'}, Date: ${date || 'All'}`);
        }, 500);
    }

    return {
        applyFilters
    };
})();
window.AnalyticsManager = AnalyticsManager;
