<template>
  <page-container>
    <div class='scene-warp'>
      <div class='header'>

        <div class='type'>
          <img :src='TriggerHeaderIcon[data.triggerType]' />
          {{ keyByLabel[data.triggerType] }}
        </div>
      </div>
      <a-form ref='sceneForm' :model='data'>

      </a-form>
      <PermissionButton
        type='primary'
        hasPermission='rule-engine/Scene:update'
      >
        保存
      </PermissionButton>
<!--      <a-button type='primary' :loading='loading'>保存</a-button>-->
    </div>
  </page-container>
</template>

<script setup lang='ts' name='Scene'>
import { useSceneStore } from '@/store/scene'
import { TriggerHeaderIcon } from './asstes'
import { keyByLabel } from '../typings'

const { getDetail, data } = useSceneStore()
const route = useRoute();
const loading = ref(false)

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

    .type {
      display: flex;
      align-items: center;
      min-width: 100px;
      margin-left: 16px;
      padding: 4px 8px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 2px;
    }
  }
}
</style>