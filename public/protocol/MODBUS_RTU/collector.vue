<template>
  <a-form-item
      :label="$lang('MODBUS_RTU.collector.20250207-1')"
      :name="['configuration', 'unitId']"
      :rules="[
    {required: true, message: $lang('MODBUS_RTU.collector.20250207-2'), trigger: 'blur'},
    {
      pattern: new RegExp(/^\d+$/),
      message: $lang('MODBUS_RTU.collector.20250207-9'),
    },
  ]"
  >
    <a-input-number
        style="width: 100%" v-model:value="formData.configuration.unitId"
        :placeholder="$lang('MODBUS_RTU.collector.20250207-2')"
        :min="0"
        :max="255" :maxlength="64"
    />
  </a-form-item>
  <a-form-item
      :name="['configuration', 'endian']"
      :rules="[
    {required: true, message: $lang('MODBUS_RTU.collector.20250207-10'), trigger: 'blur'},
  ]"
      :label="$lang('MODBUS_RTU.collector.20250207-3')"
  >
    <j-card-select :showImage="false" v-model:value="formData.configuration.endian" :options="options" :column="2"/>
  </a-form-item>
  <a-form-item
      :name="['configuration', 'endianIn']"
      :rules="[
    {required: true, message: $lang('MODBUS_RTU.collector.20250207-11'), trigger: 'blur'},
  ]"
      :label="$lang('MODBUS_RTU.collector.20250207-4')"
  >
    <j-card-select :showImage="false" v-model:value="formData.configuration.endianIn" :options="options" :column="2"/>
  </a-form-item>
  <div style="color: #616161">
    <p>{{ $lang('MODBUS_RTU.collector.20250207-5') }}: {{ endianData }}</p>
    <p>
      {{ $lang('MODBUS_RTU.collector.20250207-6') }}
      {{ $lang('MODBUS_RTU.collector.20250207-7') }}
    </p>
  </div>
</template>

<script setup>
import {inject, computed} from "vue";
import {useLocales} from '@hooks'

const {$lang} = useLocales('MODBUS_RTU')
const formData = inject("plugin-form");
if (!('configuration' in formData)) {

  formData.configuration = {
    unitId: undefined,
    endian: 'BIG',
    endianIn: 'BIG',
    port: undefined,
    host: undefined,
  }
}

const options = [
  {label: 'AB', value: 'BIG'},
  {label: 'BA', value: 'LITTLE'},
]

const endianData = computed(() => {
  const {endian, endianIn} = formData.configuration || {};
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

</script>

<style scoped>
</style>
