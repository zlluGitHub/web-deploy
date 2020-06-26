let option = {
    title: {
        text: '堆叠区域图'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            
            label: {
                backgroundColor: '#6a7985'
            }
            
            
            
            
        }
        
    },
    legend: {
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ]
}
 module.exports = option;