<template>
  <a-row :gutter="24">
    <a-col :span="12">
      <a-form-item
          label="配置类型"
          :name="['configuration', 'type']"
          :rules="[
            {
              required: true,
              message: $lang('MODBUS_TCP.point.20250207-2')
            },
          ]"
      >
        <a-radio-group v-model:value="formData.configuration.type" @change="onTypeChange">
          <a-space>
            <a-radio-button value="function">功能码+地址</a-radio-button>
            <a-radio-button value="plc">PLC地址</a-radio-button>
          </a-space>
        </a-radio-group>
      </a-form-item>
    </a-col>
    <a-col :span="12" v-if="showFunc">
      <a-form-item
          :label="$lang('MODBUS_TCP.point.20250207-1')"
          :name="['configuration', 'function']"
          :rules="[
            {
              required: true,
              message: $lang('MODBUS_TCP.point.20250207-2')
            },
          ]"
      >
        <a-select
            style="width: 100%"
            v-model:value="functionCode"
            :options="options"
            :placeholder="$lang('MODBUS_TCP.point.20250207-2')"
            allowClear
            show-search
            :filter-option="filterOption"
            @change="onFunctionChange"
        />
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item
          :label="$lang('MODBUS_TCP.point.20250207-3')"
          :name="['configuration', 'parameter', 'address']"
          validate-first
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
      >
        <a-input-number
            v-model:value="address"
            :controls="false"
            :max="showFunc ? 255 : 49999"
            :min="showFunc ? 0 : 1"
            :precision="0"
            :placeholder="$lang('MODBUS_TCP.point.20250207-4')"
            style="width: 100%"
            @change="onAddressChange"
        />
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item
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
      >
        <a-input-number
            v-model:value="formData.configuration.parameter.quantity"
            :controls="false"
            :max="65535"
            :min="1"
            :precision="0"
            :placeholder="$lang('MODBUS_TCP.point.20250207-9')"
            style="width: 100%"
        />
      </a-form-item>
    </a-col>
    <template v-if="showWriteByteConfig">
      <a-col :span="24">
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
          <a-switch v-model:checked="writeByteConfig" style="margin-left: 20px"/>
        </a-form-item>
      </a-col>
      <template v-if="writeByteConfig">
        <a-col :span="12">
          <a-form-item :name="['configuration', 'parameter', 'writeByteCount']"
                       :rules="[
    {
      required: true,
      message: $lang('MODBUS_TCP.point.20250207-16')
    },
  ]" :label="$lang('MODBUS_TCP.point.20250207-17')">
            <a-radio-group v-model:value="formData.configuration.parameter.writeByteCount">
              <a-space>
                <a-radio-button :value="true">{{ $lang('MODBUS_TCP.point.20250207-18') }}</a-radio-button>
                <a-radio-button :value="false">{{ $lang('MODBUS_TCP.point.20250207-19') }}</a-radio-button>
              </a-space>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
              v-if="writeByteConfig"
              :name="['configuration', 'parameter', 'byteCount']"
              :rules="[
          {
            required: true,
            message: $lang('MODBUS_TCP.point.20250207-20')
          },
        ]"
              :label="$lang('MODBUS_TCP.point.20250207-21')"
          >
            <a-input
                :placeholder="$lang('MODBUS_TCP.point.20250207-20')"
                v-model:value="formData.configuration.parameter.byteCount"/>
          </a-form-item>
        </a-col>
      </template>
    </template>
  </a-row>
</template>
<script setup>
import {computed, inject, ref, watch} from 'vue'
import {useLocales} from '@hooks'
import { commandRequest } from 'request'

const {$lang} = useLocales('modbus_tcp')
const formData = inject('plugin-form', {
  configuration: {
    type: 'function',
    function: undefined,
    parameter: {
      quantity: undefined,
      writeByteCount: undefined,
      byteCount: undefined,
      address: undefined,
    }
  }
})

const options = ref([])

const events = inject('point-metadata-events')

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

const writeByteConfig = ref(false);
const functionCode = ref(formData.configuration.function)
const address = ref(formData.configuration.parameter?.address)


const filterOption = (input, option) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

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

const showWriteByteConfig = computed(() => formData.configuration.function === 'HoldingRegisters' && formData.configuration.type === 'function')

const showFunc = computed(() => formData.configuration.type === 'function')

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
}
const onFunctionChange = () => {
  if (formData.configuration.type === 'function') {
    formData.configuration.function = functionCode.value
  }
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
    formData.managedConfiguration.byteLayout = undefined
    formData.managedConfiguration.codec = undefined
    formData.accessModes = undefined
  }
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
    events?.pointMetadataEvents?.(formData.provider, {configuration: formData.configuration})
  } else {
    events?.pointMetadataEvents?.(formData.provider, false)
  }
}, {
  immediate: true,
  deep: true
})

getConfigMetadata()
</script>
<style></style>
