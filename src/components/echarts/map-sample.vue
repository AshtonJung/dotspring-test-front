<template>
  <div id="main" style="width: 100%; height: 600px;"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const ROOT_PATH = '/assets/images/flight-seats.svg';
const takenSeatNames = ref(['26E', '26D', '26C', '25D', '23C', '21A', '20F']);
let myChart;

onMounted(() => {
  const chartDom = document.getElementById('main');
  myChart = echarts.init(chartDom);

  fetch(ROOT_PATH)
    .then(response => response.text())
    .then(svg => {
      echarts.registerMap('flight-seats', { svg: svg });

      const option = {
        tooltip: {},
        geo: {
          map: 'flight-seats',
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
          regions: makeTakenRegions(takenSeatNames.value)
        }
      };

      myChart.setOption(option);

      myChart.on('geoselectchanged', params => {
        const selectedNames = params.allSelected[0].name.slice();

        for (let i = selectedNames.length - 1; i >= 0; i--) {
          if (takenSeatNames.value.includes(selectedNames[i])) {
            selectedNames.splice(i, 1);
          }
        }

        console.log('selected', selectedNames);
      });
    });
});

function makeTakenRegions(takenSeatNames) {
  const regions = [];
  for (const name of takenSeatNames) {
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