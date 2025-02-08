<template>
  <a-form-item :name="['configuration', 'host']" :rules="[
    {
      required: true,
      message: $lang('MODBUS_TCP.channel.20250207-3')
    },
    {
      validator: checkHost,
      trigger: 'blur',
    },
  ]"
  >
    <template #label>
      {{ $lang('MODBUS_TCP.channel.20250207-1') }}
      <a-tooltip :title="$lang('MODBUS_TCP.channel.20250207-2')">
        <AIcon type="QuestionCircleOutlined" style="margin-left: 2px"/>
      </a-tooltip>
    </template>
    <a-input
        :placeholder="$lang('MODBUS_TCP.channel.20250207-3')"
        v-model:value="formData.configuration.host"
    />
  </a-form-item>
  <a-form-item
      :label="$lang('MODBUS_TCP.channel.20250207-4')"
      :name="['configuration', 'port']"
      :rules="[
    {
      required: true,
      message: $lang('MODBUS_TCP.channel.20250207-5')
    },
    {
      pattern: new RegExp(/^\d+$/),
      message: $lang('MODBUS_TCP.channel.20250207-7')
    },
  ]"
  >
    <a-input-number
        style="width: 100%"
        :placeholder="$lang('MODBUS_TCP.channel.20250207-5')"
        v-model:value="formData.configuration.port"
        :min="0"
        :max="65535"
    />
  </a-form-item>
</template>
<script setup>
import {inject} from "vue";
import {useLocales} from '@hooks'

const {$lang} = useLocales('MODBUS_TCP')
const formData = inject("plugin-form");

if (!("configuration" in formData)) {
  delete formData.configuration.connect
} else {
  delete formData.configuration.connect
}

const regIP = new RegExp(
    /^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/,
);
const regIPv6 = new RegExp(
    /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
);
const regDomain = new RegExp(
    /([0-9a-z-]{2,}\.[0-9a-z-]{2,3}\.[0-9a-z-]{2,3}|[0-9a-z-]{2,}\.[0-9a-z-]{2,3})$/i,
);

const checkHost = (_rule, value) =>
    new Promise(async (resolve, reject) => {
      if (!value) return resolve("");
      if (!(regIP.test(value) || regIPv6.test(value) || regDomain.test(value))) {
        return reject($lang('MODBUS_TCP.channel.20250207-6'));
      }
      return resolve("");
    });
</script>
<style></style>
