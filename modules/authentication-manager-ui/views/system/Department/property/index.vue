<template>
  <a-tabs v-model:active-key="activeKey" type="card" :destroyInactiveTabPane="true">
    <a-tab-pane v-for="item in _extra" :key="item.name">
      <template #tab>
        <a-space>
          <img :src="item.icon" alt="">
          {{ $t(item.label) }}
          <span>{{ assetsCount[item.name] || 0 }}</span>
        </a-space>
      </template>
      <component :is="item.component" :parentId="departmentId"  @refresh="onRefresh" @open-device-bind="openDeviceBind"/>
    </a-tab-pane>
  </a-tabs>
  <a-empty v-if="!_extra.length" :description="$t('property.index.675027-4')">

  </a-empty>
</template>

<script setup lang="ts" name="property">
import Product from '../product/index.vue'
import Device from '../device/index.vue'
import {productIcon, deviceIcon} from '@authentication-manager-ui/assets';
import {useMenuStore} from '@jetlinks-web-core/store';
import {getDeviceCount, getProductCount} from "@authentication-manager-ui/api/system/department";
import {useI18n} from 'vue-i18n';

const {t: $t} = useI18n();

const props = defineProps({
  departmentId: {
    type: String,
    default: ''
  }
})
const activeKey = ref('product');
const menuStore = useMenuStore();
const _extra = ref([
  {
    name: 'product',
    label: 'Department.index.945805-0',
    icon: productIcon,
    component: Product
  },
  {
    name: 'device',
    label: 'Department.index.945805-1',
    icon: deviceIcon,
    component: Device
  },
])
const assetsCount = reactive({
  product: 0,
  device: 0
})


const init = async () => {
  if (!menuStore.hasMenu('device/Product')) {
    _extra.value.splice(_extra.value.findIndex(i => i.name === 'product'), 1)
  }
  if (!menuStore.hasMenu('device/Instance')) {
    _extra.value.splice(_extra.value.findIndex(i => i.name === 'device'), 1)
  }
  activeKey.value = _extra.value?.[0]?.name
}

const openDeviceBind = () => {
  activeKey.value = 'device'
}

const queryProductCount = async () => {
  // 查询当前部门下的产品数量
  if (menuStore.hasMenu('device/Product')) {
    const res = await getProductCount({
      terms: [
        {
          column: 'id',
          termType: 'dim-assets',
          value: {
            assetType: 'product',
            targets: [
              {
                type: 'org',
                id: props.departmentId,
              },
            ],
          },
        },
      ]
    })
    if (res.success) {
      assetsCount.product = res.result || 0
    }
  }
}

const queryDeviceCount = async () => {
  if (menuStore.hasMenu('device/Instance')) {
    const res = await getDeviceCount({
      terms: [
        {
          column: 'id',
          termType: 'dim-assets',
          value: {
            assetType: 'device',
            targets: [
              {
                type: 'org',
                id: props.departmentId,
              },
            ],
          },
        },
      ]
    })
    if (res.success) {
      assetsCount.device = res.result || 0
    }
  }
}

const onRefresh = async (flag: boolean) => {
  queryProductCount()
  queryDeviceCount()
}

watch(() => props.departmentId, async () => {
  if (props.departmentId) {
    await queryProductCount()
    await queryDeviceCount()
  }
}, {
  immediate: true
})
init();
</script>
<style scoped lang="less">
:deep(.ant-tabs-nav) {
  &::before {
    border: none;
  }
}

:deep(.ant-tabs-tab) {
  min-width: 140px;
  border: none !important;
  background: transparent !important;
}

:deep(.ant-tabs-tab-active) {
  background: #F0F0F0 !important;
  border-radius: 6px !important;

  .ant-tabs-tab-btn {
    color: #000;
    text-shadow: none;
  }
}

.custom-tag {
  width: 140px;
  height: 40px;
  border-radius: 6px;
  background: #F0F0F0;
  padding: 8px 24px;
}
</style>
