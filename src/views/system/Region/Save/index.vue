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
        <j-form-item label="内置行政区" v-if="modelRef.properties.type === 'builtin'">
          <BuildIn
              v-model:value="modelRef.code"
              v-model:children="modelRef.children"
              v-model:name="modelRef.name"
              :areaTree="areaTree"
          />
        </j-form-item>
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
                        {
                            validator: vailName,
                            trigger: 'blur',
                        },
                    ]"
        >
          <j-input
              v-model:value="modelRef.name"
              placeholder="请输入区域名称"
          />
        </j-form-item>
        <j-form-item
            label="行政区划代码"
            name="code"
            required
            :rules="[
                        {
                            required: true,
                            message: '请输入行政区划代码',
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
              :disabled="modelRef.properties.type === 'builtin'"
              placeholder="请输入行政区划代码"
          />
        </j-form-item>
      </j-form>
    </div>
  </j-modal>
</template>

<script lang="ts" setup name="Save">
import {ref, watch, reactive} from 'vue';
import type {PropType} from 'vue';
import BuildIn from './BuildIn.vue';
import {
  validateName,
  validateCode,
  updateRegion,
} from '@/api/system/region';
import {omit} from "lodash-es";
import {onlyMessage} from "@/utils/comm";

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

const formRef = ref();

const init = {
  parentId: undefined,
  id: undefined,
  name: undefined,
  code: undefined,
  features: undefined,
  children: [],
  properties: {
    type: 'builtin',
  },
  sortIndex: props.data.sortIndex || 1
};

const modelRef = reactive(init);

watch(
    () => props.data,
    () => {
      Object.assign(modelRef, {});
      if (props.mode === 'add') {
        // 添加子
        Object.assign(modelRef, {
          ...init,
          ...props.data,
        });
      } else if (props.mode === 'edit') {
        // 编辑
        Object.assign(modelRef, props.data);
      } else {
        Object.assign(modelRef, init);
      }
    },
    {immediate: true, deep: true},
);

const handleCancel = (data: any) => {
  emit('close', data);
};

const traceEdit = () => {
  const newData: any = {
    ...props.data,
    ...modelRef,
  }

  handleCancel(newData)
}

const treeSelect = (id: string, label: string, extra: any) => {
  let children: any[]
  if (extra) {
    children = extra?.triggerNode?.props.children || []
  } else {
    children = props.treeData
  }
  const lastItem = children.length ? children[children.length-1] : {}
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

        const arr = areaList.value.map(item=>item.code)

        if (newData.children?.length) {
          newData.children = newData.children.map(item => {
            if (!item.fullName) {
              item.fullName = newData.fullName + item.name
            }
            item = {
              ...item,
              children: []
            }
            return item
          }).filter(item =>!arr.includes(item.code))
        }
        loading.value = true;
        const resp = await updateRegion(newData).finally(() => {
          loading.value = false;
        });
        if (resp.status === 200) {
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

watch(() => JSON.stringify(props.treeData), () => {
  const item = JSON.parse(JSON.stringify(props.treeData))
  areaList.value = item
  if(props.mode === 'add'){
    modelRef.children = props.areaTree?.[0]?.children
  }
}, {immediate: true})
</script>
