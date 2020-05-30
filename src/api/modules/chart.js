import until from '../until';
var api = {};
until.until(api, 'getEchartOne', 'echarts/getEchartOne', 'get');
until.until(api, 'findTurnoverEchart', 'echarts/findTurnover', 'get');
until.until(api, 'findProfitsEchart', 'echarts/findProfits', 'get');
until.until(api, 'findOutputsEchart', 'echarts/findOutputs', 'get');
until.until(api, 'findljEchart', 'echarts/findlj', 'get');
until.until(api, 'findXmInfoYearEchart', 'echarts/findXmInfoYear', 'get');
until.until(api, 'findEchartJd', 'echarts/findEchartJd', 'get');
until.until(api, 'findEchartInfoJd', 'echarts/findEchartInfoJd', 'get');




export default api;
