<template>
  <a-modal
    :maskClosable="false"
    width="650px"
    :visible="true"
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
import {updateRegion, validateName, validateCode} from '@/api/system/region';
import {cloneDeep, omit} from "lodash-es";
import { onlyMessage } from "@jetlinks-web/utils";
import RadioButton from '@/components/CardSelect/RadioButton.vue'
import GeoJsonModal from './GeoJsonModal.vue'
import {useRegion} from "@/views/system/Region/hooks";
import {syncChildren} from "@/views/system/Region/util";
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

      const resp = await updateRegion(newData).finally(() => {
        loading.value = false;
      });
      if (resp.status === 200) {
        regionState.stateInit()
        onlyMessage($t('Save.index.968210-20'));
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


watch(() => JSON.stringify(props.treeData), () => {
  areaList.value = JSON.parse(JSON.stringify(props.treeData))
  // if (props.mode === 'add' && modelRef.properties.sync) {
  //   // modelRef.children = props.areaTree?.[0]?.children
  // }
}, {immediate: true})
</script>
