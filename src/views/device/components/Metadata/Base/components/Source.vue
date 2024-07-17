<template>
  <div class="metadata-source">
    <a-select
      v-model:value="myValue"
      placeholder="请选择来源"
      style="flex: 1 1 0;min-width: 0"
      :options="PropertySource"
      :dropdownStyle="{
              zIndex: 1071
            }"
      :getPopupContainer="(node) => tableWrapperRef || node"
      :disabled="disabled"
      @change="onChange"
    >
    </a-select>
    <PopoverModal
      v-if="myValue != 'manual' && !showReset"
      v-model:visible="modalVisible"
      :bodyStyle="{
                width: '450px',
                height: myValue === 'rule' ? '300px' : '92px',
            }"
      placement="bottomRight"
      @ok="confirm"
    >
      <template #content>
        <j-scrollbar v-if="myValue">
          <div style="padding: 0 10px">
            <VirtualRule
              v-if="modalVisible"
              :source="myValue"
              :value="record"
              :isProduct="isProduct"
              :dataSource="dataSource"
              ref="virtualRuleRef"
            />
          </div>
        </j-scrollbar>
      </template>
      <a-button style="padding: 0" type="link" :disabled="disabled" @click="handleSearch">
        <template #icon>
          <AIcon type="EditOutlined"/>
        </template>
      </a-button>
    </PopoverModal>
    <j-dropdown
      v-if="myValue === 'rule' && target === 'device' && showReset"
      placement="bottom"
      trigger="click"
      :getPopupContainer="(node) => tableWrapperRef || node"
    >
      <a-button style="padding: 0" type="link" @click="handleSearch">
        <template #icon>
          <AIcon type="MoreOutlined"/>
        </template>
      </a-button>
      <template #overlay>
        <j-menu>
          <j-menu-item>
            <PopoverModal
              v-model:visible="modalVisible"
              :bodyStyle="{
                                width: '450px',
                                height: myValue === 'rule' ? '300px' : '80px',
                            }"
              placement="bottomRight"
              @ok="confirm"
            >
              <template #content>
                <j-scrollbar v-if="myValue">
                  <div style="padding: 0 10px">
                    <VirtualRule
                      :source="myValue"
                      :value="record"
                      :isProduct="isProduct"
                      :dataSource="dataSource"
                      ref="virtualRuleRef"
                    />
                  </div>
                </j-scrollbar>
              </template>
              <j-button style="padding: 4px 8px" type="link">
                编辑
              </j-button>
            </PopoverModal>
          </j-menu-item>
          <j-menu-divider/>
          <j-menu-item>
            <div style="display: flex;">
              <j-button style="padding: 4px 8px" type="link" @click="resetRules">
                重置
              </j-button>
              <j-tooltip>
                <template #title>重置为产品属性规则</template>
                <AIcon type="QuestionCircleOutlined" style="margin-top: 10px;"/>
              </j-tooltip>
            </div>
          </j-menu-item>
        </j-menu>
      </template>
    </j-dropdown>
  </div>
</template>

<script setup lang="ts" name="MetadataSource">
import {isNoCommunity} from '@/utils/utils';
import VirtualRule from './VirtualRule/index.vue';
import {Form} from 'jetlinks-ui-components';
import {useInstanceStore} from '@/store/instance';
import {queryDeviceVirtualProperty, resetRule} from '@/api/device/instance';
import {onlyMessage} from '@/utils/comm';
import {provide, Ref} from 'vue';
import {queryProductVirtualProperty} from '@/api/device/product';
import {useProductStore} from '@/store/product';
import {PopoverModal} from '@/components/Metadata/Table'
import {useTableWrapper} from "@/components/Metadata/Table/context";

const instanceStore = useInstanceStore();
const productStore = useProductStore();
const tableWrapperRef = useTableWrapper()

const PropertySource: { label: string; value: string }[] = isNoCommunity
  ? [
    {
      value: 'device',
      label: '设备',
    },
    {
      value: 'manual',
      label: '手动',
    },
    {
      value: 'rule',
      label: '规则',
    },
  ]
  : [
    {
      value: 'device',
      label: '设备',
    },
    {
      value: 'manual',
      label: '手动',
    },
  ];

type SourceType = 'device' | 'manual' | 'rule' | '';

type Emit = {
  (e: 'update:value', data: Record<string, any>): void;
};


const showReset = computed(() => {
  return myValue.value === 'rule' && props.target === 'device' && props.isProduct
})

const props = defineProps({
  value: {
    type: Object,
    default: () => {
    },
  },
  noEdit: {
    type: Array,
    default: () => [],
  },
  target: {
    type: String,
    default: undefined,
  },
  productNoEdit: {
    type: Array,
    default: []
  },
  record: {
    type: Object,
    default: () => ({})
  },
  disabled: {
    type: Boolean,
    default: false
  },
  isProduct: {
    type: Boolean,
    default: false
  }
});
provide('target', props.target)

const emit = defineEmits<Emit>();

const formItemContext = Form.useInjectFormItemContext();

const myValue = ref<SourceType>('');
const type = ref<string>('');
const virtualRuleRef = ref<any>(null);
const modalVisible = ref(false)
const expands = ref(props.value || {})
const dataSource = inject<Ref<any[]>>('metadataSource')

// const disabled = computed(() => {
//     // if (props.target === 'device') {
//     //     return true;
//     // }
//     return props.noEdit?.length
//         ? props.noEdit.includes(props.record.id) && props?.target === 'device'
//         : false;
// });

const updateValue = (data: any) => {
  console.log('updateValue',{
    ...(props.value || {}),
    ...data,
  })
  emit('update:value', {
    ...(props.value || {}),
    ...data,
  });
  formItemContext.onFieldChange();
};

const onChange = (keys: SourceType) => {
  myValue.value = keys;
  updateValue({
    source: keys,
    type: keys === 'manual' ? ['write'] : keys === 'rule' ? ['report'] : [],
  });
};

const confirm = async () => {
  const data = await virtualRuleRef?.value.onSave()
  if (data) {
    updateValue({
      ...expands.value,
      source: myValue.value,
      ...data,
    });
    modalVisible.value = false
  }
};
//重置规则
// const resetRules = async() =>{
//     let res:any =  await queryProductVirtualProperty(instanceStore.current?.productId,props.value.id)
//     if(res && res.status === 200 && res.result.rule){
//         const data:any = {}
//         data.virtualRule = res.result.rule
//         data.virtualRule.triggerProperties = res.result.triggerProperties
//         data.type = type.value
//         updateValue({
//             source:myValue.value,
//             ...data
//         })
//     }
// }
const resetRules = async () => {
  let res: any = await resetRule(instanceStore.current?.productId, instanceStore.current?.id, [props.record.id])
  if (res.status === 200) {
    onlyMessage('操作成功！')
  }
}
const cancel = () => {
  myValue.value = props.value?.source || '';
  type.value = props.value?.type || [];
}

const handleSearch = async () => {
  if (isNoCommunity && myValue.value === 'rule') {
    let resp: any = undefined;
    if (props.target === 'product') {
      resp = await queryProductVirtualProperty(
        productStore.current?.id,
        props.record.id,
      );
    } else {
      resp = await queryDeviceVirtualProperty(
        instanceStore.current?.productId,
        instanceStore.current?.id,
        props.record.id,
      );
    }
    if (resp && resp.status === 200 && resp.result) {
      const _triggerProperties = props.value?.virtualRule?.triggerProperties?.length ? props.value?.virtualRule?.triggerProperties : resp.result.triggerProperties
      updateValue({
        source: myValue.value,
        virtualRule: {
          triggerProperties: _triggerProperties?.length ? _triggerProperties : ['*'],
          ...resp.result.rule
        }
      });
    }
  }
};

watch(
  () => JSON.stringify(props.value),
  () => {
    if (!props.value?.source) {
      myValue.value = 'device';
    } else {
      myValue.value = props.value?.source || '';
    }
    expands.value = props.value
    type.value = props.value?.type || [];
  },
  {immediate: true},
);

</script>

<style scoped>
.metadata-source {
  display: flex;
  align-items: center;
}
</style>
