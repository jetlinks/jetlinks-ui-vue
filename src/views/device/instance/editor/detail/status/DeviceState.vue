<template>
  <chart-card
    :bordered="false"
    title="设备状态"
    style="width: 300px"
    :total="'离线'"
    :showFooter="false"
  >
    <a-tooltip title="刷新" slot="action">
      <a-icon type="sync" />
    </a-tooltip>
    <span> 离线时间：{{ GetTime('2020-10-12') }}</span>
  </chart-card>
</template>

<script>
  // eslint-disable-next-line no-unused-vars
  import moment from 'moment'
  import {
    ChartCard
  } from '@/components'
  export default {
    name: 'EditorDetailStatus',
    components: {
      ChartCard
    },
    computed: {
      GetTime (time) {
        return function (time) {
          return moment(time).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
