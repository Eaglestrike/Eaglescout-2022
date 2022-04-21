const chart = require("chart.js")
const chartConfig = require("./config/chartConfig.js");
function renderChartsHandlebarsHelper(data, options){
    var ctx = document.getElementById("#chart1").getContext('2d');
    var rankingChart = chartConfig.getRankingChart();
    rankingChart["data"] = data;
    var rChart = new chart(ctx, rankingChart)
}

module.exports = {
	renderChartsHandlebarsHelper: renderChartsHandlebarsHelper,
}