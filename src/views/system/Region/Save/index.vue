<template>
  <j-modal
    :maskClosable="false"
    width="650px"
    :visible="true"
    :title="mode === 'edit' ? $t('Save.index.101932-0') : $t('Save.index.101932-1')"
    :confirmLoading="loading"
    @ok="handleSave"
    @cancel="() => { handleCancel() }"
  >
    <div style="margin-top: 10px">
      <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
        <j-form-item name="parentId" :label="$t('Save.index.101932-2')">
          <j-tree-select
            showSearch
            allowClear
            v-model:value="modelRef.parentId"
            :placeholder="$t('Save.index.101932-3')"
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
        <j-form-item :label="$t('Save.index.101932-4')">
          <RadioButton
            v-model:value="modelRef.properties.type"
            :options="[
              {
                label: $t('Save.index.101932-5'),
                value: 'builtin'
              },
              {
                label: $t('Save.index.101932-6'),
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
            :label="$t('Save.index.101932-7')"
            name="name"
            required
            :rules="[
                        {
                            required: true,
                            message: $t('Save.index.101932-8'),
                        },
                        {
                            max: 64,
                            message: $t('Save.index.101932-9'),
                        },
                        {
                            validator: vailName,
                            trigger: 'blur',
                        },
                    ]"
          >
            <j-input
              v-model:value="modelRef.name"
              :placeholder="$t('Save.index.101932-8')"
            />
          </j-form-item>
          <j-form-item
            :label="$t('Save.index.101932-10')"
            name="code"
            required
            :rules="[
                        {
                            required: true,
                            message: $t('Save.index.101932-11'),
                        },
                        {
                            validator: vailCode,
                            trigger: 'blur',
                        },
                    ]"
          >
            <j-input-number
              v-model:value="modelRef.code"
              style="width: 100%"
              :placeholder="$t('Save.index.101932-11')"
            />
          </j-form-item>
          <j-form-item
            :label="$t('Save.index.101932-12')"
          >
            <RadioButton
              v-model:value="modelRef.properties.partition"
              :options="[
              {
                label: $t('Save.index.101932-13'),
                value: 'none'
              },
              {
                label: $t('Save.index.101932-14'),
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
            <a-button v-if="!modelRef.geoJson" type="link" style="padding: 0" @click="showEditMap(false)">{{ $t('Save.index.101932-15') }}</a-button>
            <template v-else>
              <a-space>
                <span>{{ $t('Save.index.101932-16') }}</span>
                <a-button type="link" style="padding: 0" @click="showEditMap(true)">{{ $t('Save.index.101932-17') }}</a-button>
              </a-space>
            </template>
          </div>
          <div v-else-if="modelRef.properties.partition === 'geoJson'">
            <a-button v-if="!modelRef.geoJson" type="link" style="padding: 0" @click="geoJsonVisible = true">{{ $t('Save.index.101932-18') }}</a-button>
            <template v-else>
              <a-space>
                <span>{{ $t('Save.index.101932-19') }}</span>
                <a-button type="link" style="padding: 0" @click="geoJsonVisible = true">{{ $t('Save.index.101932-17') }}</a-button>
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
import {omit} from "lodash-es";
import {onlyMessage} from "@/utils/comm";
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

      if (newData.properties.sync) {
        const _syncChildren = syncChildren(newData.code, props.areaTree)

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
        ]
      }

      loading.value = true;

      const resp = await updateRegion(newData).finally(() => {
        loading.value = false;
      });
      if (resp.status === 200) {
        regionState.stateInit()
        onlyMessage($t('Save.index.101932-20'));
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
      return Promise.reject($t('Save.index.101932-21'));
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
      return Promise.reject($t('Save.index.101932-22'));
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
