<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from 'echarts/renderers';
import { GaugeChart } from "echarts/charts";
import VChart from 'vue-echarts';

use([CanvasRenderer, GaugeChart ]);

const option = ref({
  series: [
    {
      type: 'gauge',
      center: ['50%', '60%'],
      startAngle: 200,
      endAngle: -20,
      min: -40,
      max: 40,
      splitNumber: 10,
      itemStyle: {
        color: '#FFAB91'
      },
      progress: {
        show: true,
        width: 30
      },

      pointer: {
        show: false
      },
      axisLine: {
        lineStyle: {
          width: 30
        }
      },
      axisTick: {
        distance: -45,
        splitNumber: 5,
        lineStyle: {
          width: 2,
          color: '#999'
        }
      },
      splitLine: {
        distance: -52,
        length: 14,
        lineStyle: {
          width: 3,
          color: '#999'
        }
      },
      axisLabel: {
        distance: -12,
        color: '#999',
        fontSize: 15
      },
      anchor: {
        show: false
      },
      title: {
        show: false
      },
      detail: {
        valueAnimation: true,
        width: '60%',
        lineHeight: 40,
        borderRadius: 8,
        offsetCenter: [0, '-15%'],
        fontSize: 28,
        fontWeight: 'bolder',
        formatter: '{value} °C',
        color: 'inherit'
      },
      data: [
        {
          value: 20
        }
      ]
    },

    {
      type: 'gauge',
      center: ['50%', '60%'],
      startAngle: 200,
      endAngle: -20,
      min: -40,
      max: 40,
      itemStyle: {
        color: '#FD7347'
      },
      progress: {
        show: true,
        width: 8
      },

      pointer: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      detail: {
        show: false
      },
      data: [
        {
          value: 20
        }
      ]
    }
  ]
});


setInterval(function () {
  let random = ((Math.random() * 81) -40 ).toFixed(2);
  
  if(random >= 0) {
    option.value.series[0].itemStyle.color = '#FFAB91'
    option.value.series[1].itemStyle.color = '#FD7347'
  } else {
    option.value.series[0].itemStyle.color = '#8fa8ff'
    option.value.series[1].itemStyle.color = '#3b52ff'
  }
  option.value.series[0].data[0].value = random;
  option.value.series[1].data[0].value = random;
}, 2000);

</script>

<template>
    <v-chart
      :option="option"
      autoresize
      class="h-64 "  
    />
</template>

<style>
</style>