<template>
  <page-container>
    <div class='scene-warp'>
      <div></div>
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

const { getDetail, data } = useSceneStore()
const route = useRoute();
const loading = ref(false)

getDetail(route.query.id as string)

</script>

<style scoped lang='less'>
.scene-warp {
  padding: 24px;
  background-color: #fff;
}
</style>