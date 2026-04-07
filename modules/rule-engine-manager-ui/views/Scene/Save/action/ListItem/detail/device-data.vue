<script setup name="DeviceData">
import {typeIconMap} from "@rule-engine-manager-ui/views/Scene/Save/action/ListItem/util";
import {useI18n} from "vue-i18n";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
})
const {t: $t} = useI18n();

const info = computed(() => {
  return props.data.configuration || {}
})
const icon = computed(() => typeIconMap[props.data?.device?.message?.messageType || 'INVOKE_FUNCTION'])
</script>

<template>
  <div v-if="['fixed', 'context'].includes(info.selector.selector)">
    <a-space>
      <AIcon type="icon-mubiao" style="padding: 0 4px" />
      <span>{{$t('ListItem.Item.637563-23')}}</span>
      <j-ellipsis style="max-width: 200px;">
        {{ Array.isArray(data.options?.name) ? data.options?.name?.join(',') : data.options?.name }}
      </j-ellipsis>
      <span>{{$t('ListItem.Item.637563-13')}}</span>
    </a-space>
  </div>
  <div v-else-if="info.selector.selector === 'tag'">
    <a-space>
      <AIcon :type="icon" />
      <span>{{$t('ListItem.Item.637563-23')}}</span>
        {{ data.options?.type }}
        <span>
          <j-ellipsis style="max-width: 150px;">
          {{ data.options?.tagName }}
          </j-ellipsis>
        </span>
        {{ $t('ListItem.Item.637563-13') }}
        <j-ellipsis style="max-width: 150px;">
          {{ data.options?.productName }}
          {{ data.options?.propertiesName }}
        </j-ellipsis>
        <span>{{$t('ListItem.Item.637563-13')}}</span>
    </a-space>
  </div>
  <div v-else-if="info.selector.selector === 'relation'">
    <a-space>
    <AIcon :type="icon" />
    <span>{{$t('ListItem.Item.637563-23')}}</span>
    {{ data.options?.type }}
    {{ $t('ListItem.Item.637563-14') }}
    <span>
      <j-ellipsis style="max-width: 150px;">
        {{ data.options?.triggerName }}
      </j-ellipsis>
    </span>
    {{ $t('ListItem.Item.637563-15') }}
      <j-ellipsis style="max-width: 150px;">
      {{ data.options?.relationName }}
      </j-ellipsis>
    {{ $t('ListItem.Item.637563-13') }}
      <j-ellipsis style="max-width: 150px;">
        {{ data.options?.productName }}
        {{ $t('ListItem.Item.637563-16') }}
        {{ data.options?.propertiesName }}
      </j-ellipsis>
    </a-space>
  </div>
  <span>{{$t('ListItem.Item.637563-24')}}</span>
</template>

<style scoped lang="less">

</style>
