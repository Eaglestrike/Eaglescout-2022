var rankingChart= {
    type: 'bar',
    options: {
        plugins: {
            title: {
                display: true,
                text: 'Points Distribution'
            },
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true
            }
        }
    }
}

const getRankingChart = () => {
    return structuredClone(rankingChart)
}

module.exports = {
    getRankingChart: getRankingChart,
}