<template>
    <j-modal
        :maskClosable="false"
        width="800px"
        :visible="true"
        title="导出"
        @ok="handleOk"
        @cancel="handleCancel"
    >
        <div style="background-color: rgb(236, 237, 238)">
            <p style="padding: 10px">
                <AIcon type="ExclamationCircleOutlined" />
                选择单个产品时可导出其下属设备的详细数据,不选择产品时导出所有设备的基础数据。
            </p>
        </div>
        <div style="margin-top: 20px">
            <j-form :layout="'vertical'">
                <j-form-item label="产品">
                    <j-select
                        show-search
                        :filter-option="filterOption"
                        v-model:value="modelRef.product"
                        placeholder="请选择产品"
                        allowClear
                    >
                        <j-select-option
                            :value="item.id"
                            v-for="item in productList"
                            :key="item.id"
                            :label="item.name"
                            >{{ item.name }}</j-select-option
                        >
                    </j-select>
                </j-form-item>
                <j-form-item label="文件格式">
                    <j-radio-group
                        button-style="solid"
                        v-model:value="modelRef.fileType"
                        placeholder="请选择文件格式"
                    >
                        <j-radio-button value="xlsx">xlsx</j-radio-button>
                        <j-radio-button value="csv">csv</j-radio-button>
                    </j-radio-group>
                </j-form-item>
            </j-form>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import { queryNoPagingPost } from '@/api/device/product';
import { downloadFile } from '@/utils/utils';
import encodeQuery from '@/utils/encodeQuery';
import { BASE_API_PATH } from '@/utils/variable';
import { deviceExport } from '@/api/device/instance';

const emit = defineEmits(['close']);
const props = defineProps({
    data: {
        type: Object,
        default: undefined,
    },
});
const modelRef = reactive({
    product: undefined,
    fileType: 'xlsx',
});

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const productList = ref<Record<string, any>[]>([]);

watch(
    () => props.data,
    () => {
        queryNoPagingPost({ paging: false }).then((resp) => {
            if (resp.status === 200) {
                productList.value = resp.result as Record<string, any>[];
            }
        });
    },
    { immediate: true, deep: true },
);

const handleOk = () => {
    const params = encodeQuery(props.data);
    downloadFile(
        deviceExport(modelRef.product || '', modelRef.fileType),
        params,
    );
    emit('close');
};

const handleCancel = () => {
    emit('close');
};
</script>