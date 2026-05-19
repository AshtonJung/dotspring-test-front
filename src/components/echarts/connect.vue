<script setup>
import { use, connect, disconnect } from "echarts/core";
import { CanvasRenderer } from 'echarts/renderers';
import { ScatterChart } from "echarts/charts";
import {
  GridComponent,
  TitleComponent,
  VisualMapComponent,
  TooltipComponent
} from "echarts/components";
import { shallowRef, watch } from "vue";
import VChart, { THEME_KEY } from 'vue-echarts';
import VExample from "./example";
import getData from "../../server/data/connect";

use([
  CanvasRenderer,  
  ScatterChart,
  GridComponent,
  TitleComponent,
  VisualMapComponent,
  TooltipComponent
]);

const [c1, c2] = getData().map(shallowRef);
const connected = shallowRef(true);

watch(
  connected,
  value => {
    if (value) {
      connect("radiance"); // 차트에서 지정한 group 명을 지정하면 해당 group끼리 
    } else {
      disconnect("radiance");
    }
  },
  { immediate: true }
);
</script>

<template>
  <v-example id="connect" title="Connectable charts" split>
    <template #start>
      <v-chart :option="c1" group="radiance" autoresize />
    </template>
    <template #end>
      <v-chart :option="c2" group="radiance" autoresize />
    </template>
    <template #extra>
      <p class="actions">
        <label>
          <input type="checkbox" v-model="connected" />
          Connected
        </label>
      </p>
    </template>
  </v-example>
</template>