<template>
  <template v-if="type === 'dingTalk'">
    <j-auto-complete
        :options="options"
        @change="change"
        :placeholder="$t('components.ToOrg.6401014-0')"
        style="width: 100%"
        :allowClear="true"
        v-model:value="_value"
    />
  </template>
  <template v-else>
    <a-tree-select
        :tree-data="options"
        @change="change"
        :placeholder="$t('components.ToOrg.6401014-0')"
        style="width: 100%"
        :allowClear="true"
        v-model:value="_value"
    />
  </template>
</template>

<script setup lang="ts">
import templateApi from '../../../../api/template';
import {useI18n} from 'vue-i18n';

const {t: $t} = useI18n();
type Emits = {
  (e: 'update:toParty', data: string | undefined): void;
  (e: 'change', data: string | undefined): void;
};

type Props = {
  toParty: string | undefined;
  type: string | undefined;
  configId: string | undefined;
}

const emit = defineEmits<Emits>();

const props = defineProps<Props>();

const _value = computed({
  get: () => {
    return props.toParty || undefined;
  },
  set: (val: string | undefined) => emit('update:toParty', val),
});
const typeObj = {
  weixin: 'wechat',
  dingTalk: 'dingtalk',
};
const options = ref([]);

const handleValue = (arr = []) => {
  return arr.map((item: any) => {
    return {
      ...item,
      label: item.name,
      value: item.id,
      children: item.children ? handleValue(item.children) : []
    }
  })
}
const queryData = async () => {
  if (!props.configId) return;
  const resp = await (props.type === 'weixin' ? templateApi.getWeixinDept(props.configId) : templateApi.getDept(
      typeObj[props.type],
      props.configId,
  ));
  if (resp.success) {
    options.value = handleValue(resp.result)
  }
};
queryData();

const change = (e: any) => {
  emit('update:toParty', e || undefined);
  emit('change', e || undefined);
};

watch(
    () => props.configId,
    () => {
      queryData();
    },
);
</script>

<style lang="less" scoped></style>
