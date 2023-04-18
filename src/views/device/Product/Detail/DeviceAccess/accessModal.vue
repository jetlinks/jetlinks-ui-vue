<template>
  <j-modal
    title="设备接入配置"
    visible
    width="1200px"
    okText="确定"
    cancelText="取消"
    :confirmLoading='loading'
    @ok="submitData"
    @cancel="cancel"
  >
    <pro-search
      :columns="columns"
      target="deviceModal"
      @search="search"
      type="simple"
    />
    <JProTable
      :columns="columns"
      :request="handleQuery"
      ref="tableRef"
      model="CARD"
      :defaultParams="{
                ...temp,
                sorts: accessId ? [
                    { name: 'id', value: accessId },
                    { name: 'createTime', order: 'desc' },
                ] : [{ name: 'createTime', order: 'desc' }],
            }"
      :params="queryParams"
      @cancelSelect="cancelSelect"
      :gridColumn="2"
      :gridColumns="[2]"
    >
      <template #headerTitle>
        <PermissionButton
          type="primary"
          @click="add"
          hasPermission="link/AccessConfig:add"
        >新增</PermissionButton
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
              <img :src="getImage('/device-access.png')" />
            </slot>
          </template>
          <template #content>
            <Ellipsis style="width: calc(100% - 100px)">
              <h3 style="font-weight: 600">
                {{ slotProps.name }}
              </h3>
            </Ellipsis>
            <j-row>
              <j-col :span="12" v-if="slotProps.channelInfo">
                <div class="card-item-content-text">
                  {{ slotProps.channelInfo?.name }}
                </div>
                <Ellipsis style="width: calc(100% - 20px)">
                  <div>
                    {{
                      slotProps.channelInfo?.addresses
                        ? slotProps.channelInfo
                          ?.addresses[0].address
                        : ''
                    }}
                  </div>
                </Ellipsis>
              </j-col>
              <j-col :span="12">
                <div class="card-item-content-text">协议</div>
                <div>{{ slotProps.protocolDetail?.name }}</div>
              </j-col>
            </j-row>
            <j-row>
              <j-col :span="24">
                <Ellipsis style="width: calc(100% - 50px)"
                >
                  <div class="context-access">
                  {{
                      getDescription(
                        slotProps,
                      )
                  }}
                </div>
                </Ellipsis
                >
              </j-col>
            </j-row>
          </template>
        </CardBox>
      </template>
      <template #state="slotProps">
        <j-badge
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
  </j-modal>
</template>

<script setup lang='ts' name='accessModal'>
import type { PropType } from 'vue'
import { getImage } from '@/utils/comm';
import { queryList, getAccessConfig } from '@/api/device/product'
import { message } from 'jetlinks-ui-components'
import { useMenuStore } from '@/store/menu';

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
  const _data  = (resp.result as any)?.data as any[]
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
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    search: {
      type: 'string',
    },
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    search: {
      type: 'select',
      options: [
        {
          label: '正常',
          value: 'started',
        },
        {
          label: '禁用',
          value: 'disable',
        },
      ],
    },
  },
  {
    title: '说明',
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
    loading.value= true
    const resp = await getAccessConfig(props.productId!, checkData.value.id).catch(() => ({ success: false, result: {}}))
    // 返回外部组件需要的数据
    loading.value = false
    if (resp.success) {
      // const providers = findProvidersByProvider((resp.result as any)[0]?.provider)
      emit('submit', {
        access: {...checkData.value},
        metadata: resp.result
      })
    }
  } else {
    message.error('请选择接入方式');
  }
}

/**
 * 关闭弹窗
 */
const cancel = () => {
  emit('cancel')
};

const handleSearch = (e: any) => {
  params.value = e;
};

const handleClick = (data: any) => {
  selectedRowKeys.value = [data.id]
  checkData.value = {...data}
}

const cancelSelect = () => {
  selectedRowKeys.value = []
  checkData.value = {}
}

/**
 * 打开标签新增
 */
const add = () => {
  const url = menuStore.hasMenu('link/AccessConfig/Detail');
  if (url) {
    const tab: any = window.open(`${origin}/#${url}?view=false`);
    tab.onTabSaveSuccess = (value: any) => {
      if (value.status === 200) {
        tableRef.value.reload();
        handleClick(value.result);
      }
    };
  }
};

</script>

<style scoped>

</style>