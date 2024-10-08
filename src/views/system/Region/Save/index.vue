<template>
  <j-modal
    :maskClosable="false"
    width="650px"
    :visible="true"
    :title="mode === 'edit' ? '编辑区域' : '新增区域'"
    :confirmLoading="loading"
    @ok="handleSave"
    @cancel="() => { handleCancel() }"
  >
    <div style="margin-top: 10px">
      <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
        <j-form-item name="parentId" label="上级区域">
          <j-tree-select
            showSearch
            allowClear
            v-model:value="modelRef.parentId"
            placeholder="1级区域不需要选择"
            :tree-data="areaList"
            :field-names="{
                            children: 'children',
                            label: 'name',
                            value: 'id',
                        }"
            tree-node-filter-prop="name"
            @change="treeSelect"
          />
        </j-form-item>
        <j-form-item label="添加方式">
          <RadioButton
            v-model:value="modelRef.properties.type"
            :options="[
              {
                label: '内置行政区',
                value: 'builtin'
              },
              {
                label: '自定义数据',
                value: 'custom'
              },
            ]"
            @select="typeChange"
          />
        </j-form-item>
        <template v-if="modelRef.properties.type === 'builtin'">
          <j-form-item>
            <BuildIn
              v-model:value="modelRef.code"
              v-model:name="modelRef.name"
              v-model:sync="modelRef.properties.sync"
              :areaTree="areaTree"
            />
          </j-form-item>
        </template>
        <template v-else>
          <j-form-item
            label="区域名称"
            name="name"
            required
            :rules="[
                        {
                            required: true,
                            message: '请输入区域名称',
                        },
                        {
                            max: 64,
                            message: '最多输入64个字符',
                        },
                        // {
                        //     validator: vailName,
                        //     trigger: 'blur',
                        // },
                    ]"
          >
            <j-input
              v-model:value="modelRef.name"
              placeholder="请输入区域名称"
            />
          </j-form-item>
          <j-form-item
            label="区划代码"
            name="code"
            required
            :rules="[
                        {
                            required: true,
                            message: '请输入区划代码',
                        },
                        // {
                        //     validator: vailCode,
                        //     trigger: 'blur',
                        // },
                    ]"
          >
            <j-input-number
              v-model:value="modelRef.code"
              style="width: 100%"
              placeholder="请输入区划代码"
            />
          </j-form-item>
          <j-form-item
            label="区域划分"
          >
            <RadioButton
              v-model:value="modelRef.properties.partition"
              :options="[
              {
                label: '无',
                value: 'none'
              },
              {
                label: '手动描点',
                value: 'manual'
              },
              {
                label: 'GeoJson',
                value: 'geoJson'
              },
            ]"
              @select="typeChange"
            />
          </j-form-item>
          <div v-if="modelRef.properties.partition === 'manual'">
            <a-button v-if="!modelRef.geoJson" type="link" style="padding: 0" @click="showEditMap(false)">请在地图上描点</a-button>
            <template v-else>
              <a-space>
                <span>区域已圈定完成</span>
                <a-button type="link" style="padding: 0" @click="showEditMap(true)">编辑</a-button>
              </a-space>
            </template>
          </div>
          <div v-else-if="modelRef.properties.partition === 'geoJson'">
            <a-button v-if="!modelRef.geoJson" type="link" style="padding: 0" @click="geoJsonVisible = true">点击上传GeoJson</a-button>
            <template v-else>
              <a-space>
                <span>已上传</span>
                <a-button type="link" style="padding: 0" @click="geoJsonVisible = true">编辑</a-button>
              </a-space>
            </template>
          </div>
        </template>
      </j-form>

      <GeoJsonModal
        v-if="geoJsonVisible"
        :value="modelRef.geoJson"
        @cancel="geoJsonVisible = false"
        @ok="updateGeoJson"
      />
    </div>
  </j-modal>
</template>

<script lang="ts" setup name="Save">
import type {PropType} from 'vue';
import {reactive, ref, watch} from 'vue';
import BuildIn from './BuildIn.vue';
import {updateRegion, validateName, validateCode} from '@/api/system/region';
import {cloneDeep, omit} from "lodash-es";
import {onlyMessage} from "@/utils/comm";
import RadioButton from '@/components/CardSelect/RadioButton.vue'
import GeoJsonModal from './GeoJsonModal.vue'
import {useRegion} from "@/views/system/Region/hooks";
import {syncChildren} from "@/views/system/Region/util";

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
    sync: true
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
    sync: true
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

  if (type) {
    regionState.layerSetData(modelRef.geoJson)
  } else {
    regionState.type = undefined
  }

  regionState.editType = props.mode

  emit('close')
}
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
        const _syncChildren = syncChildren(newData.code, arr)
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
      console.log('props====',props.data);
      console.log('newData====',newData);

      const resp = await updateRegion(newData).finally(() => {
        loading.value = false;
      });
      if (resp.status === 200) {
        regionState.stateInit()
        onlyMessage('操作成功！');
        emit('save');
      }
    })
    .catch((err: any) => {
      console.log('error', err);
    });
}

const vailName = async (_: Record<string, any>, value: string) => {
  if (!props?.data?.id && value) {
    const resp = await validateName(value, props.data.id);
    if (resp.status === 200 && !resp.result?.passed) {
      return Promise.reject('区域名称重复');
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
      return Promise.reject('行政区域代码重复');
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


watch(() => JSON.stringify(props.treeData), () => {
  areaList.value = JSON.parse(JSON.stringify(props.treeData))
  // if (props.mode === 'add' && modelRef.properties.sync) {
  //   // modelRef.children = props.areaTree?.[0]?.children
  // }
}, {immediate: true})
</script>
