<template>
    <!-- 导入 -->
    <a-modal
        :maskClosable="false"
        :visible="true"
        title="导入"
        okText="确定"
        cancelText="取消"
        @ok="handleCancel"
        @cancel="handleCancel"
    >
        <div style="margin-top: 10px">
            <a-form :layout="'vertical'">
                <a-form-item label="平台对接" required>
                    <a-select
                        showSearch
                        v-model:value="modelRef.configId"
                        :options="configList"
                        placeholder="请选择平台对接"
                    >
                    </a-select>
                </a-form-item>

                <a-form-item v-if="modelRef.configId" label="文件格式">
                    <a-radio-group
                        button-style="solid"
                        v-model:value="modelRef.fileType"
                        placeholder="请选择文件格式"
                    >
                        <a-radio-button value="xlsx">xlsx</a-radio-button>
                        <a-radio-button value="csv">csv</a-radio-button>
                    </a-radio-group>
                </a-form-item>

                <a-form-item label="文件上传" v-if="modelRef.configId">
                    <a-upload
                        v-model:fileList="modelRef.upload"
                        name="file"
                        :action="FILE_UPLOAD"
                        :headers="{
                            'X-Access-Token': LocalStore.get(TOKEN_KEY),
                        }"
                        :accept="`.${modelRef.fileType || 'xlsx'}`"
                        :showUploadList="false"
                        @change="fileChange"
                    >
                        <a-button :loading="loading">
                            <template #icon>
                                <AIcon type="UploadOutlined" />
                            </template>
                            文件上传
                        </a-button>
                    </a-upload>
                </a-form-item>
                <a-form-item v-if="modelRef.configId" label="下载模板">
                    <a-space>
                        <a-button icon="file" @click="downFileFn('xlsx')">
                            .xlsx
                        </a-button>
                        <a-button icon="file" @click="downFileFn('csv')">
                            .csv
                        </a-button>
                    </a-space>
                </a-form-item>
                <div v-if="totalCount">
                    <a-icon class="check-num" type="check" /> 已完成 总数量
                    <span class="check-num">{{ totalCount }}</span>
                </div>
                <div v-if="errCount">
                    <a-icon class="check-num" style="color: red" type="close" />
                    失败 总数量
                    <span class="check-num">{{ errCount }}</span>
                </div>
            </a-form>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
import { FILE_UPLOAD } from '@/api/comm';
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable';
import { LocalStore } from '@/utils/comm';
import { downloadFile } from '@/utils/utils';
import { queryPlatformNoPage, _import } from '@/api/iot-card/cardManagement';
import { message } from 'ant-design-vue';

const emit = defineEmits(['close']);

const configList = ref<Record<string, any>[]>([]);
const loading = ref<boolean>(false);
const totalCount = ref<number>(0);
const errCount = ref<number>(0);

const modelRef = reactive({
    configId: undefined,
    upload: [],
    fileType: 'xlsx',
});

const getConfig = async () => {
    const resp: any = await queryPlatformNoPage({
        paging: false,
        terms: [
            {
                terms: [
                    {
                        column: 'state',
                        termType: 'eq',
                        value: 'enabled',
                        type: 'and',
                    },
                ],
            },
        ],
    });
    configList.value = resp.result.map((item: any) => {
        return { key: item.id, label: item.name, value: item.id };
    });
};

const fileChange = (info: any) => {
    loading.value = true;
    if (info.file.status === 'done') {
        const r = info.file.response || { result: '' };
        _import(modelRef.configId, { fileUrl: r.result })
            .then((resp: any) => {
                totalCount.value = resp.result.total;
                message.success('导入成功');
            })
            .catch((err) => {
                message.error(err.response.data.message || '导入失败');
            })
            .finally(() => {
                loading.value = false;
            });
    }
};

const downFileFn = (type: string) => {
    const url = `${BASE_API_PATH}/network/card/template.${type}`;
    downloadFile(url);
};

const handleCancel = () => {
    totalCount.value = 0;
    errCount.value = 0;
    modelRef.configId = undefined;
    emit('close', true);
};

getConfig();
</script>

<style scoped lang="less">
.check-num {
    margin: 6px;
    color: @primary-color;
}
</style>
