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
  <a-space size="middle" align="top" style="margin-top: 8px;">
    <a-switch
        v-model:checked="mySync"
        @change="onCheckChange"
    ></a-switch>
    <div>
      <div>
        {{ $t('Save.BuildIn.317807-1') }}
      </div>
      <a-radio-group v-if="mySync" v-model:value="radioValue" size="small" style="margin-top: 5px;" @change="onRadioChange">
        <a-radio-button :value="false">添加下一级区域</a-radio-button>
        <a-radio-button :value="true">添加下级所有区域</a-radio-button>
      </a-radio-group>
    </div>
  </a-space>
  <a-form-item-rest>

  </a-form-item-rest>
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
  },
  syncAll: {
    type: Boolean,
    default: false,
  }
});

const emits = defineEmits(['update:value', 'update:name', 'update:children', 'update:sync', 'update:syncAll']);

const features = ref<any>({});
const _value = ref<string>();
const mySync = ref<boolean>(props.sync);
const radioValue = ref<boolean>(props.syncAll);


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
  emits('update:sync', e)
  if (!e) {
    radioValue.value = 'onlyNextLevel'
    emits('update:syncAll', radioValue.value)
  }
};

const onRadioChange = (e: any) => {
  emits('update:syncAll', e.target.value)
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
