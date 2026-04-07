<script setup name="Device">
import {typeIconMap} from "@rule-engine-manager-ui/views/Scene/Save/action/ListItem/util";
import {isBoolean} from "lodash-es";
import {useI18n} from "vue-i18n";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
})
const {t: $t} = useI18n();
const icon = computed(() => typeIconMap[props.data?.device?.message?.messageType || 'INVOKE_FUNCTION'])
</script>

<template>
    <div v-if="['fixed', 'context'].includes(data?.device?.selector)" style="display: flex; align-items: center">
      <AIcon :type="icon" />
      <span style="padding-left: 4px">{{
          data?.options?.type
        }}</span>
      <AIcon type="icon-mubiao" style="padding: 0 4px" />
      <j-ellipsis style="max-width: 200px; margin-right: 12px">
        {{ Array.isArray(data?.options?.name) ? data?.options?.name?.join(',') : data?.options?.name }}
      </j-ellipsis>
      <j-ellipsis style="max-width: 400px">
        {{ data?.options?.propertiesName }}
      </j-ellipsis>
      <span
        v-if="!isBoolean(data?.options?.propertiesValue) && data?.options?.propertiesValue"
      >{{ $t('ListItem.Item.637563-12') }}
                  </span>
      <j-ellipsis style="max-width: 200px">
        {{
          `${
            (
              isBoolean(data?.options?.propertiesValue)
                ? true
                : data?.options?.propertiesValue
            )
              ? `${data?.options?.propertiesValue}`
              : ""
          }`
        }}
      </j-ellipsis>
    </div>
    <div v-else-if="data?.device?.selector === 'tag'">
      <j-ellipsis>
        <AIcon :type="icon" />
        {{ data?.options?.type }}
        <span>{{ data?.options?.tagName }}</span>
        {{ $t('ListItem.Item.637563-13') }}{{ data?.options?.productName }}
        {{ data?.options?.propertiesName }}
        <span v-if="data?.options?.propertiesValue">
          {{ $t('ListItem.Item.637563-12')}}
        </span>
        {{ data?.options?.propertiesValue }}
      </j-ellipsis>
    </div>
    <div v-else-if="data?.device?.selector === 'relation'">
      <j-ellipsis>
        <AIcon :type="icon" />
      {{ data?.options?.type }}{{ $t('ListItem.Item.637563-14') }}<span>{{
        data?.options?.triggerName
      }}</span
    >{{ $t('ListItem.Item.637563-15') }} {{ data?.options?.relationName }}{{ $t('ListItem.Item.637563-13') }}{{
        data?.options?.productName
      }}{{ $t('ListItem.Item.637563-16') }}
      {{ data?.options?.propertiesName }}
      <span v-if="data?.options?.propertiesValue">
        {{ $t('ListItem.Item.637563-12')}}
      </span>
      {{ data?.options?.propertiesValue }}
      </j-ellipsis>
    </div>
</template>

<style scoped lang="less">

</style>
