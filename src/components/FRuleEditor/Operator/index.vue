<template>
  <div class="operator-box">
    <a-input-search @search="search" allow-clear placeholder="搜索关键字" />
    <div class="tree">
      <a-tree @select="selectTree" :field-names="{ title: 'name', key: 'id', }" auto-expand-parent
        :tree-data="data">
        <template #title="node">
          <div class="node">
            <div>{{ node.name }}</div>
            <div :class="node.children?.length > 0 ? 'parent' : 'add'">
              <a-popover v-if="node.type === 'property'" placement="right" title="请选择使用值">
                <template #content>
                  <a-space direction="vertical">
                    <a-tooltip placement="right" title="实时值为空时获取上一有效值补齐，实时值不为空则使用实时值">
                      <a-button type="text" @click="recentClick(node)">
                        $recent实时值
                      </a-button>
                    </a-tooltip>
                    <a-tooltip placement="right" title="实时值的上一有效值">
                      <a-button @click="lastClick(node)" type="text">
                        上一值
                      </a-button>
                    </a-tooltip>
                  </a-space>
                </template>
                <a>添加</a>
              </a-popover>

              <a v-else @click="addClick(node)">
                添加
              </a>
            </div>
          </div>
        </template>
      </a-tree>
    </div>
    <div class="explain">
      <Markdown :source="item?.description || ''"></Markdown>
    </div>
  </div>
</template>
<script setup lang="ts" name="Operator">
import { useProductStore } from '@/store/product';
import type { OperatorItem } from './typings';
import { treeFilter } from '@/utils/tree'
import { PropertyMetadata } from '@/views/device/Product/typings';
import { getOperator } from '@/api/device/product'
import Markdown from 'vue3-markdown-it'

const props = defineProps({
  id: String
})

interface Emits {
  (e: 'addOperatorValue', data: string): void;
}
const emit = defineEmits<Emits>();

const item = ref<Partial<OperatorItem>>()
const data = ref<OperatorItem[]>([])
const dataRef = ref<OperatorItem[]>([])

const search = (value: string) => {
  if (value) {
    const nodes = treeFilter(dataRef.value, value, 'name') as OperatorItem[];
    data.value = nodes;
  } else {
    data.value = dataRef.value;
  }
};

const selectTree = (k: any, info: any) => {
  item.value = info.node as unknown as OperatorItem;
}

const recentClick = (node: OperatorItem) => {
  emit('addOperatorValue', `$recent("${node.id}")`)
}
const lastClick = (node: OperatorItem) => {
  emit('addOperatorValue', `$lastState("${node.id}")`)
}
const addClick = (node: OperatorItem) => {
  emit('addOperatorValue', node.code)
}

const productStore = useProductStore()

const getData = async (id?: string) => {
  const metadata = productStore.current.metadata || '{}';
  console.log('metadata', metadata)
  const _properties = JSON.parse(metadata).properties || [] as PropertyMetadata[]
  const properties = {
    id: 'property',
    name: '属性',
    description: '',
    code: '',
    children: _properties
      .filter((p: PropertyMetadata) => p.id !== id)
      .map((p: PropertyMetadata) => ({
        id: p.id,
        name: p.name,
        description: `### ${p.name}
        \n 数据类型: ${p.valueType?.type}
        \n 是否只读: ${p.expands?.readOnly || 'false'}
        \n 可写数值范围: `,
        type: 'property',
      })),
  };
  const response = await getOperator();
  if (response.status === 200) {
    data.value = [properties, ...response.result];
    dataRef.value = [properties, ...response.result];
  }
};

watch(() => props.id,
  (val) => {
    getData(val)
  },
  { immediate: true }
)
</script>
<style lang="less" scoped>
.border {
  margin-top: 10px;
  padding: 10px;
  border-top: 1px solid lightgray;
}

.operator-box {
  width: 100%;

  .explain {
    .border;
  }

  .tree {
    .border;

    height: 350px;
    overflow-y: auto;

    .node {
      display: flex;
      justify-content: space-between;
      width: 220px;

      //.add {
      //  display: none;
      //}
      //
      //&:hover .add {
      //  display: block;
      //}

      .parent {
        display: none;
      }
    }
  }
}
</style>