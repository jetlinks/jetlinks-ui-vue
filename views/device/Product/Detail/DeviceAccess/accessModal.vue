<template>
  <a-modal
      :title="$t('DeviceAccess.accessModal.132524-0')"
      open
      width="1200px"
      :okText="$t('DeviceAccess.accessModal.132524-1')"
      :cancelText="$t('DeviceAccess.accessModal.132524-2')"
      :confirmLoading='loading'
      :maskClosable="false"
      @ok="submitData"
      @cancel="cancel"
  >
    <pro-search
        :columns="columns"
        target="deviceModal"
        @search="handleSearch"
        type="simple"
        style="padding: 0"
    />
    <JProTable
        :columns="columns"
        :request="handleQuery"
        ref="tableRef"
        mode="CARD"
        :defaultParams="{
                ...temp,
                sorts: accessId ? [
                    { name: 'id', value: accessId },
                    { name: 'createTime', order: 'desc' },
                ] : [{ name: 'createTime', order: 'desc' }],
            }"
        :params="params"
        :gridColumns="[2]"
        :pagination="{
        pageSizeOptions: ['4', '12', '24', '48'],
        showSizeChanger: true,
      }"
        style="padding: 0"
    >
      <template #headerLeftRender>
        <j-permission-button
            type="primary"
            @click="add"
            hasPermission="link/AccessConfig:add"
        >{{ $t('DeviceAccess.accessModal.132524-3') }}
        </j-permission-button
        >
      </template>
      <template #deviceType="slotProps">
        <div>{{ slotProps.deviceType.text }}</div>
      </template>
      <template #card="slotProps">
        <CardBox
            :value="slotProps"
            @click="handleClick"
            v-bind="slotProps"
            :active="selectedRowKeys.includes(slotProps.id)"
            :status="slotProps.state.value"
            :statusText="slotProps.state.text"
            :statusNames="{
                        enabled: 'processing',
                        disabled: 'error',
                    }"
        >
          <template #img>
            <slot name="img">
              <img :src="device.deviceAccess"/>
            </slot>
          </template>
          <template #content>
            <div style="height: 110px">
              <j-ellipsis style="width: calc(100% - 100px); margin-bottom: 18px"
              ><span style="font-weight: 600; font-size: 16px">
                  {{ slotProps.name }}
                </span></j-ellipsis
              >
              <template v-if="slotProps.provider !== 'composite-device-gateway'">
                <a-row>
                  <a-col :span="12" v-if="slotProps.channelInfo">
                    <div class="card-item-content-text">
                      <j-ellipsis>{{ slotProps.channelInfo?.name }}</j-ellipsis>
                    </div>
                    <j-ellipsis style="width: calc(100% - 20px)">
                      <div>
                        {{
                          slotProps.channelInfo?.addresses
                              ? slotProps.channelInfo
                                  ?.addresses[0].address
                              : ''
                        }}
                      </div>
                    </j-ellipsis>
                  </a-col>
                  <a-col :span="12">
                    <div class="card-item-content-text">{{ $t('DeviceAccess.accessModal.132524-4') }}</div>
                    <j-ellipsis style="width:calc(100%-20px)">
                      <div>{{ slotProps.protocolDetail?.name }}</div>
                    </j-ellipsis>
                  </a-col>
                </a-row>
              </template>
              <a-row>
                <a-col :span="24">
                  <j-ellipsis style="width: calc(100% - 50px)">
                    <div class="context-access">
                      {{
                        getDescription(
                            slotProps,
                        )
                      }}
                    </div>
                  </j-ellipsis>
                </a-col>
              </a-row>
            </div>
          </template>
        </CardBox>
      </template>
      <template #state="slotProps">
        <a-badge
            :text="slotProps.state.text"
            :status="slotProps.state"
            :statusNames='{
            "enabled": "processing",
            "disabled": "error",
          }'
        />
      </template>
      <template #id="slotProps">
        <a>{{ slotProps.id }}</a>
      </template>
    </JProTable>
  </a-modal>
</template>

<script setup lang='ts' name='accessModal'>
import type {PropType} from 'vue'
import {onlyMessage, randomString} from '@jetlinks-web/utils';
import {queryList, getAccessConfig} from '../../../../../api/product'
import {useMenuStore} from '@jetlinks-web-core/store';
import {getProductByPluginId} from '../../../../../api/link/plugin'
import {getProviders} from '../../../../../api/link/accessConfig'
import {device} from '../../../../../assets'
import {useI18n} from 'vue-i18n';
import {useTabSaveSuccess} from '@jetlinks-web-core/hooks'

const {t: $t} = useI18n();

type Emit = {
  (e: 'submit', data: any): void
  (e: 'cancel'): void
}

const props = defineProps({
  productId: {
    type: String,
    default: undefined
  },
  accessId: {
    type: String,
    default: undefined
  },
  deviceType: {
    type: String,
    default: undefined
  },
  providersList: {
    type: Array as PropType<any[]>,
    default: () => []
  }
})

const emit = defineEmits<Emit>()
const menuStore = useMenuStore();
const checkData = ref()
const tableRef = ref()
const loading = ref(false)
const params = ref<Record<string, any>>({
  pageSize: 4,
  terms: [],
})

const selectedRowKeys = ref<string[]>(props.accessId ? [props.accessId] : [])

const {onOpen} = useTabSaveSuccess('link/AccessConfig/Detail', {
  async onSuccess(value) {
    tableRef.value.reload();
    handleClick(value.result);
  }
})

const getDescription = (slotProps: Record<string, any>) =>
    slotProps.description
        ? slotProps.description
        : props.providersList?.find(
            (item: Record<string, any>) => item.id === slotProps.provider,
        )?.description;
/**
 * 查询条件
 */
const temp = {
  ...params.value,
  terms:
      props.deviceType === 'childrenDevice'
          ? [
            ...params.value.terms,
            {
              terms: [
                {
                  column: 'provider',
                  termType: 'in',
                  value: 'child-device,edge-child-device',
                },
              ],
            },
          ]
          : [...params.value?.terms],
};

const handleQuery = async (q: any) => {
  const resp = await queryList(q)
  const _data = (resp.result as any)?.data as any[]
  if (_data?.length) {
    const _checkItem = _data.find(item => item.id === selectedRowKeys.value[0])
    if (_checkItem) {
      checkData.value = _checkItem
    }
  }

  return {
    ...resp
  }
}

const columns = [
  {
    title: $t('DeviceAccess.accessModal.132524-5'),
    dataIndex: 'name',
    key: 'name',
    search: {
      type: 'string',
    },
  },
  {
    title: $t('DeviceAccess.accessModal.132524-6'),
    dataIndex: 'provider',
    key: 'provider',
    search: {
      type: 'select',
      options: () => {
        return new Promise(resolve => {
          getProviders().then(res => {
            resolve(res.result?.map((item: any) => ({...item, label: item.name, value: item.id})) || [])
          })
        })
      },
    },
  },
  {
    title: $t('DeviceAccess.accessModal.132524-7'),
    dataIndex: 'state',
    key: 'state',
    search: {
      type: 'select',
      options: [
        {
          label: $t('DeviceAccess.accessModal.132524-8'),
          value: 'enabled',
        },
        {
          label: $t('DeviceAccess.accessModal.132524-9'),
          value: 'disabled',
        },
      ],
    },
  },
  {
    title: $t('DeviceAccess.accessModal.132524-10'),
    key: 'description',
    dataIndex: 'description',
    search: {
      type: 'string',
    },
  },
]

const findProvidersByProvider = (provider: string) => {
  if (!provider) return {}

  return props.providersList.find(item => item.id === provider) || {}
}
/**
 * 提交设备数据
 */
const submitData = async () => {
  if (selectedRowKeys.value.length) {
    if (checkData.value.channel === 'plugin') {
      const resp = await getProductByPluginId(checkData.value.channelId).catch(() => ({success: false, result: []}))
      const metadataResp = await getAccessConfig(props.productId!, checkData.value.id).catch(() => ({success: false, result: {}}))

      emit('submit', {
        access: {...checkData.value},
        productTypes: resp.result,
        metadata: metadataResp.result
      })
    } else {
      loading.value = true
      const resp = await getAccessConfig(props.productId!, checkData.value.id).catch(() => ({success: false, result: {}}))
      // 返回外部组件需要的数据
      loading.value = false
      if (resp.success) {
        // const providers = findProvidersByProvider((resp.result as any)[0]?.provider)
        emit('submit', {
          access: {...checkData.value},
          metadata: resp.result
        })
      }
    }
  } else {
    onlyMessage($t('DeviceAccess.accessModal.132524-11'), 'error');
  }
}

/**
 * 关闭弹窗
 */
const cancel = () => {
  emit('cancel')
};

const handleSearch = (e: any) => {
  params.value.terms = e.terms;
};

const handleClick = (data: any) => {
  selectedRowKeys.value = [data.id]
  checkData.value = {...data}
}

// const cancelSelect = () => {
//   selectedRowKeys.value = []
//   checkData.value = {}
// }

/**
 * 打开标签新增
 */
const add = () => {
  onOpen({
    view: false,
    save: true
  })
};

</script>

<style scoped>
</style>
