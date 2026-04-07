<template>
    <j-permission-button
        type="primary"
        key="import"
        ghost
        :disabled="disabled"
        :hasPermission="`${permission}:update`"
        :tooltip="{
            title: disabled
                ? $t('Base.Base.640395-5')
                : '',
        }"
        @click="showImport"
    >
      <template #icon>
        <AIcon type="DownloadOutlined" />
      </template>
      {{ $t('Import.Import.317604-0') }}
    </j-permission-button>
    <a-modal
        v-if="visible"
        open
        :title="$t('Import.Import.317604-1')"
        :width="600"
        :keyboard="false"
        :maskClosable="false"
        :okButtonProps="{
            disabled: !successCount,
        }"
        :getContainer="modalContainer"
        @cancel="onCancel"
        @ok="onOk"
    >
        <a-form layout="vertical">
            <a-form-item :label="$t('Import.Import.317604-2')">
                <a-upload-dragger
                    name="file"
                    :headers="getUploadHeaders()"
                    :maxCount="1"
                    :accept="'.xlsx,.csv'"
                    :showUploadList="showUploadList"
                    :before-upload="beforeUpload"
                    @change="uploadChange"
                    @reject="onReject"
                    @drop="handleDrop"
                >
                    <div class="dragger-box">
                      <div>
                        <AIcon class="icon" type="PlusCircleFilled" />
                      </div>
                        <span style="margin: 16px 0 8px 0"
                        >{{ $t('Import.Import.317604-3') }}</span
                        >
                        <span>{{ $t('Import.Import.317604-4') }}</span>
                    </div>
                    <template #itemRender="{ file }">
                        <a-space>{{ file.name }}</a-space>
                    </template>
                </a-upload-dragger>
            </a-form-item>
            <a-form-item :label="$t('Import.Import.317604-5')">
                <div class="file-download">
                    <a-button class="btn" @click="downFile('xlsx')"
                    >{{ $t('Import.Import.317604-6') }}</a-button
                    >
                    <a-button class="btn" @click="downFile('csv')"
                    >{{ $t('Import.Import.317604-7') }}</a-button
                    >
                </div>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup name="MetadataImport">
import {TOKEN_KEY_URL} from '@jetlinks-web/constants';
import {getToken, onlyMessage, downloadFileByUrl} from '@jetlinks-web/utils';
import {validate} from './util'
import {getUploadHeaders, isFullScreen} from '@jetlinks-web-core/utils'
import { getTemplate, uploadAnalyzeMetadata} from '../../../../../../../api/instance'
import {getTemplate as getProductTemplate} from '../../../../../../../api/product'
import {useGroupActive, useTableWrapper} from "../../../../../../../components/Metadata/context";
import { useProductStore } from '../../../../../../../store/product';
import { useInstanceStore } from '@device-manager-ui/store/instance';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const props = defineProps({
    target: {
        type: String,
        default: undefined,
    },
    metadata: {
        type: Array,
        default: () => [],
    },
    type: {
      type: String,
      default: undefined,
    },
  disabled: {
      type: Boolean,
      default: false,
    },
  permission: {
    type: [String, Array],
    default: undefined,
  },
});

const emit = defineEmits(['ok']);
const { current } = props.target === 'product' ? useProductStore() : useInstanceStore();
const visible = ref(false);
const successCount = ref(0);
const errorCount = ref(0);
const showUploadList = ref(false);
const groupActive = useGroupActive();
const tableWrapperRef = useTableWrapper();

let submitMetadata = [];

const route = useRoute();

const modalContainer = (e) => {
    if (isFullScreen()) {
        return tableWrapperRef.value || document.body;
    }
    return document.body;
};

const init = () => {
    showUploadList.value = false;
    successCount.value = 0;
    errorCount.value = 0;
};

const showImport = () => {
    init();
    visible.value = true;
};

const onCancel = () => {
    visible.value = false;
};

const submitData = async (metadataStr) => {
    successCount.value = 0;
    errorCount.value = 0;
    if (metadataStr) {
        showUploadList.value = true;
        const _metadataObject = JSON.parse(metadataStr || '{}');
        const properties = _metadataObject.properties;
        const _metadata = props.metadata.filter(
            (item) => item.id //&& !item.expands?.isProduct,
        );
        const result = properties.map((item) => {
            if (item.expands) {
                item.expands.groupId = groupActive.value;
                item.expands.groupName = groupActive.label;
            } else {
                item.expands = {
                    groupId: groupActive.value,
                    groupName: groupActive.label,
                };
            }
            return item;
        });

        submitMetadata = validate(result, _metadata, (validate) => {
            if (validate) {
                successCount.value += 1;
            } else {
                errorCount.value += 1;
            }
        });
        console.log(submitMetadata, 'submitMetadata')
    } else {
        onlyMessage($t('Import.Import.317604-8'), 'error');
        showUploadList.value = false;
    }
};

const onOk = () => {
    onlyMessage($t('Import.Import.317604-9'));
    emit('ok', submitMetadata);
    visible.value = false;
};

const onReject = () => {
    init();
    onlyMessage($t('Import.Import.317604-10'), 'warning');
};

const downFile = (type) => {
    const url =
        props.target === 'device'
            ? getTemplate(route.params.id, type)
            : getProductTemplate(route.params.id, type);

    downloadFileByUrl(
        url + `?${TOKEN_KEY_URL}=${getToken()}`,
        $t('Import.Import.317604-11'),
        type,
    );
};

const handleDrop = () => {};

const handleError = () => {
    onlyMessage($t('Import.Import.317604-12'), 'error');
    init();
};

const beforeUpload = (file) => {
    const isCsv = file.type === 'text/csv';
    const isXlsx =
        file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isCsv && !isXlsx) {
        onReject();
    } else {
        const formData = new FormData();
        formData.append('file', file);
        uploadAnalyzeMetadata(props.target === 'product' ? current?.id : current.productId, formData)
            .then((res) => {
                if (res.success) {
                    submitData(res.result);
                } else {
                    handleError();
                }
            })
            .catch(() => {
                handleError();
            });
    }
    return false;
};

const uploadChange = async (info) => {
    if (info.file.status === 'done') {
        const resp = info.file.response || { result: {} };
        await submitData(resp?.result || '');
    }
    if (info.file.status === 'error') {
        onlyMessage($t('Import.Import.317604-12'), 'error');
    }
};
</script>

<style scoped lang="less">
.dragger-box {
  margin: 46px 0;
  display: flex;
  flex-direction: column;
  color: #666666;

  .icon {
    font-size: 30px;
    color: @primary-color;
  }
}

.file-download {
  display: flex;
  gap: 16px;

  .btn {
    border: none;
    background-color: #ECECF0;
    width: 152px;
    color: #666666;
  }
}
</style>
