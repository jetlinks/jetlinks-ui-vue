<template>
  <div class="basic-info-container">
    <div class="card">
      <TitleComponent :data="$t('BasicInfo.index.966110-0')" />
      <Info ref="basicFormRef" :value="value" />
    </div>
    <div class="card">
      <TitleComponent :data="$t('BasicInfo.index.966110-1')" />
      <Permission ref="permissionFormRef" :value="value" />
      <j-permission-button
        :hasPermission="`${permission}:${
          route.params.id === ':id' ? 'add' : 'update'
        }`"
        :loading="loading"
        type="primary"
        @click="onSave"
      >
        {{ $t('BasicInfo.index.966110-2') }}
      </j-permission-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Info from './Info.vue'
import Permission from './Permission.vue'
import { addMenu, updateMenu } from '@/api/system/menu'
import { useRequest } from '@jetlinks-web/hooks'
import { onlyMessage } from '@jetlinks-web/utils'
import { useMenuStore } from '@/store/menu'
import {OWNER_KEY} from "@/utils/consts";
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const permission = 'system/Menu'
const menuStore = useMenuStore()
const route = useRoute()

const basicFormRef = ref<any>()
const permissionFormRef = ref<any>()

const emits = defineEmits(['refresh'])
const props = defineProps({
  value: {
    type: Object,
    default: () => {},
  },
})

const { loading, run } = useRequest(route.query.id !== ':id' ? updateMenu : addMenu, {
  immediate: false,
  onSuccess(res: any) {
    if (res.success) {
      onlyMessage($t('BasicInfo.index.966110-3'))
      emits('refresh')
      if (!props.value?.id) {
        menuStore.jumpPage('system/Menu/Detail', {
          params: { id: res.result.id },
        })
      }
    }
  },
})

const onSave = async () => {
  const info = await basicFormRef.value?.onSave()
  const permission = await permissionFormRef.value?.onSave()
  const accessSupportValue = permission.accessSupport
  const params = {
    ...info,
    ...permission,
    accessSupport: {
      value: accessSupportValue,
      label:
        accessSupportValue === 'unsupported'
          ? $t('BasicInfo.index.966110-4')
          : accessSupportValue === 'support'
          ? $t('BasicInfo.index.966110-5')
          : $t('BasicInfo.index.966110-6'),
    },
    owner: OWNER_KEY,
  }
  run(params)
}
</script>

<style lang="less" scoped>
.basic-info-container {
  .card {
    margin-bottom: 24px;
    padding: 24px;
    background-color: #fff;
  }
}
</style>
