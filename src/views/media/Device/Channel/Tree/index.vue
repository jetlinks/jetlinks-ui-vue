<template>
  <div class="left-warp" v-if="showWarp">
    <div class="left-content" :class="{ active: show}">
      <div class="channel-tree">
          <div class="channel-tree-query">
              <j-input @change="queryTree" placeholder="请输入目录名称">
                  <template #suffix>
                      <AIcon type="SearchOutlined" />
                  </template>
              </j-input>
          </div>
          <div class="channel-tree-content">
              <j-tree
                  v-if="showWarp"
                  defaultExpandAll
                  :height="500"
                  :selectedKeys="selectedKeys"
                  :treeData="treeData"
                  :onSelect="(keys:any) => {
                      if (keys.length) {
                      selectedKeys = keys
                      if (props.onSelect) {
                          props.onSelect(keys[0]);
                      }
                      }
                  }"
                  :fieldNames="{ key: 'id', title: 'name' }"
                  :showLine="{ showLeafIcon: false }"
                  :show-icon="true"
              />
          </div>
      </div>
    </div>
    <div
      class="left-warp--btn"
      :class="{ active: !show }"
      @click="show = !show"
    >
      <AIcon type="LeftOutlined" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es';
import ChannelApi from '@/api/media/channel';

interface TreeProps {
    onSelect: (id: string) => void;
    onTreeLoad: (type: boolean) => void;
    deviceData: any;

}

const props = defineProps<TreeProps>();
const route: any = useRoute();
const treeData = ref<any[]>([]);
const selectedKeys = ref<string[]>([]);
const show = ref(false);

const showWarp = computed(() => {
  return route.query.type === 'gb28181-2016' && treeData.value[0]?.children.length
})

const getTreeData = async (id: string, data?: any) => {
    const { result } = await ChannelApi.queryTree(id, data);
    treeData.value = [
      {
        id: props.deviceData.id,
        name: props.deviceData.name,
        children: result || [],
      },
    ];

    show.value = treeData.value[0].children.length > 10
};

const queryTree = debounce((e: any) => {
    getTreeData(props.deviceData.id, {
        terms: [
            { column: 'name', termType: 'like', value: `%${e.target.value}%` },
        ],
    });
}, 300);

watch(
    () => props.deviceData,
    () => {
        treeData.value = [
            {
                id: props.deviceData.id,
                name: props.deviceData.name,
                children: [],
            },
        ];
        selectedKeys.value = [props.deviceData.id];
        getTreeData(props.deviceData.id, {});
    },{
        deep:true
    }
);
</script>

<style lang="less" scoped>
.left-warp {
  position: relative;
  margin-right: 16px;
  padding: 20px;
  background-color: #fff;
  border-radius: 2px;

  .left-content {
    width: 0;
    height: 100%;
    overflow: hidden;

    &.active {
      width: 260px;
    }
  }

  .left-warp--btn {
    position: absolute;
    top: 50%;
    right: 0;
    padding: 20px 4px;
    color: rgba(#000, 0.3);
    background-color: rgba(#f0f0f0, 6);
    border-radius: ~'100% 0 0 100% / 50% 0 0 50%';
    cursor: pointer;

    &:hover {
      color: rgba(#000, 0.5);
      background-color: rgba(#f0f0f0, 8);
    }

    &.active {
      right: 50%;
      background-color: transparent;
      border-radius: 0;
      transform: translateX(50%) rotate(180deg);
    }
  }
}
.channel-tree {
    height: 100%;

    .channel-tree-query {
        margin-bottom: 16px;
    }

    .channel-tree-content {
        min-height: calc(100% - 50px);
    }
}
</style>
