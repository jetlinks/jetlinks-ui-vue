<template>
      <j-page-container>
        <router-view>
        123123123
        <j-permission-button
          type="primary"
          @click="mapClick"
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
        </router-view>
      </j-page-container>
</template>

<script setup name="Demo" lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

const mapClick = (e: any) => {
  router.push('/demo/detail/12312')
}
</script>

<style scoped>

</style>
