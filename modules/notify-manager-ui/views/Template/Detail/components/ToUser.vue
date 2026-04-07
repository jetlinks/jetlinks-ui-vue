<template>
  <template v-if="type === 'weixin'">
    <a-select
        :options="options"
        @change="change"
        :placeholder="$t('components.ToUser.6401012-0')"
        style="width: 100%"
        :allowClear="true"
        v-model:value="_value"
    />
  </template>
  <j-auto-complete
      v-else
      :options="options"
      @change="change"
      :placeholder="$t('components.ToUser.6401012-0')"
      style="width: 100%"
      :allowClear="true"
      v-model:value="_value"
  />
</template>

<script setup lang="ts">
import templateApi from '../../../../api/template';
import {useI18n} from 'vue-i18n';

const {t: $t} = useI18n();
type Emits = {
  (e: 'update:toUser', data: string | undefined): void;
  (e: 'update:canSave', data: boolean): void;
};
type Props = {
  toUser: string | undefined;
  toParty: string | undefined;
  type: string | undefined;
  configId: string | undefined;
};

const emit = defineEmits<Emits>();

const props = defineProps<Props>();

const _value = computed({
  get: () => props.toUser || undefined,
  set: (val: string | undefined) => emit('update:toUser', val),
});

const typeObj = {
  weixin: 'wechat',
  dingTalk: 'dingtalk',
};
const options = ref([]);
const queryData = async () => {
  if (!props.configId || !props.type) return;
  let resp;
  if (props.type === 'weixin') {
    if (props.toParty) {
      resp = await templateApi.getWeixinUser(props.configId, props.toParty)
    }
  } else {
    resp = await templateApi.getUser(typeObj?.[props.type], props.configId)
  }
  if (resp?.success) {
    options.value = resp?.result.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
    emit('update:canSave', true);
  }
};
queryData();

const change = (e: any) => {
  emit('update:toUser', e || undefined);
};

watch(
    () => [props.configId, props.toParty],
    () => {
      queryData();
    },
    {
      immediate: true
    }
);
</script>

<style lang="less" scoped></style>
