<template>
    <j-modal
        title="下发"
        visible
        width="50%"
        @cancel="emit('close')"
    >
        <j-form :model="formData" ref="formRef" layout="vertical" :rules="rules">
            <div v-show="current === 1">
                <j-form-item label="名称" name="name">
                    <j-input v-model:value="formData.name" placeholder="请输入任务名称"></j-input>
                </j-form-item>
                <j-form-item label="网关设备选择方式">
                    <j-card-select v-model:value="chooseType" :options="options"></j-card-select>
                </j-form-item>
            </div>
            <GatewayDevice v-if="current !== 1" v-model:value="deviceList"/>
        </j-form>
        <template #footer>
            <div style="display: flex;justify-content: space-between">
                <div>
                    <j-button v-if="current !== 1" @click="current = 1">上一步</j-button>
                </div>
                <j-space>
                    <j-button @click="emit('close')">取消</j-button>
                    <j-button v-if="current === 1" type="primary" @click="handleSubmit">下一步</j-button>
                    <j-button v-else type="primary" @click="handleSubmit">确定</j-button>
                </j-space>
            </div>
        </template>
    </j-modal>
</template>

<script setup lang="ts">
import GatewayDevice from './GatewayDevice.vue';
import { onlyMessage } from "@/utils/comm";
import { createTask } from '@/api/edge-resource/index'

const emit = defineEmits(['close']);
const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    }
})
const current = ref(1);
const chooseType = ref('device');
const formRef = ref();
const deviceList = ref<Record<string, any>[]>([]);
const formData = ref<Record<string, any>>({
    name: undefined,
    type: 'resourceIssue',
    deviceId: [],
    targetId: props.data.targetId,
})

const rules = {
    name: [
        {required: true, message: '请输入任务名称', trigger: 'blur'},
        {max: 64, message: '最多输入64个字符', trigger: 'change'},
    ],
}

const options = [
    {label: '按设备选择', value: 'device'},
    {label: '更多方式', value: 'more', disabled: true},
]

const handleSubmit = () => {
    formRef.value?.validate().then(async () => {
        if (current.value === 1) {
            if(!formData.value.name) {
                return
            }
            current.value += 1
        } else if (current.value === 2) {
            if(!deviceList.value.length) {
                return onlyMessage('请选择网关设备', 'error');
            }
            const data = {
                ...formData.value,
                deviceId: deviceList.value.map(item => item.id),
                data: {
                    issueInfo: deviceList.value.map(item => {
                        return {
                            deviceId: item.id,
                            deviceName: item.name,
                            entityTemplates: [props.data],
                        }
                    })
                }
            }
            const res = await createTask(data);
            if(res.success) {
                onlyMessage('操作成功');
                emit('close');
            }
        }
    });

}
</script>

<style scoped lang="less">

</style>