<template>
  <page-container>
    <div class='scene-warp'>
      <div class='header'>
        <Ellipsis :tooltip='data.name' style='max-width: 50%'>
          <span class='title'>{{ data.name }}</span>
        </Ellipsis>
        <div class='type'>
          <img :src='TriggerHeaderIcon[data.triggerType]' />
          {{ keyByLabel[data.triggerType] }}
        </div>
      </div>
      <j-form ref='sceneForm' :model='data' :colon='false' layout='vertical'>
        <Device v-if='data.triggerType === "device"' />
        <Manual v-else-if='data.triggerType === "manual"' />
        <Timer v-else-if='data.triggerType === "timer"' />
      </j-form>
      <PermissionButton
        type='primary'
        hasPermission='rule-engine/Scene:update'
      >
        保存
      </PermissionButton>
    </div>
  </page-container>
</template>

<script setup lang='ts' name='Scene'>
import { storeToRefs } from 'pinia';
import { useSceneStore } from '@/store/scene'
import { TriggerHeaderIcon } from './asstes'
import { keyByLabel } from '../typings'
import Device from './Device/index.vue'
import Manual from './Manual/index.vue'
import Timer from './Timer/index.vue'

const sceneStore = useSceneStore()
const { data } = storeToRefs(sceneStore)
const { getDetail } = sceneStore

const route = useRoute();
const loading = ref(false)
console.log('data',data)

getDetail(route.query.id as string)

</script>

<style scoped lang='less'>
.scene-warp {
  padding: 24px;
  background-color: #fff;

  .header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 16px;
    .title {
      font-size: 20px;
      color: rgba(#000, .8);
      font-weight: bold;
    }
    .type {
      display: flex;
      align-items: center;
      min-width: 80px;
      margin-left: 16px;
      padding: 4px 8px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 2px;
      img {
        margin-right: 4px;
      }
    }
  }
}
</style>