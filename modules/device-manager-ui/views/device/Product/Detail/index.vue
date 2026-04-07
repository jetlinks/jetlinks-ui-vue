<template>
  <j-page-container
    :tabList="list"
    :tabActiveKey="productStore.tabActiveKey"
    @tabChange="onTabChange"
    :showBack="true"
  >
    <template #title>
      <div>
        <div style="display: flex; align-items: center">
          <a-tooltip>
            <template #title>{{ productStore.current.name }}</template>
            <div class="productDetailHead">
              {{ productStore.current.name }}
            </div>
          </a-tooltip>
          <div
            style="margin: -5px 0 0 20px"
            v-if="permissionStore.hasPermission('device/Product:action')"
          >
            <j-permission-button
              style="padding: 0"
              type="text"
              hasPermission="device/Product:action"
              :popConfirm="{
                title: productStore.current.state === 1 ? $t('Detail.index.478940-0') : $t('Detail.index.478940-1'),
                onConfirm: productStore.current.state === 1 ? handleUndeploy : handleDeploy
              }"
            >
              <a-switch
                :checked="productStore.current.state === 1"
                :checked-children="$t('Detail.index.478940-2')"
                :un-checked-children="$t('Detail.index.478940-3')"
                :disabled="!permissionStore.hasPermission('device/Product:action')"
              />
            </j-permission-button>
          </div>
          <div
            style="margin: -5px 0 0 20px"
            v-else
          >
            <a-tooltip>
              <template #title>{{ $t('Detail.index.478940-4') }}</template>
              <a-switch
                v-if="productStore.current.state === 1"
                :checked="productStore.current.state === 1"
                :checked-children="$t('Detail.index.478940-2')"
                :un-checked-children="$t('Detail.index.478940-3')"
                :disabled="!permissionStore.hasPermission('device/Product:action')"
              />
              <a-switch
                v-if="productStore.current.state === 0"
                :unCheckedValue="productStore.current.state === 0"
                :checked-children="$t('Detail.index.478940-2')"
                :un-checked-children="$t('Detail.index.478940-3')"
                :disabled="!permissionStore.hasPermission('device/Product:action')"
              />
            </a-tooltip>
          </div>
        </div>
      </div>
    </template>
    <template #content>
      <div style="padding-top: 10px">
        <a-descriptions
          size="small"
          :column="4"
        >
          <a-descriptions-item
            :label="$t('Detail.index.478940-5')"
            :labelStyle="{
              fontSize: '14px',
              opacity: 0.55
            }"
            :contentStyle="{
              fontSize: '14px',
              color: '#092EE7',
              cursor: 'pointer'
            }"
          >
            <span @click="jumpDevice">{{ productStore.current?.count ? productStore.current?.count : 0 }}</span>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </template>
    <template #extra>
      <j-permission-button
        type="primary"
        :popConfirm="{
          title: $t('Detail.index.478940-6'),
          onConfirm: handleDeploy
        }"
        :disabled="productStore.current?.state === 0"
        :tooltip="productStore.current?.state === 0 ? { title: $t('Detail.index.478940-7') } : undefined"
        hasPermission="device/Product:update"
        placement="topRight"
      >
        {{ $t('Detail.index.478940-8') }}
      </j-permission-button>
    </template>
    <FullPage>
      <div :style="contentStyle">
        <component
          :is="tabs[productStore.tabActiveKey]"
          :class="productStore.tabActiveKey === 'Metadata' ? 'metedata' : ''"
          v-bind="{ type: 'product' }"
        />
      </div>
    </FullPage>
  </j-page-container>
</template>

<script lang="ts" setup>
import { useProductStore } from '../../../../store/product'
import { _deploy, _undeploy, getProtocolDetail } from '../../../../api/product'
import { handleParamsToString } from '@jetlinks-web-core/utils'
import { useMenuStore } from '@jetlinks-web-core/store/menu'
import { useRouterParams } from '@jetlinks-web/hooks'
import { EventEmitter, onlyMessage } from '@jetlinks-web/utils'
import { useAuthStore, useSystemStore } from '@jetlinks-web-core/store'
import { isNoCommunity } from '@jetlinks-web-core/utils/utils'
import { useI18n } from 'vue-i18n'
import { tabs } from './asyncComponent'
import { isApplyDashboard } from '@device-manager-ui/utils/dashboardProject'

const { t: $t } = useI18n()

const { showThreshold } = useSystemStore()
const permissionStore = useAuthStore()
const menuStory = useMenuStore()
const route = useRoute()
const productStore = useProductStore()
const routerParams = useRouterParams()

const list = ref([
  {
    key: 'Info',
    tab: $t('Detail.index.478940-9')
  },
  {
    key: 'Metadata',
    tab: $t('Detail.index.478940-10'),
    class: 'objectModel'
  },
  {
    key: 'Device',
    tab: $t('Detail.index.478940-11')
  }
])

const contentStyle = computed(() => {
  if (productStore.tabActiveKey === 'Dashboard') {
    return {
      height: '100%',
      padding: '0',
      overflow: 'hidden'
    } as any
  }
  return {
    height: '100%',
    padding: '24px',
    overflowY: 'auto'
  } as any
})

const onTabChange = (e: string) => {
  if (productStore.tabActiveKey === 'Metadata') {
    EventEmitter.emit('MetadataTabs', () => {
      productStore.tabActiveKey = e
    })
  } else {
    productStore.tabActiveKey = e
  }
}

/**
 * 启用产品
 */
const handleDeploy = () => {
  if (productStore.current.id) {
    const resp = _deploy(productStore.current.id)
    resp.then((res) => {
      if (res.status === 200) {
        onlyMessage($t('Detail.index.478940-12'))
        productStore.refresh(productStore.current.id)
      }
    })
    return resp
  }
}

/**
 * 禁用产品
 */
const handleUndeploy = () => {
  if (productStore.current.id) {
    const resp = _undeploy(productStore.current.id)
    resp.then((res) => {
      if (res.status === 200) {
        onlyMessage($t('Detail.index.478940-12'))
        productStore.refresh(productStore.current.id)
      }
    })
    return resp
  }
}

/**
 * 查询设备数量
 */
// const getNunmber = async () => {
// const params = new URLSearchParams();
// params.append('q', JSON.stringify(searchParams.value));
// params.append('target', 'device-instance');
// console.log(params, ' params');
// const res = await getDeviceNumber(
//     encodeQuery({ terms: { productId: params?.id } }),
// );
// };
// getNunmber();

/**
 * 是否显示数据解析模块
 */
const getProtocol = async () => {
    list.value = [
        {
            key: 'Info',
            tab: $t('Detail.index.478940-9'),
        },
        {
            key: 'Metadata',
            tab: $t('Detail.index.478940-10'),
            class: 'objectModel',
        },
        {
            key: 'Device',
            tab: $t('Detail.index.478940-11'),
        },
    ];

    const features =  productStore.current?.features || []
    const paring = features?.find(
      (item: any) => item.id === 'transparentCodec',
    );
    if (paring) {
      list.value.push({
        key: 'DataAnalysis',
        tab: $t('Detail.index.478940-13'),
      });
    }
      const supportFirmware = features?.find(
        (item: any) => item.id === 'supportFirmware',
      );
    if (
      supportFirmware &&
      permissionStore.hasPermission('device/Firmware:view') &&
      isNoCommunity
    ) {
      list.value.push({
        key: 'Firmware',
        tab: $t('Detail.index.478940-14'),
      });
    }
    if (
      features.find(
        (item: any) => item.id === 'diffMetadataSameProduct',
      )
    ) {
      list.value.push({ key: 'MetadataMap', tab: $t('Detail.index.478940-15') });
    }
    if (
      permissionStore.hasPermission(
        'rule-engine/Alarm/Log:view',
      ) &&
      showThreshold
    ) {
      list.value.push({
        key: 'AlarmRecord',
        tab: $t('Detail.index.478940-16'),
      });
      if( isNoCommunity ){
        list.value.push({
          key: 'Invalid',
          tab: $t('Detail.index.478940-17')
        })
      }
    }

  // 产品仪表盘（展示该产品下设备对应的仪表盘项目）
  if (isApplyDashboard() && !list.value.some((i) => i.key === 'Dashboard')) {
    list.value.push({ key: 'Dashboard', tab: $t('Detail.index.478940-20') })
  }
};
/**
 * 详情页跳转到设备页
 */
const jumpDevice = () => {
  // console.log(productStore.current?.id);
  const searchParams = {
    column: 'productName',
    termType: 'eq',
    value: productStore.current?.id
  }
  menuStory.jumpPage('device/Instance', {
    query: {
      target: 'device-instance',
      q: handleParamsToString([searchParams])
    }
  })
}

watch(
  () => productStore.current,
  () => {
    getProtocol()
  }
)

// watch(
//   () => route.params.id,
//   (newId) => {
//     if (newId && route.name === 'device/Product/Detail') {
//       productStore.reSet();
//       productStore.tabActiveKey = 'Info';
//       productStore.refresh(newId as string);
//     }
//   },
//   { immediate: true, deep: true },
// );

onMounted(() => {
  productStore.reSet()
  productStore.refresh(route.params.id as string)
  productStore.tabActiveKey = routerParams.params?.value.tab || 'Info'
})
</script>
<style scoped lang="less">
.ant-switch-loading,
.ant-switch-disabled {
  cursor: not-allowed;
}
.productDetailHead {
  max-width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
