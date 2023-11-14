<template lang="">
    <j-modal
        :title="data.id ? '编辑' : '新增'"
        :visible="true"
        width="700px"
        @cancel="handleCancel"
    >
        <j-form
            class="form"
            layout="vertical"
            :model="formData"
            name="basic"
            autocomplete="off"
            ref="formRef"
        >
            <j-form-item
                label="所属通道"
                name="channelId"
                :rules="LeftTreeRules.channelId"
            >
                <j-select
                    style="width: 100%"
                    v-model:value="formData.channelId"
                    :options="channelList"
                    placeholder="请选择所属通道"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                    :disabled="!!id"
                    @select="channelSelect"
                />
            </j-form-item>
            <j-form-item
                label="采集器名称"
                name="name"
                :rules="LeftTreeRules.name"
            >
                <j-input
                    placeholder="请输入采集器名称"
                    v-model:value="formData.name"
                />
              
            </j-form-item>
            <j-form-item  v-if="provider === 'snap7'" label="IP" :name="['configuration', 'host']" :rules="LeftTreeRules.host" >
              <j-input v-model:value="formData.configuration.host" autocomplete="off" placeholder="请输入通道IP" :disabled="false"/>
            </j-form-item>
            <j-form-item v-if="provider === 'snap7'" label="端口" :name="['configuration', 'port']" :rules="LeftTreeRules.port">
              <j-input-number style="width: 100%" v-model:value="formData.configuration.port" autocomplete="off" placeholder="请输入通道端口"/>
            </j-form-item>
            <j-form-item v-if="provider === 'snap7'" label="机架号" :name="['configuration', 'rack']" :rules="LeftTreeRules.rack">
              <j-input-number style="width: 100%" v-model:value="formData.configuration.rack" autocomplete="off" placeholder="请输入机架号" :maxlength="64" />
            </j-form-item>
            <j-form-item v-if="provider === 'snap7'" label="型号" :name="['configuration', 'type']" :rules="LeftTreeRules.type">
              <j-select v-model:value="formData.configuration.type" placeholder="请选择型号" @change="typeChange">
                <j-select-option v-for="item in typeOptions" :key="item.value" :value="item.value">{{ item.label }}</j-select-option>
              </j-select>
            </j-form-item>
            <j-form-item v-if="provider === 'snap7'" label="槽位" :name="['configuration', 'slot']" :rules="LeftTreeRules.slot">
              <j-input-number style="width: 100%" v-model:value="formData.configuration.slot" autocomplete="off" placeholder="请输入槽位" :maxlength="64" :disabled="formData.configuration.type == 'S200' || formData.configuration.type == 'S1200'"/>
            </j-form-item>
            <j-form-item v-if="provider === 'snap7'" label="超时时间（毫秒）" :name="['configuration', 'timeout']" :rules="LeftTreeRules.timeout">
              <j-input-number style="width: 100%" v-model:value="formData.configuration.timeout" autocomplete="off" placeholder="请输入超时时间" :maxlength="64" />
            </j-form-item>
            <j-form-item v-if="provider === 'snap7'" label="数据读取方式" :name="['configuration', 'serializable']">
              <j-radio-group v-model:value="formData.configuration.serializable">
                <j-radio-button :value="false">并行</j-radio-button>
                <j-radio-button :value="true">串行</j-radio-button>
              </j-radio-group>
            </j-form-item>
            <j-form-item
                v-if="provider === 'COLLECTOR_GATEWAY'"
                label="通讯协议"
                :name="['collectorProvider']"
                :rules="[{ required: true, message: '请选择通讯协议' }]"
            >
              <j-select
                  style="width: 100%"
                  v-model:value="formData.collectorProvider"
                  :options="providerListItems"
                  placeholder="请选择通讯协议"
                  allowClear
                  show-search
                  :filter-option="filterOption"
                  :disabled="!!id"
              />
            </j-form-item>
            <j-form-item
                v-if="visibleUnitId"
                :name="['configuration', 'unitId']"
                :rules="LeftTreeRules.unitId"
                label="从机地址"
            >
              <j-input-number
                  style="width: 100%"
                  placeholder="请输入从机地址"
                  v-model:value="formData.configuration.unitId"
                  :min="0"
                  :max="255"
              />
            </j-form-item>
            <j-form-item
                v-if="provider !== 'COLLECTOR_GATEWAY'"
                :name="['configuration', 'inheritBreakerSpec', 'type']"
                :rules="LeftTreeRules.type"
                label="点位熔断处理"
            >
              <j-card-select
                  :showImage="false"
                  v-model:value="formData.configuration.inheritBreakerSpec.type"
                  :options="[
                                      { label: '降频', value: 'LowerFrequency' },
                                      { label: '断开', value: 'Break' },
                                      { label: '忽略', value: 'Ignore' },
                                  ]"
                  @change="changeCardSelectType"
              />
            </j-form-item>
            <p style="color: #616161" v-if="provider !== 'COLLECTOR_GATEWAY'">
              {{ getTypeTooltip(formData.configuration.inheritBreakerSpec.type) }}
            </p>
            <j-form-item
                v-if="visibleEndian"
                :name="['configuration', 'endian']"
                :rules="LeftTreeRules.endian"
                label="双字高低位切换"
            >
            <j-card-select
                :showImage="false"
                v-model:value="formData.configuration.endian"
                :options="[
                                    { label: 'AB', value: 'BIG' },
                                    { label: 'BA', value: 'LITTLE' },
                                ]"
                @change="changeCardSelectEndian"
                :column="2"
            />
            </j-form-item>
            <j-form-item
                v-if="visibleEndian"
                :name="['configuration', 'endianIn']"
                :rules="LeftTreeRules.endianIn"
                label="单字高低位切换"
            >
            <j-card-select
                :showImage="false"
                v-model:value="formData.configuration.endianIn"
                :options="[
                                    { label: 'AB', value: 'BIG' },
                                    { label: 'BA', value: 'LITTLE' },
                                ]"
                @change="changeCardSelectEndianIn"
                :column="2"
            />
            </j-form-item>
            <div v-if="visibleEndian" style="color: #616161">
            <p>当前内存布局: {{ endianData }}</p>
            <p>
              只有4字节数据类型(int32、ieee754 float)
              具有4种内存布局，其它只有ABCD、DCBA两种内存布局(以双字配置为准)
            </p>
            </div>
            <j-form-item
                v-if="provider !== 'snap7'"
                :name="['configuration', 'requestTimeout']"
                :rules="LeftTreeRules.requestTimeout"
            >
                <j-input-number
                    style="width: 100%"
                    placeholder="请输入请求超时时间配置"
                    v-model:value="formData.configuration.requestTimeout"
                    addon-after="ms"
                    :max="60000"
                    :min="2000"
                />
            </j-form-item>
            <j-form-item label="说明" name="description">
                <j-textarea
                    placeholder="请输入说明"
                    v-model:value="formData.description"
                    :maxlength="200"
                    :rows="3"
                    showCount
                />
            </j-form-item>
        </j-form>
        <template #footer>
            <j-button key="back" @click="handleCancel">取消</j-button>
            <PermissionButton
                key="submit"
                type="primary"
                :loading="loading"
                @click="handleOk"
                style="margin-left: 8px"
                :hasPermission="`DataCollect/Collector:${
                    id ? 'update' : 'add'
                }`"
            >
                确认
            </PermissionButton>
        </template>
    </j-modal>
</template>
<script lang="ts" name="CollectorTreeSave" setup>
import { save, update, getProviders } from '@/api/data-collect/collector';
import { LeftTreeRules } from '../../data';
import type { FormInstance } from 'ant-design-vue';
import {cloneDeep, omit} from "lodash-es";
import {protocolList} from "@/utils/consts";

const loading = ref(false);
const visibleEndian = ref(false);
const visibleUnitId = ref(false);

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
    channelListAll: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['change']);

const typeOptions = ref([
  {value: 'S200', label: 'S7-200'},
  {value: 'S300', label: 'S7-300'},
  {value: 'S400', label: 'S7-400'},
  {value: 'S1200', label: 'S7-1200'},
  {value: 'S1500', label: 'S7-1500'},
])

const id = props.data.id;
const formRef = ref<FormInstance>();
const provider = ref()
const providerListItems = ref()

const geyProviderList = async () => {
  const resp: any = await getProviders();
  if (resp.success) {
    providerListItems.value = resp.result.map((item: any) => ({ label: item.name, value: item.id }))
  } else {
    providerListItems.value = []
  }
}

const _channelListAll = computed(() => {
    return props.channelListAll || [];
})

const channelList = computed(() => {
  const  list:any = [];
  _channelListAll.value.forEach((item: any) => {
    if(item?.state?.value !== 'disabled'){
      list.push({
        provider: item.provider,
        value: item.id,
        label: item.name,
    })
    }
  });
  return list
})

const channelSelect = (key: string, detail: any) => {
  console.log(detail)
  provider.value = detail.provider
}

const endianData = computed(() => {
    const { endian, endianIn } = formData.value.configuration;
    if (endian) {
        if (endianIn) {
            if (endian === 'BIG') {
                return endianIn === 'BIG' ? 'ABCD' : 'BADC';
            } else {
                return endianIn === 'BIG' ? 'CDAB' : 'DCBA';
            }
        } else {
            return endian === 'BIG' ? 'ABCD' : 'DCBA';
        }
    }
});

const formData = ref<any>({
    channelId: undefined,
    name: '',
    collectorProvider: undefined,
    configuration: {
        unitId: '',
        type: undefined,
        endian: 'BIG',
        endianIn: 'BIG',
        requestTimeout: 2000,
        serializable:false,
        inheritBreakerSpec: {
          type: 'LowerFrequency',
        }
    },
    circuitBreaker: {
        // type: 'LowerFrequency',
      type: 'Ignore'
    },
    description: '',
});

const handleOk = async () => {
    const _data: any = await formRef.value?.validate();

    if (_data) {
      const { name } = _channelListAll.value.find(
          (item: any) => item.id === formData.value.channelId,
      );

      let _copyData = _data

      if (['COLLECTOR_GATEWAY'].includes(provider.value)) {
        const copyData = cloneDeep(_data)
        _copyData = omit(copyData, ['configuration', 'collectorProvider'])

        _copyData.configuration = {
          configuration: {
            ..._data.configuration,
            inheritBreakerSpec: {
              type: 'Ignore'
            }
          },
          collectorProvider: _data.collectorProvider
        }
      }

      const params = {
        ..._copyData,
        provider: provider.value,
        channelName: name,
        circuitBreaker: {
          type: 'Ignore'
        }
      };

      loading.value = true;

      try {
        const response = !id
            ? await save(params)
            : await update(id, { ...props.data, ...params })
        loading.value = false;
        if (response.success) {
          emit('change', true);
        }
      } catch (e) {
        loading.value = false;
      }
    }
};

const getTypeTooltip = (value: string) => {
  switch (value) {
    case 'LowerFrequency': return '连续20次采集异常后，降低采集频率至设定频率的1/10，故障处理后，采集频率将恢复至设定频率。';
    // case 'Break': return '连续10分钟异常，停止采集数据进入断开状态，设备重新启用后恢复采集状态。'
    case 'Break': return '连续20次采集异常后，降低采集频率至设定频率的1/10，10分钟内未排除故障，将停止采集。'
    case 'Ignore': return '忽略异常，保持设定采集频率。';
    default: return '';
  }
}

const handleCancel = () => {
    emit('change', false);
};

const changeCardSelectType = (value: Array<string>) => {
  formData.value.configuration.inheritBreakerSpec.type = value[0];
};
const changeCardSelectEndian = (value: Array<string>) => {
    formData.value.configuration.endian = value[0];
};
const changeCardSelectEndianIn = (value: Array<string>) => {
    formData.value.configuration.endianIn = value[0];
};

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const typeChange = (val:any)=>{
  if(val == 'S200' || val == 'S1200') {
    formData.value.configuration.slot = 1
  }
}

watch(
    () => formData.value.channelId,
    (value) => {
        const dt:any = _channelListAll.value.find((item:any) => item.id === value);
        visibleUnitId.value = visibleEndian.value =
            dt?.provider && ['MODBUS_TCP', 'COLLECTOR_GATEWAY'].includes(dt?.provider);
    },
    { deep: true },
);

watch(
    () => props.data,
    (value) => {
        if (value.id) {
          let copyValue = cloneDeep(value)
          if (!copyValue?.configuration?.inheritBreakerSpec && copyValue.provider !== 'COLLECTOR_GATEWAY') {
            copyValue.configuration = {
              ...copyValue.configuration,
              inheritBreakerSpec: {
                type: value.circuitBreaker?.type
              }
            }
            copyValue.circuitBreaker.type = 'Ignore'
          }

          if (copyValue.provider === 'COLLECTOR_GATEWAY') {
            formData.value = {
              ...omit(copyValue, ['configuration']),
              ...copyValue.configuration,
            }
          } else {
            formData.value = copyValue
          }

          provider.value = copyValue?.provider
        };
    },
    { immediate: true, deep: true },
);

watchEffect(() => {
  if (provider.value === 'COLLECTOR_GATEWAY') {
    geyProviderList()
  }
})

</script>

<style lang="less" scoped>
.form {
    .form-radio-button {
        width: 148px;
        height: 80px;
        padding: 0;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .form-upload-button {
        margin-top: 10px;
    }
    .form-submit {
        background-color: @primary-color !important;
    }
}
</style>
