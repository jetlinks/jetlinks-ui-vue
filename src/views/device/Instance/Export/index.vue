<template>
    <j-modal
        :maskClosable="false"
        width="800px"
        :visible="true"
        :title="$t('Export.index.778931-0')"
        @ok="handleOk"
        @cancel="handleCancel"
    >
        <div style="background-color: rgb(236, 237, 238)">
            <p style="padding: 10px">
                <AIcon type="ExclamationCircleOutlined" />
                {{ $t('Export.index.778931-1') }}
            </p>
        </div>
        <div style="margin-top: 20px">
            <j-form :layout="'vertical'">
                <j-form-item :label="$t('Export.index.778931-2')">
                    <j-select
                        show-search
                        :filter-option="filterOption"
                        v-model:value="modelRef.product"
                        :placeholder="$t('Export.index.778931-3')"
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
                <j-form-item :label="$t('Export.index.778931-4')">
                    <j-radio-group
                        button-style="solid"
                        v-model:value="modelRef.fileType"
                        :placeholder="$t('Export.index.778931-5')"
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
import { downloadFileByUrl } from '@/utils/utils';
import { paramsEncodeQuery } from '@/utils/encodeQuery';
import { deviceExport , deviceExportPath} from '@/api/device/instance';
import { getToken } from '@/utils/comm';
import { TOKEN_KEY } from '@/utils/variable';
import { LocalStore, onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

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

const productName = computed(() => {
    console.log(modelRef.product);
    return productList.value.find(item => item.id === modelRef.product)?.name || ''
    // console.log(item.id);



})

const handleOk = async () => {
    const _params = paramsEncodeQuery(props.data);
    // downloadFile(
    //     deviceExport(modelRef.product || '', modelRef.fileType),
    //     params,
    // );
    // const res: any = await deviceExport(
    //     modelRef.product || '',
    //     modelRef.fileType,
    //     params
    //
    //
    // );
    // if (res) {
    //     // const blob = new Blob([res], { type: modelRef.fileType });
    //     // const url = URL.createObjectURL(blob);
    //     // downloadFileByUrl(url, `${productName.value ? (productName.value  + '下设备') : '设备实例'}`, modelRef.fileType);
    //
    // }
    const urlParams = new URLSearchParams()

    Object.keys(_params).forEach(key => {
      if (_params[key]) {
        urlParams.append(key, _params[key])
      }
    })
    const url =  modelRef.product ?  `${origin}/api/device-instance/${modelRef.product}/export.xlsx?:X_Access_Token=${LocalStore.get(TOKEN_KEY)}&${urlParams}` :  `${origin}/api/device-instance/export.xlsx?:X_Access_Token=${LocalStore.get(TOKEN_KEY)}&${urlParams}`
    window.open(url)
    emit('close');

};

const handleCancel = () => {
    emit('close');
};
</script>
