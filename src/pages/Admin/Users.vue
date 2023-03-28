<template>
  <div class="admin__pages-users panel">
    <div class="panel-publications__top">
      <img src="../../../public/static/img/admin/admin_1.png" alt="Пользователи">
      <div class="panel-publications__info">
        <span>Пользователей зарегистрировано:</span>
        <span>357</span>
      </div>
    </div>
    <div class="panel__graphics">
      <div class="panel__graphics-left first__graph">
        <span class="panel-dynamics__title">Динамика прироста (в неделю)</span>
        <div class="panel-dynamics__graph">
          <v-chart class="chart" :option="dynamics" autoresize />
        </div>
      </div>
    </div>
    <div class="panel__graphics-circle">
      <div class="panel__graphics-circle-left first__circle">
        <span class="panel-dynamics__title">Распределение по возрасту</span>
        <v-chart class="chart" :option="circleAge" />
      </div>
      <div class="panel__graphics-circle-left">
        <span class="panel-dynamics__title">Распределение по полу</span>
        <v-chart class="chart" :option="gender" />
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
  name: 'AdminUsers',
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: 'default',
  },
  setup() {
    const dataInfo = [
      {
        week: 'Понедельник',
        value: 45
      },
      {
        week: 'Вторник',
        value: 25
      },
      {
        week: 'Среда',
        value: 13
      },
      {
        week: 'Четверг',
        value: 75
      },
      {
        week: 'Пятница',
        value: 145
      },
      {
        week: 'Суббота',
        value: 256
      },
      {
        week: 'Воскресенье',
        value: 113
      },
    ]
    const dynamics = {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        data: dataInfo.map(item => item.week),
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
    const circleAge = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          color: [
            '#007DF3',
            '#21A45D',
            '#565656',
            '#8C5CFF',
            '#F04C5D',
            '#F9C001',
          ],
          radius: ['60%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 13,
              fontWeight: 'bold',
              formatter: '{b}: ({d}%)'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 44, name: '19-23 лет' },
            { value: 15, name: '0-18 лет' },
            { value: 13, name: '24-30 лет' },
            { value: 20, name: '30-45 лет' },
            { value: 3, name: '> 75 лет' }
          ]
        }
      ]
    };
    const gender = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          color: [
            '#F9C001',
            '#21A45D',
          ],
          radius: ['60%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 13,
              fontWeight: 'bold',
              formatter: '{b}: ({d}%)',
              color: '#21a45d'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 20, name: 'Женщины' },
            { value: 18, name: 'Мужчины' },
          ]
        }
      ]
    };
    return { dynamics, circleAge, gender };
  },
});
</script>
