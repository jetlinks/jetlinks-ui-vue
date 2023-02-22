<template>
  <div class="operator-box">
    <a-input-search @search="search" allow-clear placeholder="搜索关键字" />
    <a-tree class="tree" @select="selectTree" :field-names="{ title: 'name', key: 'id', }" auto-expand-parent
      :tree-data="data">
      <template #title="node">
        <div class="node">
          <div>{{ node.name }}</div>
          <div :class="node.children?.length > 0 ? 'parent' : 'add'">
            <a-popover v-if="node.type === 'property'" placement="right" title="请选择使用值" @visibleChange="setVisible">
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
              <a @click="setVisible(true)">添加</a>
            </a-popover>

            <a v-else @click="addClick(node)">
              添加
            </a>
          </div>
        </div>
      </template>
    </a-tree>
    <div class="explain">
      <ReactMarkdown>{{ item?.description || '' }}</ReactMarkdown>
    </div>
  </div>
</template>
<script setup lang="ts" name="Operator">
import type { OperatorItem } from './typings';
import { treeFilter } from '@/utils/tree'
import { Store } from 'jetlinks-store';

const item = ref<Partial<OperatorItem>>()
const data = ref<OperatorItem[]>([])
const dataRef = ref<OperatorItem[]>([])
const visible = ref(false)

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

const setVisible = (_visible: boolean) => {
  visible.value = !!visible
}

const recentClick = (node: OperatorItem) => {
  Store.set('add-operator-value', `$recent("${node.id}")`);
  setVisible(!visible.value);
}
const lastClick = (node: OperatorItem) => {
  Store.set('add-operator-value', `$lastState("${node.id}")`);
  setVisible(!visible.value);
}
const addClick = (node: OperatorItem) => {
  Store.set('add-operator-value', node.code);
  setVisible(true);
}
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