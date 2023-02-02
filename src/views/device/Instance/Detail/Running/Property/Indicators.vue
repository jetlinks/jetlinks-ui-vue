<template>
    <a-modal 
        :maskClosable="false"
        :visible="true"
        title="编辑指标"
        @ok="handleSave"
        @cancel="handleCancel"
        :confirmLoading="loading"
    >
        <a-alert message="场景联动页面可引用指标配置触发条件" type="warning" showIcon />
        <a-form layout="vertical" ref="formRef" :model="modelRef" style="margin-top: 20px">
            <template v-for="(item, index) in modelRef.metrics" :key="index">
                <a-row type="flex" justify="space-between" align="bottom">
                    <a-col :span="11">
                        <a-form-item 
                            :rules="{
                                required: true,
                                message: `请${['date', 'boolean'].includes(data?.valueType?.type)? '选择': '输入'}指标值`,
                            }" 
                            :name="['metrics', index, 'value', 0]" 
                            :label="item?.name || '指标值'"
                        >
                            <ValueItem
                                v-model:modelValue="item.value[0]"
                                :itemType="data.valueType?.type"
                                :options="
                                    data.valueType?.type === 'boolean'
                                        ? [
                                            {
                                                label: data.valueType?.trueText,
                                                value: String(data.valueType?.trueValue),
                                            },
                                            {
                                                label: data.valueType?.falseText,
                                                value: String(data.valueType?.falseValue),
                                            },
                                        ]
                                        : undefined
                                "
                            />
                        </a-form-item>
                    </a-col>
                    <template v-if="item.range">
                        <a-col><div class="center-icon">~</div></a-col>
                        <a-col :span="11">
                            <a-form-item 
                                :name="['metrics', index, 'value', 1]" 
                                :rules="{
                                    required: true,
                                    message: `请${['date', 'boolean'].includes(data?.valueType?.type)? '选择': '输入'}指标值`,
                                }" 
                            >
                                <ValueItem
                                    v-model:modelValue="item.value[1]"
                                    :itemType="data.valueType?.type"
                                />
                            </a-form-item>
                        </a-col>
                    </template>
                </a-row>
            </template>
        </a-form>
    </a-modal> 
</template>

<script lang="ts" setup>
import { queryMetric, saveMetric } from '@/api/device/instance'
const emit = defineEmits(['close']);
import { useInstanceStore } from "@/store/instance"
import { message } from 'ant-design-vue';

const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    }
})

const loading = ref<boolean>(false)
const instanceStore = useInstanceStore()
const formRef = ref();

const modelRef = reactive({
    metrics: []
});

const handleCancel = () => {
    emit('close')
}

watch(() => props.data.id, (newVal) => {
    if(newVal && instanceStore.current.id){
        queryMetric(instanceStore.current.id, props.data.id).then(resp => {
            if (resp.status === 200) {
          if (Array.isArray(resp?.result) && resp?.result.length) {
            const list = resp?.result.map((item: any) => {
                const val = Array.isArray(item?.value) ? [item?.value] : item?.value?.split(',')
              return {
                ...item,
                value: val
              };
            });
            modelRef.metrics = list as any
          } else {
            const type = props.data.valueType?.type;
            if (type === 'boolean') {
              const list = props.data.expands?.metrics.map((item: any) => {
                const value = (item?.value || {}).map((i: any) => String(i)) || {};
                return {
                  ...item,
                  value,
                };
              });
                modelRef.metrics = list || []
            } else {
                modelRef.metrics = props.data.expands?.metrics || []
            }
          }
        }
        })
    }
}, {immediate: true, deep: true})

const handleSave = () => {
    formRef.value
        .validate()
        .then(async () => {
            loading.value = true;
            const list = (toRaw(modelRef)?.metrics || []).map((item: any) => {
                return {
                    ...item,
                    value: item.value.join(','),
                };
            });
            const resp = await saveMetric(instanceStore.current.id || '', props.data.id || '', list).finally(() => {
                loading.value = false
            })
            if (resp.status === 200) {
                message.success('操作成功！');
                emit('close')
                formRef.value.resetFields();
            }
        })
        .catch((err: any) => {
            console.log('error', err);
        });
}
</script>

<style lang="less" scoped>
.center-icon {
    height: 86px;
    display: flex;
    align-items: center;
}
</style>