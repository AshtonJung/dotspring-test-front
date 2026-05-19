<template>
    <section class="card col-span-12 bg-base-100 shadow-sm xl:col-span-4">
        <div class="card-body pb-0">
          <h2 class="card-title">Sources</h2>
          <v-chart class="h-64" :option="option" autoresize />
        </div>
    </section>
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
import { ref, provide } from 'vue';

use([
CanvasRenderer,
PieChart,
TitleComponent,
TooltipComponent,
LegendComponent,
]);

const themeMode = ref('light');
provide(THEME_KEY, themeMode);

const option = ref({
    title: {
        text: '',
        left: 'center',
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
        orient: 'horizontal',
        textStyle : {
            // fontSize: '10'
        },
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


</script>




<style scoped>

</style>
  