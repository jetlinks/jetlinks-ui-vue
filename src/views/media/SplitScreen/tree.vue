<template>
  <div class="left-content">
    <j-tree
        :height="700"
        :show-line="{ showLeafIcon: false }"
        :show-icon="true"
        :tree-data="treeData"
        :loadData="onLoadData"
        :fieldNames="{ title: 'name', key: 'id' }"
        @select="onSelect"
        v-model:expandedKeys="expandedKeys"
    >
      <template #title="{id, name, _type}">
        <div class="name">
          <AIcon
              type="VideoCameraOutlined" style="margin-right: 5px;"
              v-if="_type === 'channel'"
          />
          <j-ellipsis>{{ name || '--' }}</j-ellipsis>
        </div>
      </template>
      <template #icon>
      </template>
    </j-tree>
  </div>
</template>

<script setup lang="ts">
import cascadeApi from '@/api/media/cascade';
import ChannelApi from "@/api/media/channel";

type Emits = {
  (e: 'onSelect', data: { dId: string; cId: string }): void;
};

/**
 * 默认展开第一个
 */
const expandedKeys = ref<any[]>([]); // 展开的key
//  const selectedKeys = ref<any[]>([]); // 选中的key

const emit = defineEmits<Emits>();

let _first = true

interface DataNode {
  name: string;
  id: string;
  isLeaf?: boolean;
  channelNumber?: number;
  icon?: any;
  status: {
    text: string;
    value: string;
  };
  children?: DataNode[];
  type: 'catalog' | 'channel';
}

/**
 * 点击节点
 * @param _
 * @param param1
 */
const onSelect = (_: any, {node}: any) => {
  if(node._type === 'channel') {
    emit('onSelect', {dId: node.deviceId, cId: node.channelId});
  }
};

/**
 * 是否为子节点
 * @param node
 */
const isLeaf = (node: any): boolean => {
  if (node.channelNumber) {
    return false;
  }
  return true;
};

/**
 * 获取设备列表
 */
const treeData = ref<any[]>([]);
const getDeviceList = async () => {
  const res = await cascadeApi.getMediaTree({paging: false});
  if (res.success) {
    _first = true
    treeData.value = res.result
        .sort((a: any, b: any) => b.createTime - a.createTime)
        .map((m: any) => {
          const extra: any = {};
          extra.isLeaf = isLeaf(m);
          return {
            ...m,
            ...extra,
            _type: 'device'
          };
        });
    if (treeData.value.length > 0 && treeData.value[0]) {
      expandedKeys.value.push(treeData.value[0].id)
    }
  }
};
getDeviceList();

/**
 * 更新数据
 * @param list
 * @param key
 * @param children
 */
const updateTreeData = (
    list: DataNode[],
    key: any,
    children: DataNode[],
    _type: 'catalog' | 'channel'
): DataNode[] => {
  return list.map((node) => {
    if (node.id === key) {
      return {
        ...node,
        children: node.children
            ? [...node.children, ...children]
            : children,
      };
    }

    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children, _type),
      };
    }
    return node
  });
};

const handleTreeData = (arr = []) => {
  return arr.map((item: DataNode) => {
    if (item.children?.length) {
      item.children = handleTreeData(item.children)
    }
    return {
      ...item,
      isLeaf: false,
      _type: 'catalog',
    }
  })
}

const getChannelChildren = (key: any, deviceId: string, params: any): Promise<any> => {
  return new Promise(async (resolve) => {
    const res = await ChannelApi.list(params, deviceId);
    if (res.success) {
      const {total, pageIndex, pageSize} = res.result;
      treeData.value = updateTreeData(
          treeData.value,
          key,
          res.result.data.map((item: DataNode) => ({
            ...item,
            class: item.status.value,
            isLeaf: isLeaf(item),
            _type: 'channel'
          })),
          'channel'
      );

      if (total > (pageIndex + 1) * pageSize) {
        setTimeout(() => {
          getChannelChildren(key, deviceId, {
            ...params,
            pageIndex: params.pageIndex + 1,
          });
        }, 50);
      }
      resolve(res.result);
    }
  });
};

const getChildren = (node: any): Promise<any> => {
  return new Promise(async (resolve) => {
    _first = false
    // 先查询目录，再查询通道, 如果是目录就只需要查询通道
    if(node._type !== 'catalog') {
      const res = await ChannelApi.queryTree(node.key, {})
      if (res.success) {
        treeData.value = updateTreeData(
            treeData.value,
            node.key,
            handleTreeData(res.result),
            'catalog'
        );
      }
    }
    await getChannelChildren(node.key, node._type === 'catalog' ? node.deviceId : node.key, {
      pageIndex: 0,
      pageSize: 100,
      terms: [
        {
          column: "parentId",
          value: node._type === 'catalog' ? node.id : ''
        }
      ]
    })
    resolve(true)
  });
};

/**
 * 异步加载子节点数据
 */
const onLoadData = (node: any): Promise<void> => {
  return new Promise(async (resolve) => {
    if (node._type !== 'catalog' && node.children?.length) {
      resolve();
      return;
    }
    if (node._type !== 'catalog' && node.provider !== 'gb28181-2016') {
      await getChannelChildren(node.id, node.id, {
        pageIndex: 0,
        pageSize: 100,
      });
    } else {
      await getChildren(node);
    }
    resolve();
  });
};

</script>

<style lang="less" scoped>
@import './index.less';

.name {
  display: flex;
  align-items: center;
}
</style>
