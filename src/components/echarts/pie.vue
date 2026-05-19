<template>
    <v-example
        id="pie"
        title="pie chart"
        desc="( with toggle theme btn )"
    >
        <v-chart class="" :option="option" autoresize />
        <template #extra>
            <button class="btn " @click="themeChange" >toggle theme</button>
        </template>
    </v-example>
</template>

<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import {
TitleComponent,
TooltipComponent,
LegendComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import VExample from "./example";
import { ref, provide } from 'vue';

use([
CanvasRenderer,
PieChart,
TitleComponent,
TooltipComponent,
LegendComponent,
]);

const themeMode = ref('dark');
provide(THEME_KEY, themeMode);

const option = ref({
    title: {
        text: 'Traffic Sources',
        left: 'center',
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['TEST','Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines'],
    },
    series: [
        {
        name: 'Traffic Sources',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
            { value: 10, name: 'TEST'},
            { value: 335, name: 'Direct' },
            { value: 310, name: 'Email' },
            { value: 234, name: 'Ad Networks' },
            { value: 135, name: 'Video Ads' },
            { value: 1548, name: 'Search Engines' },
        ],
        emphasis: {
            itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
        },
        },
    ],
});

function themeChange() {
  if (themeMode.value == 'light') {
    themeMode.value = 'dark';
  } else {
    themeMode.value = 'light';
  }
  
}
</script>




<style scoped>
.chart {
height: 50vh;
}
</style>
  