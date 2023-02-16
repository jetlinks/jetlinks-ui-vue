<template>
    <a-form 
        :layout="'vertical'"
        ref="formRef"
        :model="modelRef"
    >
        <a-row :gutter="24">
            <a-col :span="24" v-if="actionType === 'command'">
                <a-form-item name="messageType" label="指令类型" :rules="{
                    required: true,
                    message: '请选择指令类型',
                }">
                    <a-select placeholder="请选择指令类型" v-model:value="modelRef.messageType" show-search :filter-option="filterOption">
                        <a-select-option value="READ_PROPERTY">读取属性</a-select-option>
                        <a-select-option value="WRITE_PROPERTY">修改属性</a-select-option>
                        <a-select-option value="INVOKE_FUNCTION">调用功能</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="(modelRef.messageType === 'READ_PROPERTY' || actionType === 'latestData') ? 24 : 12" v-if="(actionType === 'command' && ['READ_PROPERTY','WRITE_PROPERTY'].includes(modelRef.messageType)) || actionType === 'latestData'">
                <a-form-item :name="['message', 'properties']" label="属性" :rules="{
                    required: true,
                    message: '请选择属性',
                }">
                    <a-select placeholder="请选择属性" v-model:value="modelRef.message.properties" show-search :filter-option="filterOption">
                        <a-select-option v-for="i in (metadata?.properties) || []" :key="i.id" :value="i.id" :label="i.name">{{i.name}}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="12" v-if="modelRef.messageType === 'WRITE_PROPERTY' && actionType === 'command'">
                <a-form-item :name="['message', 'value']" label="值" :rules="{
                    required: true,
                    message: '请输入值',
                }">
                    <a-input />
                </a-form-item>
            </a-col>
            <a-col :span="24" v-if="modelRef.messageType === 'INVOKE_FUNCTION'">
                <a-form-item :name="['message', 'functionId']" label="功能" :rules="{
                    required: true,
                    message: '请选择功能',
                }">
                    <a-select placeholder="请选择功能" v-model:value="modelRef.message.functionId" show-search :filter-option="filterOption" @change="funcChange">
                        <a-select-option v-for="i in (metadata?.functions) || []" :key="i.id" :value="i.id" :label="i.name">{{i.name}}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="24" v-if="modelRef.messageType === 'INVOKE_FUNCTION' && modelRef.message.functionId">
                <a-form-item :name="['message', 'inputs']" label="参数列表" :rules="{
                    required: true,
                    message: '请输入参数列表',
                }">
                    <EditTable v-model="modelRef.message.inputs"/>
                </a-form-item>
            </a-col>
        </a-row>
    </a-form>
</template>

<script lang="ts" setup>
import EditTable from './EditTable.vue'

const formRef = ref();

const funcList = ref<Record<string, any>[]>([])

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const props = defineProps({
    actionType: {
        type: String,
        default: ''
    },
    modelValue: {
        type: Object,
        default: () => {}
    },
    metadata: {
        type: Object,
        default: () => {
            return {
                properties: [],
                functions: []
            }
        }
    }
})

type Emits = {
    (e: 'update:modelValue', data: any): void;
};
const emit = defineEmits<Emits>();

const modelRef = computed({
    get: () => {
        return props.modelValue || {
            messageType: undefined,
            message: {
                properties: undefined,
                functionId: undefined,
                inputs: []
            }
        }
    },
    set: (val: any) => {
        emit('update:modelValue', val);
    }
})

const funcChange = (val: string) => {
    if(val){
        const arr = props.metadata?.functions.find((item: any) => item.id === val)?.inputs || []
        const list = arr.map((item: any) => {
            return {
                id: item.id,
                name: item.name,
                value: undefined,
                valueType: item?.valueType?.type,
            }
        })
        modelRef.value.message.inputs = list
    }
}

const saveBtn = () => new Promise((resolve) => {
    formRef.value.validate()
    .then(() => {
        resolve(toRaw(modelRef))
    })
    .catch((err: any) => {
        resolve(false)
    });
})

defineExpose({ saveBtn })

</script>