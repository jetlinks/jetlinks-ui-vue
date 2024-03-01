<template>
    <!-- 导入 -->
    <j-modal
        :maskClosable="false"
        :visible="true"
        title="导入"
        okText="确定"
        cancelText="取消"
        @cancel="handleCancel"
    >
        <div style="margin-top: 10px">
            <j-form :layout="'vertical'" :model="modelRef" ref="formRef">
                <j-form-item label="文件格式">
                    <j-radio-group
                        button-style="solid"
                        v-model:value="modelRef.fileType"
                        placeholder="请选择文件格式"
                    >
                        <j-radio-button value="xlsx">xlsx</j-radio-button>
                        <!-- <j-radio-button value="csv">csv</j-radio-button> -->
                    </j-radio-group>
                </j-form-item>

                <j-form-item label="文件上传">
                    <j-upload
                        v-model:fileList="fileList"
                        name="file"
                        :action="FILE_UPLOAD"
                        :headers="{
                            'X-Access-Token': LocalStore.get(TOKEN_KEY),
                        }"
                        :maxCount="1"
                        :showUploadList="false"
                        @change="onChange"
                        :accept="
                            modelRef.fileType
                                ? `.${modelRef.fileType}`
                                : '.xlsx'
                        "
                        :before-upload="beforeUpload"
                    >
                        <j-button>
                            <template #icon
                                ><AIcon type="UploadOutlined"
                            /></template>
                            文件上传
                        </j-button>
                    </j-upload>
                </j-form-item>
            </j-form>
            <div style="margin-left: 20px">
                <j-space>
                    下载模板
                    <a @click="downFile('xlsx')">.xlsx</a>
                    <!-- <a @click="downFile('csv')">.csv</a> -->
                </j-space>
            </div>
        </div>
        <template #footer>
            <j-button type="primary" @click="handleCancel">关闭</j-button>
        </template>
    </j-modal>
</template>

<script setup lang="ts">
import { FILE_UPLOAD } from '@/api/comm';
import { TOKEN_KEY } from '@/utils/variable';
import { LocalStore, onlyMessage } from '@/utils/comm';
import {
    productTemplate,
    importProductProperty,
    modify,
} from '@/api/device/product';
import {
    instanceTemplate,
    importInsProperty,
    saveMetadataStats,
} from '@/api/device/instance';
import { downloadFileByUrl } from '@/utils/utils';
import { useInstanceStore } from '@/store/instance';
import { useProductStore } from '@/store/product';
const instanceStore = useInstanceStore();
const productStore = useProductStore();
const props = defineProps({
    type: {
        type: String,
        default: 'product',
    },
});
const emit = defineEmits(['close', 'save']);
const route = useRoute();
const formRef = ref(null);
const modelRef = reactive({
    upload: [],
    fileType: 'xlsx',
});

const fileList = ref();

const beforeUpload = (_file: any) => {
    const fileType = modelRef?.fileType === 'csv' ? 'csv' : 'xlsx';
    const isCsv = _file.type === 'text/csv';
    const isXlsx =
        _file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isCsv && fileType !== 'xlsx') {
        onlyMessage('请上传.csv格式文件', 'warning');
    }
    if (!isXlsx && fileType !== 'csv') {
        onlyMessage('请上传.xlsx格式文件', 'warning');
    }
    return (isCsv && fileType !== 'xlsx') || (isXlsx && fileType !== 'csv');
};

const handleCancel = () => {
    emit('close');
};

const onChange = async (e: any) => {
    const file = e?.file;
    const isDevice = props.type === 'device';
    const { id } = route.params || {};
    if (file.status === 'done') {
        const res: any = isDevice
            ? await importProductProperty(id, file.response.result)
            : await importInsProperty(id, file.response.result);
        if (res.status === 200) {
           
            const params = {
                    id,
                    metadata: res.result,
                };
            const resp = isDevice
                ? await saveMetadataStats(id, JSON.parse(res.result))
                : await modify(id, params);
            if (resp.status === 200) {
                onlyMessage('导入成功');
                isDevice ?
                    await instanceStore.refresh(id as string) : await productStore.getDetail(id as string);

            }
        } else {
            onlyMessage('导入失败', 'error');
        }
        emit('close');
    }
};

const downFile = async (type: string) => {
    const res: any =
        props.type === 'product'
            ? await productTemplate(route?.params?.id, modelRef.fileType)
            : await instanceTemplate(route?.params?.id, modelRef.fileType);
    if (res) {
        const blob = new Blob([res], { type: type });
        const url = URL.createObjectURL(blob);
        downloadFileByUrl(url, `物模型导入模板`, type);
    }
};
</script>

<style scoped lang="less">
.check-num {
    margin: 6px;
    color: @primary-color;
}
</style>
