<template>
    <a-modal
        :maskClosable="false"
        width="800px"
        :open="true"
        :title="$t('Import.index.103541-0')"
        @cancel="handleCancel"
    >
        <div style="margin-top: 10px">
            <a-form :layout="'vertical'">
                <a-row>
                    <a-col span="24">
                        <a-form-item :label="$t('Import.index.103541-1')" required>
                            <a-select
                                showSearch
                                v-model:value="modelRef.product"
                                :placeholder="$t('Import.index.103541-2')"
                            >
                                <a-select-option
                                    :value="item.id"
                                    v-for="item in productList"
                                    :key="item.id"
                                    :label="item.name"
                                    >{{ item.name }}</a-select-option
                                >
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col span="24">
                        <a-form-item :label="$t('Import.index.103541-3')" v-if="modelRef.product">
                            <FileFormat v-model="modelRef.file" />
                        </a-form-item>
                    </a-col>
                    <a-col span="12">
                        <a-form-item :label="$t('Import.index.103541-4')" v-if="modelRef.product">
                            <NormalUpload
                                :product="modelRef.product"
                                v-model="modelRef.upload"
                                :file="modelRef.file"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>
        <template #footer>
            <a-button type="primary" @click="handleSave">{{ $t('Import.index.103541-5') }}</a-button>
        </template>
    </a-modal>
</template>

<script lang="ts" setup>
import { queryNoPagingPost } from '../../../../api/product';

const emit = defineEmits(['close', 'save']);
const productList = ref<Record<string, any>[]>([]);

const modelRef = reactive({
    product: undefined,
    upload: [],
    file: {
        fileType: 'xlsx',
        autoDeploy: false,
    },
});


const handleCancel = () => {
    emit('close');
};

const handleSave = () => {
    emit('close');
    emit('save');
};

onMounted(() => {
    queryNoPagingPost({
        paging: false,
        terms: [
            {
                column: 'state',
                value: '1',
                type: 'and',
            },
            {
                column: 'accessProvider',
                termType: 'in',
                value: ['agent-device-gateway','agent-media-device-gateway','official-edge-gateway'],
            },
        ],
        sorts: [{ name: 'createTime', order: 'desc' }],
    }).then((resp) => {
        if (resp.status === 200) {
            productList.value = resp.result as Record<string, any>[];
        }
    });
});
</script>
