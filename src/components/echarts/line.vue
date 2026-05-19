<script setup>
import { use, registerTheme } from "echarts/core";
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from "echarts/charts";
import { GridComponent, DatasetComponent } from "echarts/components";
import { shallowRef, onBeforeUnmount } from "vue";
import VChart from 'vue-echarts';
import getData from "../../server/data/bar";

use([CanvasRenderer, LineChart, DatasetComponent, GridComponent]);

const props = defineProps({
    data: Object,
});

// const option = shallowRef(props.data);

const option = ref({
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  tooltip:{
    trigger: 'axis'
  },
  series: [
    {
      data: [],
      type: 'line'
    }
  ]
});

watch(() => props.data, (newVal) => {
  option.value.xAxis.data = newVal.map(item => item.x); 
  option.value.series[0].data = newVal.map(item => item.y); 
});

</script>

<template>
    <v-chart
        :option="option"
        autoresize
        class="chat-chart"
    />
</template>

<style>
.chat-chart {
    width: 500px;
    height: 300px;
}
</style>