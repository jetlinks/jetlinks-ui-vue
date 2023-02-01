<template>
    <a-drawer placement="right" :closable="false" :visible="true">
        <template #title>
            <div
                style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                "
            >
                <span
                    ><AIcon
                        type="CloseOutlined"
                        style="margin-right: 5px"
                        @click="onClose"
                    />编辑配置</span
                >
                <a-button type="primary" @click="saveBtn">保存</a-button>
            </div>
        </template>
        <a-form layout="vertical" ref="formRef" :model="modelRef">
            <template v-for="(item, index) in props.config" :key="index">
                <a-form-item
                    :name="item.property"
                    v-for="i in item.properties"
                    :key="i.property"
                >
                    <template #label>
                        <span style="margin-right: 5px">{{ i.name }}</span>
                        <a-tooltip v-if="i.description" :title="i.description"
                            ><AIcon type="QuestionCircleOutlined"
                        /></a-tooltip>
                    </template>
                    <ValueItem
                        v-model:modelValue="modelRef[i.property]"
                        :itemType="i.type.type"
                        :options="
                            i.type.type === 'enum'
                                ? (i.type?.elements || []).map((item) => {
                                      return {
                                          label: item?.text,
                                          value: item?.value,
                                      };
                                  })
                                : undefined
                        "
                    />
                </a-form-item>
            </template>
        </a-form>
    </a-drawer>
</template>

<script lang="ts" setup>
import { modify } from '@/api/device/instance';
import { useInstanceStore } from '@/store/instance';
import { message } from 'ant-design-vue';

const emit = defineEmits(['close', 'save']);

const formRef = ref();
const modelRef = reactive({});

const instanceStore = useInstanceStore();

const props = defineProps({
    config: {
        type: Array,
        default: []
    }
})

watchEffect(() => {
    const obj = instanceStore.current?.configuration
    if(obj && Object.keys(obj).length) {
        (props?.config || []).map((item: any) => {
            if(Array.isArray(item.properties) && item?.properties.length){
                item.properties.map((i: any) => {
                    modelRef[i.property] = obj[i.property]
                })
            }
        })
    }

})

const onClose = () => {
    emit('close');
    formRef.value.resetFields();
};

const saveBtn = () => {
    formRef.value.validate().then(async () => {
        const values = toRaw(modelRef);
        const resp = await modify(instanceStore.current?.id || '', {
            id: instanceStore.current?.id,
            configuration: { ...values }
        })
        if(resp.status === 200){
            message.success('操作成功！')
            emit('save');
        }
    });
};
</script>