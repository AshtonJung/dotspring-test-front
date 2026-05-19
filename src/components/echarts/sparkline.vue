<script setup>
import { use, registerTheme } from "echarts/core";
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from "echarts/charts";
import { GridComponent, DatasetComponent } from "echarts/components";
import { shallowRef, onBeforeUnmount } from "vue";
import VChart from 'vue-echarts';


use([CanvasRenderer, LineChart, DatasetComponent, GridComponent]);

const props = defineProps({
    data: Object,
    color: String,
    smooth: String,
});

// const option = shallowRef(props.data);

const option = ref({
  color: [ props.color ],
  grid:{
    left: '0px',
    right: '0px',
    top: '0px',
    bottom: '0px'
  },
  xAxis: {
    show: false,
    type: 'category',
    boundaryGap: false,
    data: props.data.map(item => item.x)
  },
  yAxis: {
    show: false,
    type: 'value'
  },
  tooltip: {
    trigger: 'axis' // axis: 축 기준 , item: 아이템에 마우스 오버시 ...
  },
  series: [
    {
      data: props.data.map(item => item.y),
      type: 'line',
      areaStyle: {}, // area 적용,
      smooth: props.smooth,
    }
  ]
});


watch(() => props.data, (newVal) => {
  option.value.xAxis.data = newVal.map(item => item.x); 
  option.value.series[0].data = newVal.map(item => item.y); 
});


onMounted(() => {
    // option.value.xAxis.data = props.data.map(item => item.x);
    // option.value.series[0].data = props.data.map(item => item.y); 
})
</script>

<template>
    <v-chart
        :option="option"
        autoresize
        class="dash-chart"
    />
</template>

<style>
.dash-chart{
  width: auto;
  height: 200px;
}
</style>