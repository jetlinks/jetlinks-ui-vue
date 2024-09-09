<template>
  <j-tree-select
      showSearch
      placeholder="1级区域不需要选择"
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
  </j-tree-select>
  <j-checkbox
      v-model:checked="mySync"
      @change="onCheckChange"
      style="margin-top: 5px"
  >同步添加下一级区域</j-checkbox
  >
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

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
  // if (e.target.checked) {
  //   const children = features.value?.children ? features.value?.children : findChildren(props.areaTree, _value.value)
  //   emits('update:children', children.map((item, index) => {
  //     if (!item.sortIndex) {
  //       item.sortIndex = index + 1
  //     }
  //     return item
  //   }));
  // } else {
  //   emits('update:children', []);
  // }
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
  // features.value = getObj(node);
  _value.value = val;

  emits('update:name', node.name);
  emits('update:value', node.code);

  // if (mySync.value) {
  //   emits('update:children', node?.children.map(item => ({
  //     code: item.code,
  //     name: item.name,
  //     parentId: item.parentId,
  //   })));
  // }
};


watch(
    () => props.value,
    () => {
      if (props.value) {
        _value.value = props.value
      } else {
        emits('update:name', '中国');
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
