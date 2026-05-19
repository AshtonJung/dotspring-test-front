
    <EchartsDlabMap />
    
  
<template>
    <section class="card col-span-12 bg-base-100 shadow-sm xl:col-span-5">
        <div class="card-body pb-0">
        <h2 class="card-title">DLab</h2>
        </div>
        <div id="main" class="min-h-60"></div>
        <!-- <div > selected seat <span v-for="(seatNo, index) in selectedSeatList" :key="index">{{ seatNo }}</span> </div> -->
        <div > 선택 좌석 : <span>{{ selectedSeatList }}</span> </div>

    </section>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const ROOT_PATH = '/assets/images/dlab_map_fill.svg';
const selectedNodes = ref(['n12']);
let myChart;
const selectedSeatList = ref([]);

// takenSeatNames

onMounted(() => {
  const chartDom = document.getElementById('main');
  myChart = echarts.init(chartDom);
  // myChart.showLoading()
  fetch(ROOT_PATH)
    .then(response => response.text())
    .then(svg => {
      echarts.registerMap('dlab-map', { svg: svg });

      const option = {
        tooltip: {},
        geo: {
          map: 'dlab-map',
          roam: true,
          selectedMode: 'multiple',
          layoutCenter: ['50%', '50%'],
          layoutSize: '95%',
          tooltip: { show: true },
          itemStyle: { color: '#fff' },
          emphasis: {
            itemStyle: { color: undefined, borderColor: 'green', borderWidth: 2 },
            label: { show: false }
          },
          select: {
            itemStyle: { color: 'green' },
            label: { show: false, textBorderColor: '#fff', textBorderWidth: 2 }
          },
          regions: makeTakenRegions(selectedNodes.value)
        }
      };

      myChart.setOption(option);

      myChart.on('geoselectchanged', params => {
        const selectedNames = params.allSelected[0].name.slice();

        for (let i = selectedNames.length - 1; i >= 0; i--) {
          if (selectedNodes.value.includes(selectedNames[i])) {
            selectedNames.splice(i, 1);
          }
        }
        selectedSeatList.value = selectedNames;
        // console.log('selected', selectedNames);
      });
    });
});

function makeTakenRegions(selectedNodes) {
  const regions = [];
  for (const name of selectedNodes) {
    regions.push({
      name,
      silent: true,
      itemStyle: { color: '#bf0e08' },
      emphasis: { itemStyle: { borderColor: '#aaa', borderWidth: 1 } },
      select: { itemStyle: { color: '#bf0e08' } }
    });
  }
  return regions;
}
</script>