<template>
    <div class="function">
        <a-form 
            :layout="'vertical'"
            ref="formRef"
            :model="modelRef"
        >
            <a-row :gutter="24">
                <a-col :span="6">
                    <a-form-item name="messageType" :rules="{
                        required: true,
                        message: '请选择',
                    }">
                        <a-select placeholder="请选择" v-model:value="modelRef.messageType" show-search :filter-option="filterOption">
                            <a-select-option value="READ_PROPERTY">读取属性</a-select-option>
                            <a-select-option value="WRITE_PROPERTY">修改属性</a-select-option>
                            <a-select-option value="INVOKE_FUNCTION">调用功能</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="6" v-if="['READ_PROPERTY','WRITE_PROPERTY'].includes(modelRef.messageType)">
                    <a-form-item :name="['message', 'properties']" :rules="{
                        required: true,
                        message: '请选择属性',
                    }">
                        <a-select placeholder="请选择属性" v-model:value="modelRef.message.properties" show-search :filter-option="filterOption">
                            <a-select-option v-for="i in (metadata?.properties) || []" :key="i.id" :value="i.id" :label="i.name">{{i.name}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="6" v-if="modelRef.messageType === 'WRITE_PROPERTY'">
                    <a-form-item :name="['message', 'value']" :rules="{
                        required: true,
                        message: '请输入值',
                    }">
                        <a-input />
                    </a-form-item>
                </a-col>
                <a-col :span="6" v-if="modelRef.messageType === 'INVOKE_FUNCTION'">
                    <a-form-item :name="['message', 'functionId']" :rules="{
                        required: true,
                        message: '请选择功能',
                    }">
                        <a-select placeholder="请选择功能" v-model:value="modelRef.message.functionId" show-search :filter-option="filterOption" @change="funcChange">
                            <a-select-option v-for="i in (metadata?.functions) || []" :key="i.id" :value="i.id" :label="i.name">{{i.name}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="4">
                    <a-button type="primary" @click="saveBtn">发送</a-button>
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
    </div>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@/store/instance';
import EditTable from './EditTable.vue'

const instanceStore = useInstanceStore()

const formRef = ref();

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

type Emits = {
    (e: 'update:modelValue', data: any): void;
};
const emit = defineEmits<Emits>();

const modelRef = reactive({
    messageType: undefined,
    message: {
        properties: undefined,
        functionId: undefined,
        inputs: []
    }
})

const metadata = computed(() => {
    return JSON.parse(instanceStore.current?.metadata || '{}')
})

const funcChange = (val: string) => {
    if(val){
        const arr = metadata.value?.functions.find((item: any) => item.id === val)?.inputs || []
        const list = arr.map((item: any) => {
            return {
                id: item.id,
                name: item.name,
                value: undefined,
                valueType: item?.valueType?.type,
            }
        })
        modelRef.message.inputs = list
    }
}

const saveBtn = () => {
    formRef.value.validate()
    .then(() => {
        console.log(toRaw(modelRef))
    })
}

defineExpose({ saveBtn })


</script>

<style lang="less" scoped>
.function {
  padding: 15px;
  background-color: #e7eaec;
}
</style>