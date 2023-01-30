<template>
    <a-modal :maskClosable="false" width="650px" :visible="true" title="新增" @ok="handleCancel" @cancel="handleCancel">
        <div style="margin-top: 10px">
            <a-form :layout="'vertical'">
                <a-row type="flex">
                    <a-col flex="180px">
                        <a-form-item required name="photoUrl">
                            <JUpload v-model:value="modelRef.photoUrl" />
                        </a-form-item>
                    </a-col>
                    <a-col flex="auto">
                        <a-form-item label="ID">
                            <a-input v-model:value="modelRef.id" placeholder="请输入ID" />
                        </a-form-item>
                        <a-form-item label="名称" required>
                            <a-input v-model:value="modelRef.name" placeholder="请输入名称" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item label="产品" required>
                    <a-select showSearch v-model:value="modelRef.productId" placeholder="请选择产品">
                        <a-select-option :value="item.id" v-for="item in productList" :key="item.id" :title="item.name"></a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="说明">
                    <a-textarea v-model:value="modelRef.describe" placeholder="请输入说明" />
                </a-form-item>
            </a-form>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import { queryNoPagingPost } from '@/api/device/product'
import { getImage } from '@/utils/comm';
import { Form } from 'ant-design-vue';

const emit = defineEmits(['close', 'save'])
const props = defineProps({
    data: {
        type: Object,
        default: undefined
    }
})
const productList = ref<Record<string, any>[]>([])
const useForm = Form.useForm;

const modelRef = reactive({
    productId: undefined,
    id: '',
    name: '',
    describe: '',
    photoUrl: getImage('/device/instance/device-card.png')
});

watch(
    () => props.data,
    () => {
        queryNoPagingPost({paging: false}).then(resp => {
            if(resp.status === 200){
                productList.value = resp.result as Record<string, any>[]
            }
        })
    },
    {immediate: true, deep: true}
)

const handleCancel = () => {
    emit('close')    
}
</script>