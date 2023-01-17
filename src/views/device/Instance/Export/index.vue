<template>
    <a-modal :maskClosable="false" width="800px" :visible="true" title="导出" @ok="handleOk" @cancel="handleCancel">
        <div style="background-color: rgb(236, 237, 238)">
            <p style="padding: 10px">
                <AIcon type="ExclamationCircleOutlined" />
                选择单个产品时可导出其下属设备的详细数据,不选择产品时导出所有设备的基础数据。
            </p>
        </div>
        <div style="margin-top: 20px">
            <a-form :layout="'vertical'">
                <a-form-item label="产品">
                    <a-select showSearch v-model:value="modelRef.product" placeholder="请选择产品">
                        <a-select-option :value="item.id" v-for="item in productList" :key="item.id" :title="item.name"></a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="文件格式">
                    <a-radio-group button-style="solid" v-model:value="modelRef.fileType" placeholder="请选择文件格式">
                        <a-radio-button value="xlsx">xlsx</a-radio-button>
                        <a-radio-button value="csv">csv</a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </a-form>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import { queryNoPagingPost } from '@/api/device/product'
import { downloadFile } from '@/utils/utils'
import encodeQuery from '@/utils/encodeQuery'
import { BASE_API_PATH } from '@/utils/variable'

const emit = defineEmits(['close'])
const props = defineProps({
    data: {
        type: Object,
        default: undefined
    }
})
const modelRef = reactive({
    product: undefined,
    fileType: 'xlsx'
});

const productList = ref<Record<string, any>[]>([])

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

const handleOk = () => {
    const params = encodeQuery(props.data);
    if(modelRef.product){
        downloadFile(
        `${BASE_API_PATH}/device/instance/${modelRef.product}/export.${modelRef.fileType}`,
        params
      );
    } else {
        downloadFile(`${BASE_API_PATH}/device/instance/export.${modelRef.fileType}`, params);
    }
     emit('close')
}

const handleCancel = () => {
    emit('close')    
}
</script>