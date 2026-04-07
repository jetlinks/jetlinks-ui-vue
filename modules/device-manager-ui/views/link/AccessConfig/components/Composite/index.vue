<template>
  <div>
    <a-steps :current="stepCurrent">
      <a-step :title="$t('Composite.index.636069-17')" :key="0"></a-step>
      <a-step :title="$t('Composite.index.636069-18')" :key="1"></a-step>
    </a-steps>
    <div class="steps-content">
      <div class="steps-box" v-if="stepCurrent === 0">
        <div class="alert">
          <AIcon type="InfoCircleOutlined" />
          <span>{{ $t('Composite.index.636069-0') }}</span>
        </div>
        <div class="search">
          <a-input-search
            allowClear
            :placeholder="$t('Composite.index.636069-1')"
            style="width: 300px"
            @search="handleSearch"
          />
          <j-permission-button
            hasPermission="link/Type:add"
            type="primary"
            @click="handleAdd"
          >
            <template #icon>
              <AIcon type="PlusOutlined" />
            </template>
            {{ $t('Composite.index.636069-2') }}
          </j-permission-button>
        </div>
        <j-scrollbar height="480">
          <j-pro-table
            mode="CARD"
            modeValue="CARD"
            :dataSource="filterProviderList"
            :noPagination="true"
            :gridColumn="2"
            :gridColumns="[1, 2]"
          >
            <template #card="slotProps">
              <CardBox
                :showStatus="false"
                :actions="getActions(slotProps)"
                @click="handleAccessItemDetail(slotProps)"
              >
                <template #img>
                  <img :src="BackMap.get(slotProps.provider)" alt="">
                </template>
                <template #content>
                  <div class="card-item-content">
                      <j-ellipsis style="width: calc(100% - 100px)">
                          <span class="card-title">
                              {{ slotProps.name }}
                          </span>
                      </j-ellipsis>
                      <a-row class="card-item-content-box">
                          <a-col
                              :span="12"
                              v-if="slotProps.channelInfo"
                              class="card-item-content-text"
                          >
                              <j-ellipsis>
                                  <div
                                      class="card-item-content-text-title"
                                  >
                                      {{
                                          slotProps.channelInfo
                                              .name
                                      }}
                                  </div>
                              </j-ellipsis>
                              <j-ellipsis
                                style="
                                  width: calc(100% - 10px);
                                  display: flex;
                                  margin-top: 4px;
                                "
                                v-if="slotProps.channelInfo.addresses"
                              >
                                  <a-badge
                                    :status="
                                        getStatus(slotProps)
                                    "
                                  />
                                  <span>
                                      {{
                                          slotProps.channelInfo
                                              .addresses[0]
                                              .address
                                      }}
                                  </span>
                              </j-ellipsis>
                          </a-col>
                          <a-col
                              :span="12"
                              v-if="slotProps.protocolDetail"
                              class="card-item-content-text"
                          >
                              <div
                                  class="card-item-content-text-title"
                              >
                                  {{ $t('AccessConfig.index.764793-1') }}
                              </div>
                              <j-ellipsis
                                  style="width: calc(100% - 10px)"
                                  :lineClamp="2"
                              >
                                  <div>
                                      {{
                                          slotProps.protocolDetail
                                              .name
                                      }}
                                  </div>
                              </j-ellipsis>
                          </a-col>
                      </a-row>
                      <a-row class="card-item-content-description">
                          <a-col :span="24">
                              <j-ellipsis :lineClamp="2" style="width: calc(100% - 10px)">
                                  {{ getDescription(slotProps) }}
                              </j-ellipsis>
                          </a-col>
                      </a-row>
                  </div>
                </template>
                <template #actions="item">
                  <j-permission-button
                    :disabled="item.disabled"
                    :popConfirm="item.popConfirm"
                    :tooltip="{
                        ...item.tooltip,
                    }"
                    @click="item.onClick"
                    :hasPermission="`link/AccessConfig:${id === ':id' ? 'add' : 'update'}`"
                  >
                    <AIcon
                      type="DeleteOutlined"
                      v-if="item.key === 'delete'"
                    />
                    <template v-else>
                      <AIcon :type="item.icon" />
                      <span>{{ item?.text }}</span>
                    </template>
                  </j-permission-button>
                </template>
              </CardBox>
            </template>
          </j-pro-table>
        </j-scrollbar>
      </div>
      <div v-else class="steps-box" :style="`max-height:${
            clientHeight > 900 ? 850 : clientHeight * 0.7
          }px`">
        <a-row :gutter="[24, 24]">
          <a-col :span="12">
            <title-component :data="$t('Composite.index.636069-3')"></title-component>
            <a-form ref="formRef" :model="formData" layout="vertical">
              <a-form-item :label="$t('Composite.index.636069-4')" name="name"
                :rules="[
                  { required: true, message: $t('Composite.index.636069-5') },
                  { max: 64, message: $t('Composite.index.636069-6') },
                ]"
              >
                <a-input v-model:value="formData.name" :placeholder="$t('Composite.index.636069-5')"></a-input>
              </a-form-item>
              <a-form-item :label="$t('Composite.index.636069-7')">
                <a-textarea
                  v-model:value="formData.description"
                  showCount
                  :rows="4"
                  :maxlength="200"
                ></a-textarea>
              </a-form-item>
            </a-form>
          </a-col>
          <a-col :span="12">
            <j-scrollbar height="600">
              <div>
                <h1>{{ $t('Network.index.041705-12') }}</h1>
                <p>
                  {{ $t('Composite.index.636069-8') }}
                </p>
                <p>
                  {{ $t('Composite.index.636069-9') }}
                </p>
              </div>
              <div>
                <h1>{{ $t('Composite.index.636069-10') }}</h1>
                <CardBox
                  style="margin-bottom: 16px"
                  :showStatus="false"
                  v-for="slotProps in choosenProviderList"
                >
                  <template #img>
                    <img :src="device.deviceAccess" alt="">
                  </template>
                  <template #content>
                    <div class="card-item-content">
                        <j-ellipsis style="width: calc(100% - 100px)">
                            <span class="card-title">
                                {{ slotProps.name }}
                            </span>
                        </j-ellipsis>
                        <a-row class="card-item-content-box">
                            <a-col
                                :span="12"
                                v-if="slotProps.channelInfo"
                                class="card-item-content-text"
                            >
                                <j-ellipsis>
                                    <div
                                        class="card-item-content-text-title"
                                    >
                                        {{
                                            slotProps.channelInfo
                                                .name
                                        }}
                                    </div>
                                </j-ellipsis>
                                <j-ellipsis
                                  style="
                                    width: calc(100% - 10px);
                                    display: flex;
                                    margin-top: 4px;
                                  "
                                  v-if="slotProps.channelInfo.addresses"
                                >
                                    <a-badge
                                      :status="
                                          getStatus(slotProps)
                                      "
                                    />
                                    <span>
                                        {{
                                            slotProps.channelInfo
                                                .addresses[0]
                                                .address
                                        }}
                                    </span>
                                </j-ellipsis>
                            </a-col>
                            <a-col
                                :span="12"
                                v-if="slotProps.protocolDetail"
                                class="card-item-content-text"
                            >
                                <div
                                    class="card-item-content-text-title"
                                >
                                    {{ $t('AccessConfig.index.764793-1') }}
                                </div>
                                <j-ellipsis
                                    style="width: calc(100% - 10px)"
                                    :lineClamp="2"
                                >
                                    <div>
                                        {{
                                            slotProps.protocolDetail
                                                .name
                                        }}
                                    </div>
                                </j-ellipsis>
                            </a-col>
                        </a-row>
                        <a-row class="card-item-content-description">
                            <a-col :span="24">
                                <j-ellipsis :lineClamp="2" style="width: calc(100% - 10px)">
                                    {{ getDescription(slotProps) }}
                                </j-ellipsis>
                            </a-col>
                        </a-row>
                    </div>
                  </template>
                </CardBox>
              </div>
            </j-scrollbar>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="steps-action">
      <a-button v-if="stepCurrent === 0" type="primary" @click="handleNext">
        {{ $t('Network.index.041705-18') }}
      </a-button>
      <a-space v-else>
        <a-button @click="handleBack">
          {{ $t('Network.index.041705-16') }}
        </a-button>
        <j-permission-button
          :hasPermission="`link/AccessConfig:${id === ':id' ? 'add' : 'update'}`"
          type="primary"
          :loading="loading"
          @click="handleSave"
        >
          {{ $t('Composite.index.636069-11') }}
        </j-permission-button>
      </a-space>
    </div>
  </div>
  <ProviderListDrawer v-if="providerListVisible" :otherProvider="otherProvider" @close="closeDrawer" @save="handleAddProvider"/>
  <Outline v-if="outlineVisible" :data="current" @closeDrawer="outlineVisible = false"></Outline>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import ProviderListDrawer from './ProviderListDrawer.vue'
import { save, update, getCompositeProviderDetail } from '@device-manager-ui/api/link/accessConfig'
import { device } from '@device-manager-ui/assets'
import { onlyMessage } from '@jetlinks-web/utils';
import { randomString } from '@jetlinks-web/utils';
import { omit } from 'lodash-es';
import { useRequest } from '@jetlinks-web/hooks';
import Outline from '../../Outline/index.vue'
import { BackMap } from '../../data'
import { useI18n } from 'vue-i18n'
import { useTabSaveSuccess } from '@jetlinks-web-core/hooks'

const { t: $t } = useI18n()
const props = defineProps({
  otherProvider: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => ([])
  },
  data: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  }
})

const choosenProviderList = ref<Record<string, any>[]>([]);
const searchValue = ref();
const filterProviderList = computed(() => {
  return choosenProviderList.value?.filter((item: Record<string, any>) => {
    if(searchValue.value) {
      return item.name.includes(searchValue.value)
    }
    return true
  })
})
const route = useRoute();
const id = route.params.id as string;
const stepCurrent = ref(0);
const providerListVisible = ref(false);
const generateId = randomString(10)
const current = ref()
const outlineVisible = ref(false)

const formRef = ref()
const formData = reactive({
  id: route.params.id !== ':id' ? route.params.id : generateId,
  name: '',
  description: '',
})

const { onOpen } = useTabSaveSuccess('link/AccessConfig/Detail', {
  onSuccess(value) {
    choosenProviderList.value = choosenProviderList.value.map((item: Record<string, any>) => {
      if(item.id === value.id) {
        return value
      }
      return item
    })
  }
})

const { loading, run: saveRun } = useRequest(id === ':id' ? save : update,
  {
    immediate: false,
    onSuccess: () => {
      onlyMessage($t('Edge.geteway.598238-14'))
      history.back();
    }
  }
)

const getDescription = (slotProps: Record<string, any>) =>
  slotProps.description
    ? slotProps.description
    : props.otherProvider?.find(
        (item: Record<string, any>) => item.id === slotProps.provider,
      )?.description;

const getStatus = (slotProps: Record<string, any>) =>
  slotProps.channelInfo.addresses[0].health === -1 ? 'error' : 'processing';

const clientHeight = document.body.clientHeight;

const getActions = (item: any) => {
  return [
    {
      key: 'update',
      text: $t('Composite.index.636069-12'),
      tooltip: {
        title: $t('Composite.index.636069-12')
      },
      icon: 'EditOutlined',
      onClick: () => {
        const providerInfo = props.otherProvider?.find(
          (va: Record<string, any>) => va.id === item.provider,
        )

        onOpen({
          view: false,
          data: JSON.stringify(omit(item, ['channelInfo', 'protocolDetail', 'transportDetail'])),
          provider: JSON.stringify(providerInfo)
        }, {
          menuParams: {
            id: item.id,
          }
        })
      }
    },
    {
      key: 'delete',
      text: $t('Composite.index.636069-13'),
      tooltip: {
        title: $t('Composite.index.636069-13')
      },
      icon: 'DeleteOutlined',
      popConfirm: {
        title: $t('Composite.index.636069-14'),
        onConfirm: () => {
          choosenProviderList.value = choosenProviderList.value.filter((val: Record<string, any>) => val.id !== item.id)
          // console.log(item)
        }
      }
    }
  ]
}

const handleAccessItemDetail = (item: any) => {
  current.value = item
  outlineVisible.value = true
}

const handleNext = () => {
  if(!choosenProviderList.value?.length) {
    onlyMessage($t('Composite.index.636069-15'), 'warning')
    return
  }
  stepCurrent.value = 1;
}

const handleBack = () => {
  stepCurrent.value = 0;
}

const handleSearch = (value: string) => {
  searchValue.value = value
}

/**
 * 新增设备接入网关
 */
const handleAdd = () => {
  if(choosenProviderList.value?.length >= 10) {
    onlyMessage($t('Composite.index.636069-16'), 'warning')
    return
  }
  providerListVisible.value = true;
}

/**
 * 保存
 */
const handleSave = async () => {
  const valid = await formRef.value.validate()
  if(valid) {
    const params = {
      ...formData,
      provider: 'composite-device-gateway',
      channel: 'composite-device-gateway',
      channelId: formData.id,
      protocol: formData.id,
      transport: 'composite',
      configuration: {
        gateways: choosenProviderList.value.map(item => {
          return omit(item, ['channelInfo', 'protocolDetail', 'transportDetail'])
        })
      }
    }
    saveRun(params)
  }
}

const closeDrawer = () => {
  providerListVisible.value = false;
}

const handleAddProvider = (data: any) => {
  choosenProviderList.value?.unshift({
      id: data.id || randomString(8),
      ...data
  });
  providerListVisible.value = false;
}

//获取已选择的接入网关的详情
const getProviderDetail = async (data: any[]) => {
  const res = await getCompositeProviderDetail(data);
  if(res.success) {
    choosenProviderList.value = res.result
  }
}

watch(() => JSON.stringify(props.data), (val) => {
  if(val) {
    formData.name = props.data.name;
    formData.description = props.data.description;
    if(props.data.configuration?.gateways?.length) {
      getProviderDetail(props.data.configuration?.gateways)
    } else {
      choosenProviderList.value = []
    }
  }
}, {immediate: true})
</script>

<style scoped lang="less">
.steps-content {
  margin-top: 20px;
  .steps-box {
    min-height: 600px;
    .card-last {
      padding-right: 5px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .alert {
      height: 40px;
      padding-left: 10px;
      color: rgba(0, 0, 0, 0.55);
      line-height: 40px;
      background-color: #f6f6f6;
    }
    .search {
      display: flex;
      margin: 15px 0;
      justify-content: space-between;
    }
  }
}

.card-item-content {
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .card-title {
        font-size: 18px;
        font-weight: 800;
        line-height: 22px;
    }

    .card-item-content-box {
        .card-item-content-text-title {
            font-style: normal;
            font-weight: 400;
            font-size: 12px;
            color: rgba(0, 0, 0, 0.75);
            opacity: 0.75;
        }
    }
    .card-item-content-description {
        // font-style: normal;
        font-size: 12px;
        // line-height: 20px;
        color: #666666;
        // overflow: hidden; //超出的文本隐藏
        // text-overflow: ellipsis; //溢出用省略号显示
        // white-space: nowrap; //溢出不换行
    }
}

.steps-action {
  width: 100%;
  margin-top: 24px;
}

:deep(.jtable-body-spin) {
  padding: 0 !important;
}
</style>
