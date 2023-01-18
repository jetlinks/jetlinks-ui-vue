<template>
    <a-modal :maskClosable="false" width="800px" :visible="true" title="导入" @ok="handleCancel" @cancel="handleCancel">
        <div style="margin-top: 10px">
            <a-form :layout="'vertical'">
                <a-row>
                    <a-col span="24">
                        <a-form-item label="产品" required>
                            <a-select showSearch v-model:value="modelRef.product" placeholder="请选择产品">
                                <a-select-option :value="item.id" v-for="item in productList" :key="item.id" :title="item.name"></a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col span="24">
                        <a-form-item label="文件格式" v-if="modelRef.product">
                            <FileFormat v-model="modelRef.file" />
                        </a-form-item>
                    </a-col>
                    <a-col span="12">
                        <a-form-item label="文件上传" v-if="modelRef.product">
                            <NormalUpload :product="modelRef.product" v-model="modelRef.upload" :file="modelRef.file" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import { queryNoPagingPost } from '@/api/device/product'
import { Form } from 'ant-design-vue';

const emit = defineEmits(['close'])
const props = defineProps({
    data: {
        type: Object,
        default: undefined
    }
})
const productList = ref<Record<string, any>[]>([])
const useForm = Form.useForm;

const modelRef = reactive({
    product: undefined,
    upload: [],
    file: {
        fileType: 'xlsx',
        autoDeploy: false,
    }
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