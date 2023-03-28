<!-- eslint-disable max-len -->
<template>
  <div class="admin__pages-likes panel">
    <div class="panel-publications__top">
      <img src="../../../public/static/img/admin/admin_4.png" alt="Комментарии">
      <div class="panel-publications__info">
        <span>Лайков поставлено:</span>
        <span>234 110</span>
      </div>
    </div>
    <div class="panel__graphics first__graph">
      <div class="panel__graphics-left">
        <span class="panel-dynamics__title">Динамика прироста</span>
        <div class="panel-dynamics__graph">
          <v-chart class="chart" :option="dynamicsLikes" autoresize />
        </div>
      </div>
    </div>
    <div class="panel__graphics">
      <div class="panel__graphics-left">
        <span class="panel-dynamics__title">Время публикации (суточная диаграмма)</span>
        <div class="panel-dynamics__graph">
          <v-chart class="chart" :option="timePublicationsLikes" autoresize />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, BarChart, LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { defineComponent } from 'vue';

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);

export default defineComponent({
  name: 'AdminLikes',
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: 'default',
  },
  setup() {
    const dataInfoNumber = [
      {
        time: 1,
        value: 23
      },
      {
        time: 2,
        value: 12
      },
      {
        time: 3,
        value: 37
      },
      {
        time: 4,
        value: 78
      },
      {
        time: 5,
        value: 153
      },
      {
        time: 6,
        value: 231
      },
      {
        time: 7,
        value: 543
      },
      {
        time: 8,
        value: 234
      },
      {
        time: 9,
        value: 132
      },
      {
        time: 10,
        value: 223
      },
      {
        time: 11,
        value: 754
      },
      {
        time: 12,
        value: 265
      },
      {
        time: 13,
        value: 675
      },
      {
        time: 14,
        value: 498
      },
      {
        time: 15,
        value: 1203
      },
      {
        time: 16,
        value: 1932
      },
      {
        time: 17,
        value: 2578
      },
      {
        time: 18,
        value: 3689
      },
      {
        time: 19,
        value: 4231
      },
      {
        time: 20,
        value: 3456
      },
      {
        time: 21,
        value: 3245
      },
      {
        time: 22,
        value: 2567
      },
      {
        time: 23,
        value: 1456
      },
      {
        time: 0,
        value: 602
      },
    ]
    const timePublicationsLikes = {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        data: dataInfoNumber.map(item => item.time)
      },
      yAxis: {},
      series: [
        {
          type: 'bar',
          data: dataInfoNumber.map(item => item.value),
          barWidth: '13px',
          color: '#21A45D'
        }
      ],
    };
    const dataInfo = [
      {
        month: 'Сен.',
        value: '2123'
      },
      {
        month: 'Окт.',
        value: '5234'
      },
      {
        month: 'Нояб.',
        value: '9654'
      },
      {
        month: 'Дек.',
        value: '13453'
      },
      {
        month: 'Янв.',
        value: '4213'
      },
      {
        month: 'Фев.',
        value: '7542'
      },
      {
        month: 'Март.',
        value: '15324'
      },
      {
        month: 'Апр.',
        value: '18932'
      },
      {
        month: 'Май.',
        value: '21345'
      },
      {
        month: 'Июнь.',
        value: '14532'
      },
      {
        month: 'Июль.',
        value: '11345'
      },
      {
        month: 'Авг.',
        value: '5789'
      },
    ];
    const dynamicsLikes = {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        data: dataInfo.map(item => item.month),
        splitLine: {
          show: true
        },
      },
      yAxis: {
        splitLine: {
          show: true
        }
      },
      series: [
        {
          data: dataInfo.map(item => item.value),
          type: 'line',
          smooth: true,
          color: '#21A45D',
          position: 'right',
        }
      ],
    };
    return { timePublicationsLikes, dynamicsLikes };
  },
});
</script>

