<template>
    <div class="metadata-source">
        <j-select
            v-model:value="myValue"
            :options="PropertySource"
            placeholder="请选择来源"
            :disabled="disabled"
            :get-popup-container="(node) => fullRef || node"
            @change="onChange"
        >
        </j-select>
        <j-popconfirm-modal
            v-if="myValue != 'manual' && !showReset"
            :bodyStyle="{
                width: '450px',
                height: myValue === 'rule' ? '300px' : '80px',
            }"
            :get-popup-container="(node) => fullRef || node"
            placement="bottomRight"
            @confirm="confirm"
            @visibleChange="visibleChange"
        >
            <template #content>
                <j-scrollbar v-if="myValue">
                    <div style="padding: 0 10px">
                        <VirtualRule
                            v-if="visible"
                            :value="value"
                            :source="myValue"
                            :dataSource="dataSource"
                            ref="virtualRuleRef"
                        />
                    </div>
                </j-scrollbar>
            </template>
            <j-button style="padding: 4px 8px" type="link">
                <AIcon type="EditOutlined" />
            </j-button>
        </j-popconfirm-modal>
        <j-dropdown v-if="myValue === 'rule' && target === 'device' && showReset" :getPopupContainer="(triggerNode) => triggerNode.parentNode">
            <span style="width: 20px;" @click.prevent>
                <AIcon type="MoreOutlined" />
            </span>
            <template #overlay>
                <j-menu>
                    <j-menu-item>
                        <j-popconfirm-modal
                            :bodyStyle="{
                                width: '450px',
                                height: myValue === 'rule' ? '300px' : '80px',
                            }"
                            :get-popup-container="(node) => fullRef || node"
                            placement="bottomRight"
                            @confirm="confirm"
                            @visibleChange="visibleChange"
                        >
                            <template #content>
                                <j-scrollbar v-if="myValue">
                                    <div style="padding: 0 10px">
                                        <VirtualRule
                                            v-if="visible"
                                            :value="value"
                                            :source="myValue"
                                            :dataSource="dataSource"
                                            ref="virtualRuleRef"
                                        />
                                    </div>
                                </j-scrollbar>
                            </template>
                            <j-button style="padding: 4px 8px" type="link">
                                编辑
                            </j-button>
                        </j-popconfirm-modal>
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
import { isNoCommunity } from '@/utils/utils';
import VirtualRule from './VirtualRule/index.vue';
import { Form } from 'jetlinks-ui-components';
import { FULL_CODE } from 'jetlinks-ui-components/es/DataTable'
import { useInstanceStore } from '@/store/instance';
import { resetRule } from '@/api/device/instance';
import { updata } from '@/api/rule-engine/configuration';
import { onlyMessage } from '@/utils/comm';
import { provide } from 'vue';
const instanceStore = useInstanceStore();
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

const fullRef = inject(FULL_CODE);
const showReset = ref(false);
const props = defineProps({
    value: {
        type: Object,
        default: () => {},
    },
    dataSource: {
        type: Array,
        default: () => [],
    },
    noEdit: {
        type: Array,
        default: () => [],
    },
    target: {
        type: String,
        default: undefined,
    },
    productNoEdit:{
        type:Array,
        default: []
    }
});
provide('target',props.target)
const emit = defineEmits<Emit>();
const formItemContext = Form.useInjectFormItemContext();

const myValue = ref<SourceType>('');
const type = ref<string>('');
const virtualRuleRef = ref<any>(null);
const visible = ref(false)

const visibleChange = (e: boolean) => {
    visible.value = e
}

const disabled = computed(() => {
    // if (props.target === 'device') {
    //     return true;
    // }
    return props.noEdit?.length
        ? props.noEdit.includes(props.value.id) && props?.target === 'device'
        : false;
});

const updateValue = (data: any) => {
    emit('update:value', {
        ...props.value,
        expands: {
            ...(props.value?.expands || {}),
            ...data,
        },
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
    return new Promise(async (resolve, reject) => {
        const data = await virtualRuleRef?.value.onSave().catch(() => {
            reject();
        });
        if (data) {
            updateValue({
                source: myValue.value,
                ...data,
            });
            resolve(true);
        } else {
            reject();
        }
    });
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
const resetRules = async() =>{
    let res:any = await resetRule(instanceStore.current?.productId,instanceStore.current?.id,props.value?.id)
    if(res.status === 200){
        onlyMessage('操作成功！')
    }
}
const cancel = () => {
    if (props.value.id && !props.value?.expands?.source) {
        myValue.value = 'device';
      } else {
        myValue.value = props.value?.expands?.source || '';
      }
        type.value = props.value?.expands?.type || [];
}

watch(
    () => props.value,
    () => {
      if (props.value.id && !props.value?.expands?.source) {
        myValue.value = 'device';
      } else {
        myValue.value = props.value?.expands?.source || '';
      }
        type.value = props.value?.expands?.type || [];
    },
    { immediate: true },
);
onMounted(()=>{
    if(props.target === 'device'){
        props.productNoEdit?.id?.forEach((item:any)=>{
        item === props.value?.id ? showReset.value = true : ''
    })
    }
})
</script>

<style scoped>
.metadata-source {
    display: flex;
    align-items: center;
}
</style>