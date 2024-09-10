<template>
    <j-tree
        :height="height"
        :show-line="{ showLeafIcon: false }"
        :show-icon="true"
        :tree-data="treeData"
        :loadData="onLoadData"
        :fieldNames="{ title: 'name', key: 'id' }"
        v-model:expandedKeys="expandedKeys"
        v-model:selectedKeys="selectedKeys"
        @select="onSelect"
    >
    </j-tree>
</template>

<script setup name="ChannelTree">
import cascadeApi from '@/api/media/cascade';

const emit = defineEmits([
  'update:channelId',
  'update:deviceId',
  'select',
  'load'
])

const props = defineProps({
  height: {
    type: Number,
    default: 500,
  },
  id: {
    type: String,
    default: undefined
  },
  deviceId: {
      type: String,
      default: undefined
  },
  channelId: {
    type: String,
    default: undefined
  },
  type: {
    type: String,
    default: 'bind'
  }
});

/**
 * 默认展开第一个
 */
const expandedKeys = ref([]); // 展开的key
const selectedKeys = ref([])

/**
 * 获取设备列表
 */
const treeData = ref([]);
const cacheTreeNodeIds = ref([])
const cacheDeviceIds = ref({})
const filterNodeIds = ref([])

const isBind = computed(() => {
  return props.type === 'bind'
})

const filterTreeNode = (data) => {
  return data.filter(item => {
    return item.catalogType.value !== 'device'
  })
}

/**
 * 获取子节点
 * @param key
 * @param params 请求参数
 * @param first 是否第一次
 * @param parentPaths 目录路径
 * @param channelCatalog 目录名称路径
 */
const getChildren = (key, params, first = false, parentPaths = [], channelCatalog = []) => {
  return new Promise(async (resolve) => {

    if (isBind.value ) {
      params.terms.push({
        column: "id$media-record-schedule-bind-channel",
        value: [
          {
            column: "scheduleId",
            termType: "eq",
            value: props.id
          }
        ]
      })

      if (filterNodeIds.value.length) {
        params.terms.push({
          column: 'id',
          termType: 'in',
          value: filterNodeIds.value.toString()
        })
      }
    }

    const res = await cascadeApi.queryChannelList(params);
    if (res.success) {
      const { total, pageIndex, pageSize } = res.result;
      const nodes = filterTreeNode(res.result.data).map((item) => ({
        ...item,
        class: item.status.value,
        isLeaf: false,
        paths: [...parentPaths, item.id],
        channelCatalog: [...channelCatalog, item.name],
      }))

      treeData.value = updateTreeData(
        treeData.value,
        key,
        nodes,
      );

      if (total > (pageIndex + 1) * pageSize) {
        setTimeout(() => {
          getChildren(key, {
            ...params,
            pageIndex: params.pageIndex + 1,
          }, parentPaths, channelCatalog);
        }, 50);
      }

      if (first) {
        let node = nodes.length ? nodes[0] : treeData.value[0]
        expandedKeys.value.push(treeData.value[0].id);
        selectedKeys.value = [!nodes.length ? key : nodes[0].id]
        emit('update:deviceId', selectedKeys.value[0])
        emit('select', { dId: node.deviceId, cId: node.channelId, node })
      }
      resolve(res.result);
    }
  });
};

const handleCacheDeviceTerms = (idsMap) => {
  cacheDeviceIds.value = idsMap
  if (Object.keys(idsMap || {}).length) {
    const idsSet = new Set(
      Object.values(idsMap).reduce((prev,next) => {
        prev.push(...next.paths)
        return prev
      }, [])
    )
    filterNodeIds.value = [...idsSet.values()]
    return {
      column: 'id',
      termType: 'in',
      value: Object.keys(idsMap).toString(),
      type: 'or'
    }
  }

  return null
}
const getDeviceList = async (params) => {
    const terms = [
      {
        column: "id$media-record-schedule-bind-device",
        value: [
          {
            column: "scheduleId",
            termType: "eq",
            value: props.id
          }
        ]
      }
    ]

  const deviceIdTerms = handleCacheDeviceTerms(params)

  if (deviceIdTerms) {
    terms.push(deviceIdTerms)
  }

    const res = await cascadeApi.getMediaTree({
      paging: false,
      sorts: [
        {
          name: "createTime",
          order: "desc"
        }
      ],
      terms: isBind.value ? terms : []
    });
    if (res.success) {
      emit('load', res.result)
        treeData.value = res.result
            .map((m) => {
                const extra = {};
                extra.isLeaf = false;
                return {
                    ...m,
                    ...extra,
                  paths: [m.id],
                  channelCatalog: [m.name]
                };
            });
        if (treeData.value.length > 0 && treeData.value[0]) {
            await getChildren(
                treeData.value[0].id,
                {
                    pageIndex: 0,
                    pageSize: 100,
                    terms: [
                        {
                            column: 'deviceId',
                            value: treeData.value[0].id,
                        },
                    ],
                },
                true,
                [treeData.value[0].id],
                treeData.value[0].channelCatalog
            );
        }
    }
};

/**
 * 点击节点
 * @param _
 * @param param1
 */
const onSelect = (_, { node }) => {
    selectedKeys.value = [node.id]
    emit('update:deviceId', node.id);
    emit('update:channelId', node.channelId);
    emit('select', { dId: node.deviceId, cId: node.channelId, node });
};

/**
 * 是否为子节点
 * @param node
 */
const isLeaf = (node) => {
    return !node.channelNumber;
};

/**
 * 更新数据
 * @param list
 * @param key
 * @param children
 */
const updateTreeData = (list, key, children) => {
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
                children: updateTreeData(node.children, key, children),
            };
        }
        return node;
    });
};

/**
 * 异步加载子节点数据
 * @param param0
 */
const onLoadData = ({ key, children, path }) => {
    return new Promise(async (resolve) => {
        if (children) {
            resolve();
            return;
        }
        await getChildren(key, {
            pageIndex: 0,
            pageSize: 100,
            terms: [
                {
                    column: 'deviceId',
                    value: key,
                },
            ],
        }, path);
        resolve();
    });
};


onMounted(() => {
    getDeviceList();
});

defineExpose({
  getDeviceList
})
</script>
<style lang="less" scoped></style>
