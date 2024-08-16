<template>
    <j-modal
        :maskClosable="false"
        width="800px"
        :visible="true"
        :title="$t('Import.index.920531-0')"
        @cancel="handleCancel"
    >
        <div style="margin-top: 10px">
            <j-form :layout="'vertical'">
                <j-row>
                    <j-col span="24">
                        <j-form-item :label="$t('Import.index.920531-1')" required>
                            <j-select
                                showSearch
                                v-model:value="modelRef.product"
                                :placeholder="$t('Import.index.920531-2')"
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
                    </j-col>
                    <j-col span="24">
                        <j-form-item :label="$t('Import.index.920531-3')" v-if="modelRef.product">
                            <FileFormat v-model="modelRef.file" />
                        </j-form-item>
                    </j-col>
                    <j-col span="12">
                        <j-form-item :label="$t('Import.index.920531-4')" v-if="modelRef.product">
                            <NormalUpload
                                :product="modelRef.product"
                                v-model="modelRef.upload"
                                :file="modelRef.file"
                            />
                        </j-form-item>
                    </j-col>
                </j-row>
            </j-form>
        </div>
        <template #footer>
            <j-button type="primary" @click="handleSave">{{ $t('Import.index.920531-5') }}</j-button>
        </template>
    </j-modal>
</template>

<script lang="ts" setup>
import { queryNoPagingPost } from '@/api/device/product';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const emit = defineEmits(['close', 'save']);
const props = defineProps({
    data: {
        type: Object,
        default: undefined,
    },
    type: String,
});
const productList = ref<Record<string, any>[]>([]);

const modelRef = reactive({
    product: undefined,
    upload: [],
    file: {
        fileType: 'xlsx',
        autoDeploy: false,
    },
});

watch(
    () => props.data,
    () => {
        queryNoPagingPost({
            paging: false,
            terms: [
                {
                    column: 'state',
                    value: '1',
                    type: 'and'
                },
                {
                    column: 'accessProvider',
                    value: props?.type
                }
            ],
            sorts: [{ name: 'createTime', order: 'desc' }]
        }).then((resp) => {
            if (resp.status === 200) {
                productList.value = resp.result as Record<string, any>[];
            }
        });
    },
    { immediate: true, deep: true },
);

const handleCancel = () => {
    emit('close');
};

const handleSave = () => {
    emit('close');
    emit('save');
};
</script>