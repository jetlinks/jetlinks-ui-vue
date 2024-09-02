<template>
  <a-spin :spinning='loading' :delay='300'>
    <div class='container'>
      <div class='left'>
        <img :src='systemInfo?.front?.background || bgImage' alt=''>
        <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank" rel="noopener noreferrer" class="records">
          备案：渝ICP备19017719号-1
        </a>
      </div>
      <div class='right'>
        <Right :logo="systemInfo?.front?.logo" :title="layout?.title" v-model:loading="loading" />
      </div>
    </div>
  </a-spin>
</template>
<script setup name="Login" lang="ts">
import { getImage } from '@jetlinks-web/utils'
import { useSystemStore } from '@/store/system'
import { storeToRefs } from 'pinia'
import Right from './right.vue'

const systemStore = useSystemStore()
const { systemInfo, layout } = storeToRefs(systemStore)
const loading = ref(false)

const bgImage = getImage('/login/login.png')

systemStore.querySingleInfo('front')
</script>

<style scoped lang="less">
.container {
  display: flex;
  height: 100vh;
  background-color: #fff;
  >div {
    height: 100%;
  }

  .left {
    flex: 1;
    img {
      height: 100%;
      width: 100%;
    }
    .records {
      position: absolute;
      top: 96%;
      left: 35%;
      color: rgba(0, 0, 0, 0.35);
      font-size: 14px;
    }
  }

  .right {
    min-width: 400px;
    width: 27%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>
