<template>
  <a-tree-select
      showSearch
      :placeholder="$t('Save.BuildIn.317807-0')"
      :tree-data="areaTree"
      :value="_value"
      :field-names="{
            label: 'name',
            value: 'code'
        }"
      tree-node-filter-prop="name"
      @select="onSelect"
  >
    <template #title="{ name, code }">
      <span v-if="code">{{ name }} | {{ code }}</span>
    </template>
  </a-tree-select>
  <a-checkbox
      v-model:checked="mySync"
      @change="onCheckChange"
      style="margin-top: 5px"
  >{{ $t('Save.BuildIn.317807-1') }}</a-checkbox
  >
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  children: {
    type: Array,
    default: () => [],
  },
  areaTree: {
    type: Array,
    default: () => [],
  },
  sync: {
    type: Boolean,
    default: true
  }
});

const emits = defineEmits(['update:value', 'update:name', 'update:children', 'update:sync']);

const features = ref<any>({});
const _value = ref<string>();
const mySync = ref<boolean>(props.sync);


const findChildren = (data: any, code: string) => {
  let children: any[] = []

  data.some((item: any) => {
    if (item.code === code) {
      children = item.children
      return true
    }

    if (item.children) {
      children = findChildren(item.children, code)
      return !!children.length
    }

    return false
  })

  return children
}

const onCheckChange = (e: any) => {
  emits('update:sync', e.target.checked)
};

const getObj = (node: any): any => {
  const _children = (node?.children || []).map((item: any) => {
    return {
      code: item.code,
      name: item.name,
      parentId: item.parentId,
    };
  });
  return {
    code: node.code,
    name: node.name,
    parentId: node.parentId,
    children: _children,
  };
};

const onSelect = (val: string, node: any) => {

  _value.value = val;

  emits('update:name', node.name);
  emits('update:value', node.code);
};


watch(
    () => props.value,
    () => {
      if (props.value) {
        _value.value = props.value as string
      } else {
        emits('update:name', $t('Save.BuildIn.317807-2'));
        emits('update:value', '100000');
      }
    },
    {
      deep: true,
      immediate: true,
    },
);

watch(() => props.sync, () => {
  mySync.value = props.sync
}, { immediate: true})
</script>
