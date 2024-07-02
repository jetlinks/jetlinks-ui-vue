<template>
  <page-container>
    <FullPage>
      <div class='scene-warp'>
        <div class='header' v-if="data.name">
          <Ellipsis :tooltip='data.name' style='max-width: 50%'>
            <span class='title'>{{ data.name }}</span>
          </Ellipsis>
          <div class='type'>
            <img :src='TriggerHeaderIcon[data.triggerType]' />
            {{ keyByLabel[data.triggerType] }}
          </div>
          <div style='flex: 1 1 0;min-width: 0;margin-left: 8px'>
            <Description v-model:value="data.description" />
          </div>
        </div>
        <j-form ref='sceneForm' :model='data' :colon='false' layout='vertical'>
          <Device ref="deviceRef" v-if='data.triggerType === "device"' />
          <Manual v-else-if='data.triggerType === "manual"' />
          <Timer v-else-if='data.triggerType === "timer"' />
<!--          <j-form-item-->
<!--          >-->
<!--            <template #label>-->
<!--              <TitleComponent data='说明' style='font-size: 14px;' />-->
<!--            </template>-->
<!--            <j-textarea-->
<!--                v-model:value="data.description"-->
<!--                placeholder='请输入说明'-->
<!--                :rows="4"-->
<!--                show-count-->
<!--                :maxLength="200"-->
<!--            />-->
<!--          </j-form-item>-->
        </j-form>
        <PermissionButton
          type='primary'
          hasPermission='rule-engine/Scene:update'
          :loading='loading'
          @click='save'
        >
          保存
        </PermissionButton>
      </div>
    </FullPage>
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
import { modify } from '@/api/rule-engine/scene'
import { useMenuStore } from '@/store/menu'
import { onlyMessage } from '@/utils/comm';
import Description from './components/Description.vue'
import {handleFeatures} from "@/views/rule-engine/Scene/Save/util";

const sceneStore = useSceneStore()
const menuStore = useMenuStore()
const { data } = storeToRefs(sceneStore)
const { getDetail, refresh } = sceneStore

const route = useRoute();
const sceneForm = ref()
const loading = ref(false)
const deviceRef = ref()

const save = async () => {
  const formData = await sceneForm.value.validateFields().catch(err => {
    const names = err.errorFields[0].name
    console.log('err', names)
    deviceRef.value?.changePaneIndex(names[1])
  })
  if (formData) {
    loading.value = true
    const branches = data.value.branches?.filter(item => item)
    const features = handleFeatures(branches)
    const resp: any = await modify(data.value.id!, { ...data.value, features, branches }).then(res => res).catch(() => {
      loading.value = false
    })
    loading.value = false
    if (resp.success) {
      if ((window as any).onTabSaveSuccess) {
        (window as any).onTabSaveSuccess(resp);
        setTimeout(() => window.close(), 300);
      } else {
        menuStore.jumpPage('rule-engine/Scene');
      }
      onlyMessage('操作成功');
    }
  }
}

getDetail(route.query.id as string)

onUnmounted(() => {
  refresh?.()
})

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
<style lang='less'>
@import "./style.less";
</style>
