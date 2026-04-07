<template>
  <a-row :gutter="24">
    <a-col :span="12">
      <FormItemEditable
          label="配置类型"
          :name="['configuration', 'type']"
          :rules="[
              {required: true, message: '请选择配置类型'},
            ]"
          v-model:value="formData.configuration.type"
          :componentProps="{
            placeholder: $lang('MODBUS_TCP.collector.20250207-2'),
            options: [
              { label: '功能码+地址', value: 'function' },
              { label: 'PLC地址', value: 'plc' },
            ]
          }"
          type="select"
          @change="onTypeChange"
      />
    </a-col>
    <a-col :span="12" v-if="showFunc">
      <FormItemEditable
          :label="$lang('MODBUS_TCP.point.20250207-1')"
          :name="['configuration', 'function']"
          :rules="[
            {required: true, message: $lang('MODBUS_TCP.point.20250207-2')},
          ]"
          type="select"
          v-model:value="functionCode"
          :componentProps="{
            placeholder: $lang('MODBUS_TCP.point.20250207-2'),
            options
          }"
          @change="functionChange"
      >
      </FormItemEditable>
    </a-col>
    <a-col :span="12">
      <FormItemEditable
          :label="$lang('MODBUS_TCP.point.20250207-3')"
          :name="['configuration', 'parameter', 'address']"
          :rules="[
             {
                required: true,
                message: $lang('MODBUS_TCP.point.20250207-4'),
              },
              {
                validator: checkAddress,
                trigger: 'blur',
              },
          ]"
          type="number"
          v-model:value="address"
          :componentProps="{
            placeholder: $lang('MODBUS_TCP.point.20250207-4'),
            max: showFunc ? 255 : 49999,
            min: showFunc ? 0 : 1,
            precision: 0,
            controls: false
          }"
          @change="onAddressChange"
      >
      </FormItemEditable>
    </a-col>
    <a-col :span="12">
      <FormItemEditable
          :name="['configuration', 'parameter', 'quantity']"
          :rules="[
              {
                required: true,
                message: $lang('MODBUS_TCP.point.20250207-9')
              },
              {
                pattern: new RegExp(/^\d+$/),
                message: $lang('MODBUS_TCP.point.20250207-10')
              },
            ]"
          :label="$lang('MODBUS_TCP.point.20250207-8')"
          type="number"
          v-model:value="formData.configuration.parameter.quantity"
          :componentProps="{
            placeholder: $lang('MODBUS_TCP.point.20250207-9'),
            max: 65535,
            min: 0,
            precision: 0,
            controls: false
          }"
          @change="() => onChange()"
      >
      </FormItemEditable>
    </a-col>
  </a-row>
  <div v-if="showWriteByteConfig">
    <a-form-item
        style="
              display: flex;
              flex-direction: row;
              align-items: center;
              margin: 0;
          "
    >
      <a-form-item-rest>
        <span>{{ $lang('MODBUS_TCP.point.20250207-15') }}</span>
      </a-form-item-rest>
      <a-switch v-model:checked="writeByteConfig" style="margin-left: 20px" @change="onWriteChange"/>
    </a-form-item>
  </div>
  <a-row v-if="writeByteConfig">
    <a-col :span="12">
      <FormItemEditable
          :name="['configuration', 'parameter', 'writeByteCount']"
          :rules="[
      {
        required: writeByteConfig,
        message: $lang('MODBUS_TCP.point.20250207-16')
      },
    ]" :label="$lang('MODBUS_TCP.point.20250207-17')"
          type="select"
          v-model:value="formData.configuration.parameter.writeByteCount"
          :componentProps="{
            placeholder: $lang('MODBUS_TCP.point.20250207-2'),
            options: [
              { label: $lang('MODBUS_TCP.point.20250207-18'), value: true },
              { label: $lang('MODBUS_TCP.point.20250207-19'), value: false }
            ]
          }"
          @change="() => onChange()"
      >
      </FormItemEditable>
    </a-col>
    <a-col :span="12">
      <FormItemEditable
          :name="['configuration', 'parameter', 'byteCount']"
          :rules="[
            {
              required: writeByteConfig,
              message: $lang('MODBUS_TCP.point.20250207-20')
            },
          ]"
          :label="$lang('MODBUS_TCP.point.20250207-21')"
          type="string"
          v-model:value="formData.configuration.parameter.byteCount"
          :componentProps="{
            placeholder: $lang('MODBUS_TCP.point.20250207-20'),
          }"
          @change="() => onChange()"
      >
      </FormItemEditable>
    </a-col>
  </a-row>
</template>
<script setup>
import {useLocales} from '@hooks'
import {computed, inject, ref, watch} from "vue";
import { commandRequest } from 'request'

const {$lang} = useLocales('modbus_tcp')

const formData = inject('plugin-form', {})
const events = inject("plugin-detail-save-events");
const metadataEvents = inject('point-metadata-events')
const options = ref([])

if (!('configuration' in formData)) {
  formData.configuration = {
    type: 'function',
    function: undefined,
    parameter: {
      quantity: undefined,
      writeByteCount: undefined,
      byteCount: undefined,
      address: undefined,
    },
  }
}

if (!('parameter' in formData.configuration)) {
  formData.configuration.parameter = {
    quantity: undefined,
    writeByteCount: undefined,
    byteCount: undefined,
    address: undefined,
  }
}

if (!('type' in formData.configuration)) {
  formData.configuration.type = 'function'
}

const functionCode = ref(formData.configuration.function)
const address = ref()
const writeByteConfig = ref(false);

const showWriteByteConfig = computed(() => formData.configuration.function === 'HoldingRegisters')
const showFunc = computed(() => formData.configuration.type === 'function')

const onChange = () => {
  events?.onValueChange?.()
}

const onTypeChange = () => {
  functionCode.value = undefined
  address.value = undefined
  formData.configuration = {
    type: formData.configuration.type,
    function: undefined,
    parameter: {
      quantity: undefined,
      writeByteCount: undefined,
      byteCount: undefined,
      address: undefined,
    },
  }
  formData.managedConfiguration.byteLayout = undefined
  formData.managedConfiguration.codec = undefined
  formData.accessModes = undefined
  onChange()
}

const functionChange = () => {
  if (formData.configuration.type === 'function') {
    formData.configuration.function = functionCode.value
  }
  formData.managedConfiguration.byteLayout = undefined
  formData.managedConfiguration.codec = undefined
  formData.accessModes = undefined
  onChange()
};

function getAddressValue(configuration) {
  const { type, function: func, parameter } = configuration
  const paramAddress = Number(parameter.address)

  // type === 'function'，直接返回
  if (type === 'function') {
    return paramAddress
  }

  switch (func) {
    case 'Coils':
      return paramAddress + 1

    case 'DiscreteInputs':
      return paramAddress + 10001

    case 'InputRegisters':
      return paramAddress + 30001

    case 'HoldingRegisters':
      return paramAddress + 40001

    default:
      // 兜底，防止未知 function
      return paramAddress
  }
}

const onWriteChange = () => {
  // 为了校验,这里无法实时的校验,不知道为什么
  setTimeout(() => {
    if(!writeByteConfig.value) {
      formData.configuration.parameter.writeByteCount = undefined
      formData.configuration.parameter.byteCount = undefined
      onChange()
    }
  })
}


const onAddressChange = () => {
  if (formData.configuration.type === 'function') {
    formData.configuration.parameter.address = address.value
  } else {
    if (address.value >= 1 && address.value <= 9999) {
      formData.configuration.function = 'Coils'
      formData.configuration.parameter.address = address.value - 1
    } else if (address.value >= 10001 && address.value <= 19999) {
      formData.configuration.function = 'DiscreteInputs'
      formData.configuration.parameter.address = address.value - 10001
    } else if (address.value >= 30001 && address.value <= 39999) {
      formData.configuration.function = 'InputRegisters'
      formData.configuration.parameter.address = address.value - 30001
    } else if (address.value >= 40001 && address.value < 49999) {
      formData.configuration.function = 'HoldingRegisters'
      formData.configuration.parameter.address = address.value - 40001
    } else {
      formData.configuration.parameter.address = address.value
    }
  }
  onChange()
}

const getConfigMetadata = async () => {
  const resp = await commandRequest.pointConfigMetadata('modbus_tcp')
  if (resp.success) {
    resp.result.forEach(item => {
      if (item.id === 'function') {
        options.value = (item.valueType.elements || []).map(i => ({...i, label: i.text}))
      }
    })
  }
}
function checkAddress(_rule, value) {
  return new Promise(async (resolve, reject) => {
    if (address.value != null) {
      if (formData.configuration.type === 'plc') {
        const flag = address.value >= 1 && address.value <= 9999 || address.value >= 10001 && address.value <= 19999 || address.value >= 30001 && address.value <= 39999 || address.value >= 40001 && address.value <= 49999
        if (!flag) {
          return reject('非法地址');
        }
      }
      return resolve('');
    } else {
      return reject($lang('MODBUS_TCP.point.20250207-4'));
    }
  });
}

watch(
    () => writeByteConfig.value,
    (val) => {
      if (
          val && !formData.configuration.parameter.byteCount && formData.configuration.parameter.quantity
      ) {
        formData.configuration.parameter.byteCount = formData.configuration.parameter.quantity * 2;
      }
    },
    {
      immediate: true
    }
);

watch(
    () => formData.configuration.parameter?.byteCount,
    () => {
      if (formData.configuration.parameter?.byteCount) {
        writeByteConfig.value = true;
      }
    },
    {deep: true, immediate: true},
);

watch(() => [formData.configuration.function, formData.configuration.parameter.address, formData.configuration.parameter.quantity], ([val1, val2, val3]) => {
  if (val1 != null && val2 != null && val3 != null) {
    metadataEvents?.pointMetadataEvents?.(formData.provider, {configuration: formData.configuration})
  } else {
    metadataEvents?.pointMetadataEvents?.(formData.provider, false)
  }
  if(formData.configuration.parameter?.address !== null && formData.configuration.function){
    address.value = getAddressValue(formData.configuration)
  }
}, {
  immediate: true,
  deep: true
})

getConfigMetadata()
</script>
<style></style>
