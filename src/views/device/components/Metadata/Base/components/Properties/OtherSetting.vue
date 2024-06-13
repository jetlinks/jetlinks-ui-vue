<template>
    <PopoverModal
        v-if="!disabled"
        v-model:visible="modalVisible"
        body-style="padding-top:4px;width:600px;"
        placement="bottomRight"
        :disabled="disabled"
        @ok="confirm"
        @cancel="cancel"
    >
        <template #content>

            <j-scrollbar height="350" v-if="showMetrics || config.length > 0">
                <j-collapse v-model:activeKey="activeKey" v-if="visible">
                    <j-collapse-panel
                        v-if="!(props.isProduct && target === 'device')"
                        v-for="(item, index) in config"
                        :key="'store_' + index"
                    >
                      <template #header>
                        {{ item.name }}
                        <j-tooltip
                          v-if="item.description"
                          :title="item.description"
                        >
                          <AIcon
                            type="ExclamationCircleOutlined"
                            style="padding-left: 12px; padding-top: 4px"
                          />
                        </j-tooltip>
                      </template>
                        <j-table
                            :columns="columns"
                            :data-source="item.properties"
                            :pagination="false"
                            rowKey="id"
                        >
                            <template #bodyCell="{ column, record, index }">
                                <template v-if="column.dataIndex === 'type'">{{
                                    record.type?.name
                                }}</template>
                                <value-item
                                    v-else-if="column.dataIndex === 'value'"
                                    v-model:modelValue="
                                        configValue[record.property]
                                    "
                                    :itemType="
                                        item.properties[index].type?.type
                                    "
                                    :extra="{
                                      dropdownStyle: {
                                        zIndex: 1071
                                      },
                                      popupStyle: {
                                        zIndex: 1071
                                      }
                                    }"
                                    :getPopupContainer="(node) => tableWrapperRef || node"
                                    :options="(item.properties[index].type?.elements || []).map((a) => ({
                                           label: a.text,
                                           value: a.value,
                                    }))"
                                />
                            </template>
                        </j-table>
                    </j-collapse-panel>
                    <j-collapse-panel key="metrics" v-if="showMetrics && !(props.isProduct && target === 'device')">
                        <template #header>
                            指标配置
                            <j-tooltip
                                title="场景联动页面可引用指标配置作为触发条件"
                            >
                                <AIcon
                                    type="ExclamationCircleOutlined"
                                    style="padding-left: 12px; padding-top: 4px"
                                />
                            </j-tooltip>
                        </template>
                        <Metrics
                            ref="metricsRef"
                            :options="booleanOptions"
                            :type="props.type"
                            :value="myValue.metrics"
                        />
                    </j-collapse-panel>
                    <j-collapse-panel key="extra" v-if="showExtra">
                      <template #header>
                        <a-space>
                          <div>
                            拓展配置
                          </div>

                          <a-button v-if="props.isProduct && target === 'device'" type="link" style="padding: 0 4px;height: 22px;" @click="thresholdRest">
                            <template #icon>
                              <AIcon type="RedoOutlined"/>
                            </template>
                            重置
                          </a-button>
                        </a-space>
                      </template>
                      <div class="extra-limit extra-check-group">
                        <div class="extra-title">阈值限制</div>
                        <CardSelect
                          v-model:value="extraForm.type"
                          :options="[
                            { label: '下限', value: 'lower'},
                            { label: '上限', value: 'upper'}
                          ]"
                          :showImage="false"
                          :multiple="true"
                          @select="limitSelect"
                        />
                      </div>
                      <div class="extra-limit-input" v-if="extraForm.type.length !== 0">
                        <div class="extra-title">阈值</div>
                        <a-space>
                          <a-input-number v-if="extraForm.type.includes('lower')" v-model:value="extraForm.lowerLimit" style="width: 178px" placeholder="请输入下限"/>
                          <span v-if="extraForm.type.length === 2">~</span>
                          <a-input-number v-if="extraForm.type.includes('upper')" v-model:value="extraForm.upperLimit" style="width: 178px" placeholder="请输入上限"/>
                        </a-space>
                      </div>
                      <div class="extra-handle extra-check-group" v-if="extraForm.type.length !== 0">
                        <div class="extra-title">超出阈值数据处理方式</div>
                        <CardSelect
                          v-model:value="extraForm.mode"
                          :options="[
                            { label: '忽略', value: 'ignore'},
                            { label: '仅记录', value: 'record'},
                            { label: '记录并发送告警', value: 'alarm'},
                          ]"
                          :showImage="false"
                        />
                        <div style="margin: 8px 0">
                          {{ handleTip }}
                        </div>
                      </div>
                    </j-collapse-panel>
                </j-collapse>
            </j-scrollbar>
            <div v-else style="padding-top: 24px">
                <j-empty description="没有动态配置项" />
            </div>
        </template>
        <PermissionButton
            key="setting"
            :disabled="disabled"
            :has-permission="hasPermission"
            :tooltip="tooltip"
            style="padding-left: 0"
            type="link"
        >
            <AIcon type="SettingOutlined" />
            配置
        </PermissionButton>
    </PopoverModal>
    <PermissionButton
        v-else
        key="setting"
        :disabled="disabled"
        :has-permission="hasPermission"
        :tooltip="tooltip"
        style="padding-left: 0"
        type="link"
    >
        <AIcon type="SettingOutlined" />
        配置
    </PermissionButton>
</template>

<script setup lang="ts" name="OtherSetting">
import Metrics from './Metrics/Metrics.vue';
import { watch } from 'vue';
import { useProductStore } from 'store/product';
import { useInstanceStore } from 'store/instance';
import {
    getMetadataConfig,
    getMetadataDeviceConfig,
} from '@/api/device/product';
import {omit, cloneDeep} from 'lodash-es';
import { PopoverModal } from '@/components/Metadata/Table'
import {useTableWrapper} from "@/components/Metadata/Table/utils";
import { useThreshold } from './hooks'

const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
    type: {
        type: String,
        default: undefined,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    id: {
        type: String,
        default: undefined,
    },
    name: {
      type: String,
      default: undefined,
    },
    record: {
        type: Object,
        default: () => ({}),
    },
    hasPermission: String,
    tooltip: Object,
    metadataType: {
      type: String,
      default: 'properties'
    },
    target: String,
    isProduct: {
      type: Boolean,
      default: false
    }
});


const type = inject('_metadataType');

const productStore = useProductStore();
const deviceStore = useInstanceStore();
const tableWrapperRef = useTableWrapper()

const { thresholdUpdate, thresholdRest, thresholdDetail, thresholdDetailQuery } = useThreshold(props)

const emit = defineEmits(['update:value', 'change']);

const activeKey = ref();
const metricsRef = ref();

const myValue = ref(props.value);
const visible = ref(false);
const modalVisible = ref(false);

const config = ref<any>([]);
const configValue = ref(props.value?.expands);

const extraForm = reactive({
  upperLimit: 0,
  lowerLimit: 0,
  mode: 'ignore',
  type: ['upper', 'lower']
})

const typeMap = {
  'properties': 'property',
  'functions': 'function',
  'events': 'event',
  'tags': 'tag',
}

const handleTip = computed(() => {
  if (extraForm.mode === 'ignore') {
    return '平台将忽略超出阈值的数据，无法查看上报记录'
  } else if (extraForm.mode === 'record') {
    return '您可以在告警记录-无效数据页面查看超出阈值的数据上报记录'
  }
  return '您可以在设备详情-告警记录 页面查看告警情况'
})

const showMetrics = computed(() => {
    return [
        'int',
        'long',
        'float',
        'double',
        'string',
        'boolean',
        'date',
    ].includes(props.type as any);
});

const showExtra = computed(() => {
  return [
    'int',
    'long',
    'float',
    'double',
  ].includes(props.type as any) && props.metadataType === 'properties'
})

const booleanOptions = ref([
    { label: '否', value: 'false' },
    { label: '是', value: 'true' },
]);

const columns = ref([
    {
        title: '参数名称',
        dataIndex: 'name',
        width: 150,
        ellipsis: true,
    },
    {
        title: '输入类型',
        dataIndex: 'type',
        width: 150,
    },
    {
        title: '值',
        dataIndex: 'value',
    },
]);

const limitSelect = (keys: string[], key: string, isSelected: boolean) => {
  if (!isSelected) { // 删除
    if (key === 'upper') {
      extraForm.upperLimit = 0
    } else {
      extraForm.lowerLimit = 0
    }
  }

  if (keys.length === 0) {
    extraForm.mode = 'ignore'
  }
}

const getConfig = async () => {
    const id =
        type === 'product' ? productStore.current?.id : deviceStore.current.id;

    if (!props.id || !id || !props.type) return;

    if (props.type === 'boolean') {
        const booleanValue = props.record.valueType;
        booleanOptions.value[0] = {
            label: booleanValue.falseText || '否',
            value: booleanValue.falseValue || 'false',
        };
        booleanOptions.value[1] = {
            label: booleanValue.trueText || '是',
            value: booleanValue.trueValue || 'true',
        };
    }

    const params: any = {
        deviceId: id,
        metadata: {
            id: props.id,
            type: typeMap[props.metadataType],
            dataType: props.type,
        },
    };

    const resp =
        type === 'product'
            ? await getMetadataConfig(params)
            : await getMetadataDeviceConfig(params);
    if (resp.status === 200) {
        config.value = resp.result;
        if (resp.result.length) {
            activeKey.value = ['store_0'];
        } else if (showMetrics.value) {
            activeKey.value = ['metrics'];
        }

        if (resp.result.length && !configValue.value) {
            resp.result.forEach((a) => {
                if (a.properties) {
                    a.properties.forEach((b) => {
                        configValue.value[b.property] = undefined;
                    });
                }
            });
        }
    }
    visible.value = true
};

const confirm = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let metrics: any;
            metrics = await metricsRef.value?.getData();

            const expands = {
                ...(configValue.value || {}),
            };

            if (metrics) {
                expands.metrics = metrics;
            }

            if (showExtra.value) {
              // expands.threshold = extraForm
              await thresholdUpdate(extraForm)
            }

            emit('update:value', {
                ...props.value,
                ...expands,
            });
            emit('change')
            modalVisible.value = false
            resolve(true);
        } catch (err) {
            reject(false);
        }
    });
};

watch(() => modalVisible.value, () => {
  if (modalVisible.value) {
    configValue.value = omit(props.value, [
      'source',
      'type',
      'metrics',
      'required',
    ]);
    getConfig()

    if (showExtra.value) {
      thresholdDetailQuery()
    }
  }
}, { immediate: true })

const cancel = () => {
    myValue.value = cloneDeep(props.value);
};

watch(() => thresholdDetail, () => {
  if (thresholdDetail.value) {
    extraForm.mode = thresholdDetail.value?.mode
    extraForm.type = thresholdDetail.value?.type || []
    extraForm.lowerLimit = thresholdDetail.value?.lowerLimit
    extraForm.upperLimit = thresholdDetail.value?.upperLimit
  }
}, { immediate: true, deep: true })

watch(
    () => JSON.stringify(props.value),
    () => {
        myValue.value = cloneDeep(props.value);

        // if (props.value.threshold) {
        //   const threshold = props.value.threshold
        //   extraForm.handle = threshold.handle
        //   extraForm.type = threshold.type
        //   extraForm.lowerLimit = threshold.lowerLimit
        //   extraForm.upperLimit = threshold.upperLimit
        // }
    },
    { immediate: true },
);
</script>

<style scoped lang="less">
.extra-tip {
  padding: 8px;
  background-color: rgba(#000, .05);
}

.extra-title {
  font-size: 16px;
  margin: 12px 0;
}

.extra-check-group {
  :deep(.j-card-item) {
    padding: 12px 14px !important;
  }
}
</style>
