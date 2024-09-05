<template>
  <j-page-container>
    <div>
      {{ route.name }}
    </div>
    <j-permission-button
      type="primary"
      hasPermission="DataCollect/Channel:add1"
      @click="() => {console.log('caozuo')}"
    >
      <template #icon>
        123
      </template>
      测试
    </j-permission-button>

    <permission-button
      type="primary"
      :tooltip="{
        title: '测试'
      }"
    >
      <template #button>
        button
      </template>
    </permission-button>
    <a-table-card
      name="卡片标题"
      width="400px"
    >
      <template #content>
        中间内容
      </template>
    </a-table-card>
  </j-page-container>
  <div style="width: 100%; height: 300px">
    <init-Amap
      @dragstart="mapClick"
      mapStyle="dark"
    >
      <el-amap-marker
        :position="[0,0]"
      />
    </init-Amap>
  </div>
</template>

<script setup name="Demo" lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()

const mapClick = (e: any) => {
  console.log(e)
}
</script>

<style scoped>

</style>
