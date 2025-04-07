<template>
  <a-input
    :placeholder="$t('LeftTree.index.191696-0')"
    class="search-input"
    v-model:value="searchValue"
    @change="(e) => onSearch(e.target.value)"
  >
    <template #prefix>
      <AIcon type="SearchOutlined" style="color: rgba(0, 0, 0, 0.45)" />
    </template>
  </a-input>
  <div style="display: flex; gap: 8px; margin: 18px 0">
    <a-button type="primary" class="btn" @click="() => onAdd()">{{
      $t("LeftTree.index.191696-1")
    }}</a-button>
  </div>
  <div class="tree-content">
    <ResizeObserver v-if="_treeData.length" @resize="divResize">
      <div style="height: 100%; width: 100%">
        <a-tree
          class="draggable-tree"
          draggable
          block-node
          v-model:expandedKeys="expandedKeys"
          :selectedKeys="selectedKeys"
          :tree-data="_treeData"
          :show-line="{ showLeafIcon: false }"
          :show-icon="true"
          :field-names="{ key: 'id' }"
          :virtual="true"
          :height="heightSize"
          @drop="onDrop"
          @select="areaSelect"
        >
          <template #title="_data">
            <div class="tree-box">
              <div class="name">
                <j-ellipsis>{{ _data?.name }} ({{ _data.code }})</j-ellipsis>
              </div>
              <div class="actions">
                <a-space :size="8">
                  <a-tooltip :title="$t('LeftTree.index.191696-2')">
                    <a-button
                      @click.stop="onEdit(_data?.data)"
                      class="actions-btn"
                      type="link"
                    >
                      <AIcon type="EditOutlined" />
                    </a-button>
                  </a-tooltip>
                  <a-tooltip :title="$t('LeftTree.index.191696-3')">
                    <a-button
                      @click.stop="onAdd(_data?.data)"
                      class="actions-btn"
                      type="link"
                    >
                      <AIcon type="PlusCircleOutlined" />
                    </a-button>
                  </a-tooltip>
                  <a-tooltip :title="$t('LeftTree.index.191696-4')">
                    <j-permission-button
                      type="link"
                      style="margin: 0; padding: 0"
                      danger
                      :popConfirm="{
                        title: $t('LeftTree.index.191696-5'),
                        onConfirm: () => onRemove(_data?.id),
                      }"
                    >
                      <AIcon type="DeleteOutlined"
                    /></j-permission-button>
                  </a-tooltip>
                </a-space>
              </div>
            </div>
          </template>
        </a-tree>
      </div>
    </ResizeObserver>
    <div v-else class="tree-empty">
      <j-empty />
    </div>
  </div>
  <Save
    v-if="visible"
    :mode="mode"
    :data="current"
    :treeData="_treeData"
    :areaTree="areaTree"
    @save="onSave"
    @close="onClose"
  />
</template>
<script lang="ts" setup>
import { cloneDeep, debounce } from "lodash-es";
import { onMounted, ref, watch } from "vue";
import Save from "../Save/index.vue";
import { getRegionTree, delRegion, updateRegion } from "@/api/system/region";
import { useArea, useRegion } from "../hooks";
import ResizeObserver from "ant-design-vue/lib/vc-resize-observer";
import { onlyMessage } from "@jetlinks-web/utils";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();
const regionState = useRegion();
const treeData = ref<any[]>([]);
const _treeData = ref<any[]>([]);
const visible = ref<boolean>(false);
const current = ref<any>({});
const mode = ref<"add" | "edit">("add");
const searchValue = ref<string>();
const expandedKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);

const heightSize = ref(550);
const type = ref<string | undefined>(undefined);

const { areaTree } = useArea();

const emit = defineEmits(["select", "close"]);

const filterTreeNodes = (tree: any[], condition: string) => {
  return tree.filter((item) => {
    if (item?.name && item.name.includes(condition)) {
      return true;
    }

    if (item?.code && item.code.includes(condition)) {
      return true;
    }

    if (item.children) {
      item.children = filterTreeNodes(item.children, condition);
      return !!item.children.length;
    }

    return false;
  });
};

const getTreeId = (data: any[], cb: (id: string) => void) => {
  data.forEach((item) => {
    if (item.children) {
      cb?.(item.id);
      getTreeId(item.children, cb);
    }
  });
};

const onSearch = debounce((v: string) => {
  _treeData.value = v
    ? filterTreeNodes(cloneDeep(treeData.value), v)
    : cloneDeep(treeData.value);
  expandedKeys.value = [];
  if (v) {
    getTreeId(_treeData.value, (id: string) => {
      expandedKeys.value.push(id);
    });
    expandedKeys.value = [...expandedKeys.value];
  }
}, 300);

const onSave = () => {
  visible.value = false;
  handleSearch();
};

const onClose = () => {
  visible.value = false;
  emit("close");
};

const divResize = ({ height }) => {
  setTimeout(() => {
    heightSize.value = height;
  }, 300);
};

const onEdit = (_data: any) => {
  mode.value = "edit";
  current.value = _data;
  visible.value = true;
  selectedKeys.value = [_data.id];
  emit("select", _data?.code, _data);
};

const onRemove = (id: string) => {
  const response = delRegion(id);
  response.then((resp) => {
    if (resp.success) {
      onlyMessage($t("LeftTree.index.191696-6"));
      handleSearch();
    }
  });
  return response;
};

const onAdd = (_data?: any) => {
  mode.value = "add";
  const _children = _data ? _data.children || [] : _treeData.value;
  const lastItem = _children.length ? _children[_children.length - 1] : null;
  const sortIndex = lastItem ? lastItem.sortIndex + 1 : 1;
  current.value = _data
    ? {
        parentId: _data.id,
        parentFullName: _data.fullName,
        sortIndex: sortIndex,
      }
    : {
        parentId: undefined,
        parentFullName: undefined,
        sortIndex: sortIndex,
      };

  visible.value = true;
};

const onDrop = (info: any) => {
  const dropKey = info.node.key;
  const dragKey = info.dragNode.key;
  const dropPos = info.node.pos.split("-");
  const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

  const loop = (
    data: any,
    key: string | number,
    callback: any,
    parent?: any,
  ) => {
    data.forEach((item: any, index: number) => {
      if (item.id === key) {
        return callback(item, index, data, parent);
      }
      if (item.children) {
        return loop(item.children, key, callback, item);
      }
    });
  };
  const data = [...treeData.value];
  // // Find dragObject
  let dragObj: any;
  loop(data, dragKey, (item: any, index: number, arr: any[]) => {
    arr.splice(index, 1);
    dragObj = item;
  });

  if (!info.dropToGap) {
    // Drop on the content
    loop(data, dropKey, (item: any) => {
      item.children = item.children || [];
      /// where to insert 示例添加到头部，可以是随意位置
      dragObj.parentId = item.id;
      item.children.unshift(dragObj);
      item.children = item.children.map((cl: any, clIndex: number) => {
        cl.sortIndex = clIndex + 1;
        return cl;
      });
      updateRegion(dragObj);
    });
  } else if (
    (info.node.children || []).length > 0 && // Has children
    info.node.expanded && // Is expanded
    dropPosition === 1 // On the bottom gap
  ) {
    loop(
      data,
      dropKey,
      (item: any, index: number, _data: any[], parent: any) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        dragObj.parentId = item.parentId;
        item.children = item.children.map((cl: any, clIndex: number) => {
          cl.sortIndex = clIndex + 1;
          return cl;
        });

        _data.splice(index + 1, 0, dragObj);
        // 获取item的父级，将dragObj放入同级
        updateRegion(item);
        updateRegion(dragObj);
      },
    );
  } else {
    loop(
      data,
      dropKey,
      (_item: any, index: number, arr: any[], parent: any) => {
        dragObj.parentId = parent ? parent.id : "";
        dragObj.sortIndex = dropPosition === -1 ? index : index + 1;
        arr.splice(dragObj.sortIndex, 0, dragObj);
        const sortArray = arr.map((cl: any, clIndex: number) => {
          cl.sortIndex = clIndex + 1;
          return cl;
        });
        if (parent) {
          parent.children = sortArray;
          updateRegion(parent);
        } else {
          updateRegion(arr);
        }
      },
    );
  }

  treeData.value = data;
};

watch(
  () => treeData.value,
  () => {
    if (searchValue.value) {
      onSearch(searchValue.value);
    } else {
      _treeData.value = treeData.value;
    }
  },
  {
    deep: true,
    immediate: true,
  },
);

/**
 * 区域选择
 */
const areaSelect = (key, { node }) => {
  if (!key.length) return;
  selectedKeys.value = key;
  emit("select", node?.code, node);
};

const handleSearch = async () => {
  const resp = await getRegionTree({
    paging: false,
    sorts: [{ name: "sortIndex", order: "asc" }],
  });
  if (resp.success) {
    treeData.value = resp?.result || [];
    // 默认选择第一个数据
    const dt = treeData.value?.[0];
    if (dt) {
      selectedKeys.value = dt?.id ? [dt?.id] : [];
      emit("select", dt?.code, dt);
    }
  }
};

const openSave = (geoJson: Record<string, any>) => {
  if (geoJson) {
    regionState.saveCache.geoJson = geoJson;
  }
  current.value = regionState.saveCache;
  visible.value = true;
  regionState.treeMask = false;
};

defineExpose({
  openSave: openSave,
});

onMounted(() => {
  handleSearch();
});
</script>

<style lang="less" scoped>
.btn {
  flex: 1;
  min-width: 0;
}

.tree-content {
  flex: 1 1 0;
  min-height: 0;
  width: 100%;

  .tree-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 100px;
    width: 100%;
  }
}
:deep(.ant-tree-node-content-wrapper) {
  transform: translateY(-4px) !important;
}

.tree-box {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .actions {
    padding-right: 4px;

    .actions-btn {
      margin: 0;
      padding: 0;
    }
  }
}
</style>
