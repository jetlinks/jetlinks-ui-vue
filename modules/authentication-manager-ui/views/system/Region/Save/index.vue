<template>
  <a-modal
    :maskClosable="false"
    width="650px"
    :open="true"
    :title="mode === 'edit' ? $t('Save.index.968210-0') : $t('Save.index.968210-1')"
    :confirmLoading="loading"
    @ok="handleSave"
    @cancel="() => { handleCancel() }"
  >
    <div style="margin-top: 10px">
      <a-form :layout="'vertical'" ref="formRef" :model="modelRef">
        <a-form-item name="parentId" :label="$t('Save.index.968210-2')">
          <a-tree-select
            showSearch
            allowClear
            v-model:value="modelRef.parentId"
            :loadData="onLoadData"
            :placeholder="$t('Save.index.968210-3')"
            :tree-data="areaList"
            :field-names="{
              children: 'children',
              label: 'name',
              value: 'id',
            }"
            tree-node-filter-prop="name"
            @change="treeSelect"
          />
        </a-form-item>
        <a-form-item :label="$t('Save.index.968210-4')">
          <RadioButton
            v-model:value="modelRef.properties.type"
            :options="[
              {
                label: $t('Save.index.968210-5'),
                value: 'builtin'
              },
              {
                label: $t('Save.index.968210-6'),
                value: 'custom'
              },
            ]"
            @select="typeChange"
          />
        </a-form-item>
        <template v-if="modelRef.properties.type === 'builtin'">
          <a-form-item>
            <BuildIn
              v-model:value="modelRef.code"
              v-model:name="modelRef.name"
              v-model:sync="modelRef.properties.sync"
              v-model:syncAll="modelRef.properties.syncAll"
              :areaTree="areaTree"
            />
          </a-form-item>
        </template>
        <template v-else>
          <a-form-item
            :label="$t('Save.index.968210-7')"
            name="name"
            required
            :rules="[
              {
                required: true,
                message: $t('Save.index.968210-8'),
              },
              {
                max: 64,
                message: $t('Save.index.968210-9'),
              },
              // {
              //   validator: vailName,
              //   trigger: 'blur',
              // },
            ]"
          >
            <a-input
              v-model:value="modelRef.name"
              :placeholder="$t('Save.index.968210-8')"
            />
          </a-form-item>
          <a-form-item
            :label="$t('Save.index.968210-10')"
            name="code"
            required
            :rules="[
              {
                required: true,
                message: $t('Save.index.968210-11'),
              },
                // {
                //     validator: vailCode,
                //     trigger: 'blur',
                // },
            ]"
          >
            <a-input-number
              v-model:value="modelRef.code"
              style="width: 100%"
              :placeholder="$t('Save.index.968210-11')"
            />
          </a-form-item>
          <a-form-item
            :label="$t('Save.index.968210-12')"
          >
            <RadioButton
              v-model:value="modelRef.properties.partition"
              :options="[
              {
                label: $t('Save.index.968210-13'),
                value: 'none'
              },
              {
                label: $t('Save.index.968210-14'),
                value: 'manual'
              },
              {
                label: 'GeoJson',
                value: 'geoJson'
              },
            ]"
              @select="typeChange"
            />
          </a-form-item>
          <div v-if="modelRef.properties.partition === 'manual'">
            <a-button v-if="!modelRef.geoJson" type="link" style="padding: 0" @click="showEditMap(false)">{{ $t('Save.index.968210-15') }}</a-button>
            <template v-else>
              <a-space>
                <span>{{ $t('Save.index.968210-16') }}</span>
                <a-button type="link" style="padding: 0" @click="showEditMap(true)">{{ $t('Save.index.968210-17') }}</a-button>
              </a-space>
            </template>
          </div>
          <div v-else-if="modelRef.properties.partition === 'geoJson'">
            <a-button v-if="!modelRef.geoJson" type="link" style="padding: 0" @click="geoJsonVisible = true">{{ $t('Save.index.968210-18') }}</a-button>
            <template v-else>
              <a-space>
                <span>{{ $t('Save.index.968210-19') }}</span>
                <a-button type="link" style="padding: 0" @click="geoJsonVisible = true">{{ $t('Save.index.968210-17') }}</a-button>
              </a-space>
            </template>
          </div>
        </template>
      </a-form>

      <GeoJsonModal
        v-if="geoJsonVisible"
        :value="modelRef.geoJson"
        @cancel="geoJsonVisible = false"
        @ok="updateGeoJson"
      />
    </div>
  </a-modal>
</template>

<script lang="ts" setup name="Save">
import type {PropType} from 'vue';
import {reactive, ref, watch} from 'vue';
import BuildIn from './BuildIn.vue';
import {updateRegion, validateName, validateCode,getRegion} from '@authentication-manager-ui/api/system/region';
import {cloneDeep, omit} from "lodash-es";
import { onlyMessage } from "@jetlinks-web/utils";
import RadioButton from '@jetlinks-web-core/components/CardSelect/RadioButton.vue'
import GeoJsonModal from './GeoJsonModal.vue'
import {useRegion} from "../hooks";
import {syncChildren} from "../util";
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const emit = defineEmits(['close', 'save']);
const props = defineProps({
  data: {
    type: Object,
    default: () => {
    },
  },
  treeData: {
    type: Array,
    default: () => []
  },
  areaTree: {
    type: Array,
    default: () => []
  },
  mode: {
    type: String as PropType<'add' | 'edit'>,
    default: 'add',
  },
});

const areaList = ref<Record<string, any>[]>([]);
const loading = ref<boolean>(false);
const geoJsonVisible = ref<boolean>(false);

const formRef = ref();
const regionState = useRegion()

const init = {
  parentId: undefined,
  id: undefined,
  name: undefined,
  code: undefined,
  features: undefined,
  children: [],
  properties: {
    type: 'builtin',
    partition: 'none',
    sync: true,
    syncAll: false,
  },
  sortIndex: props.data.sortIndex || 1,
  geoJson: undefined,
};

const modelRef = reactive({
  parentId: undefined,
  id: undefined,
  name: undefined,
  code: undefined,
  features: undefined,
  children: [],
  properties: {
    type: 'builtin',
    partition: 'none',
    sync: true,
    syncAll: false,
  },
  sortIndex: props.data.sortIndex || 1,
  geoJson: undefined,
});

const updateGeoJson = (json: string) => {
  modelRef.geoJson = json
  geoJsonVisible.value = false
}

const handleCancel = (data: any) => {
  if (modelRef.properties.type === 'custom') {
    if (props.mode === 'add') {
      regionState.mapInit()
    } else {
      regionState.mapReadOnly(modelRef.geoJson)
    }
  }
  regionState.showGeoJson = true
  emit('close', data);
};

const typeChange = (type: string) => {
  modelRef.geoJson = undefined
  modelRef.children = []
  modelRef.properties.sync =false
}

const traceEdit = () => {
  const newData: any = {
    ...props.data,
    ...modelRef,
  }

  handleCancel(newData)
}

const showEditMap = (type: boolean) => {
  regionState.treeMask = true
  regionState.saveCache = modelRef
  regionState.showTool()
  regionState.showGeoJson = false

  if (type) {
    regionState.layerSetData(modelRef.geoJson)
  } else { // 新增
    regionState.type = undefined
  }

  regionState.editType = props.mode

  emit('close')
}
// 异步加载子节点数据
const onLoadData = async (treeNode: any) => {
  console.log('onLoadData 被调用:', treeNode);
  return new Promise<void>(async (resolve) => {
    // 如果节点已经有子节点且不为空数组，则不需要加载
    if (treeNode.children && treeNode.children.length > 0) {
      console.log('节点已有子节点，跳过加载');
      resolve();
      return;
    }

    try {
      console.log('开始异步加载子节点，父节点ID:', treeNode.id);
      const params = {
        paging: false,
        sorts: [{ name: "sortIndex", order: "asc" }],
        terms: [{
          column: 'parentId',
          value: treeNode.id,
          termType: "eq",
        }],
      };

      const resp = await getRegion(params);
      if (resp.success) {
        console.log('获取到子节点数据:', resp.result);
        const children = (resp.result || []).map((item: any) => ({
          ...item,
          key: item.id,
          title: item.name,
          value: item.id,
          isLeaf: false, // 默认都不是叶子节点，允许展开查询
          children: undefined, // 设置为 undefined，表示可以异步加载
        }));

        // 递归更新树节点
        const updateTreeNode = (nodes: any[], targetId: string, newChildren: any[]): any[] => {
          return nodes.map(node => {
            if (node.id === targetId) {
              return {
                ...node,
                children: newChildren.length > 0 ? newChildren : undefined,
                isLeaf: newChildren.length === 0
              };
            }
            if (node.children && node.children.length > 0) {
              return {
                ...node,
                children: updateTreeNode(node.children, targetId, newChildren)
              };
            }
            return node;
          });
        };

        // 更新树数据
        areaList.value = updateTreeNode(areaList.value, treeNode.id, children);
        console.log('树数据已更新:', areaList.value);
      }
    } catch (error) {
      console.error('加载子节点失败:', error);
    }

    resolve();
  });
};
const treeSelect = (id: string, label: string, extra: any) => {
  let children: any[]
  if (extra) {
    children = extra?.triggerNode?.props.children || []
  } else {
    children = props.treeData
  }
  const lastItem = children.length ? children[children.length - 1] : {}
  modelRef.sortIndex = lastItem.sortIndex ? lastItem.sortIndex + 1 : 1
}

const handleSave = () => {
  formRef.value
    .validate()
    .then(async (_data: any) => {
      const newData: any = {
        ...omit(props.data, ['parentFullName', 'parentId']),
        ...modelRef,
      }
      newData.fullName = props.data.parentFullName ? props.data.parentFullName + modelRef.name : modelRef.name
      newData.parentId = newData.parentId || ''

      if(props.mode === 'edit'){
        newData.fullName  = props.data.fullName
      }

      if (newData.properties.sync) {
        const arr = cloneDeep(props.areaTree)
        const _syncChildren = syncChildren(newData.code, arr, newData.properties.syncAll)

        const different = _syncChildren.filter(item => {
          if (newData.children && newData.children.some(oldItem => oldItem.code === item.code)) {
            return false
          }

          if (!item.fullName) {
            item.fullName = newData.fullName + item.name
          }

          return true
        })

        newData.children = [
          ...(newData.children || []),
          ...different
        ].map(item=>{
          const {id,...extra} =item
          return extra
        })
      }

      loading.value = true;
      const resp = await updateRegion(newData).finally(() => {
        loading.value = false;
        regionState.showGeoJson = true
      });
      if (resp.status === 200) {
        regionState.stateInit()
        onlyMessage($t('Save.index.968210-20'));
        emit('save');
      }
      regionState.showGeoJson = true
    })
    .catch((err: any) => {
      console.log('error', err);
    })
}

const vailName = async (_: Record<string, any>, value: string) => {
  if (!props?.data?.id && value) {
    const resp = await validateName(value, props.data.id);
    if (resp.status === 200 && !resp.result?.passed) {
      return Promise.reject($t('Save.index.968210-21'));
    } else {
      return Promise.resolve();
    }
  } else {
    return Promise.resolve();
  }
};

const vailCode = async (_: Record<string, any>, value: string) => {
  if (!props?.data?.id && value) {
    const resp = await validateCode(value, props.data.id);
    if (resp.status === 200 && !resp.result?.passed) {
      return Promise.reject($t('Save.index.968210-22'));
    } else {
      return Promise.resolve();
    }
  } else {
    return Promise.resolve();
  }
};

const onChange = () => {
  modelRef.features = undefined;
};

watch(
  () => JSON.stringify(props.data),
  (val) => {

    if (props.mode === 'add') {
      // 添加子
      Object.assign(modelRef, init, JSON.parse(val || '{}'));
    } else if (props.mode === 'edit') {
      // 编辑
      Object.assign(modelRef, JSON.parse(val || '{}'));
    } else {
      Object.assign(modelRef, init);
    }
  },
  {immediate: true},
);


// 处理树数据，为异步加载设置正确的属性
const processTreeData = (data: any[]): any[] => {
  return data.map(item => ({
    ...item,
    key: item.id,
    title: item.name,
    value: item.id,
    isLeaf: false, // 默认都不是叶子节点，允许展开查询
    children: item.children && item.children.length > 0 ? processTreeData(item.children) : undefined, // 如果有子节点则递归处理，否则设为 undefined 以触发异步加载
  }));
};

watch(() => JSON.stringify(props.treeData), () => {
  areaList.value = processTreeData(JSON.parse(JSON.stringify(props.treeData)))
  // if (props.mode === 'add' && modelRef.properties.sync) {
  //   // modelRef.children = props.areaTree?.[0]?.children
  // }
}, {immediate: true})
</script>
