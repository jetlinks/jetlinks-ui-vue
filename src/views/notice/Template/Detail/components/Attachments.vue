<!-- webhook请求头可编辑表格 -->
<template>
    <div class="attachment-wrapper">
        <div
            class="attachment-item"
            v-for="(item, index) in fileList"
            :key="index"
        >
            <a-input v-model:value="item.name">
                <template #addonAfter>
                    <a-upload
                        name="file"
                        :action="FILE_UPLOAD"
                        :headers="{
                            [TOKEN_KEY]: LocalStore.get(TOKEN_KEY),
                        }"
                        :showUploadList="false"
                        @change="handleChange"
                    >
                        <upload-outlined />
                    </a-upload>
                </template>
            </a-input>
            <delete-outlined @click="handleDelete" style="cursor: pointer" />
        </div>

        <a-button
            type="dashed"
            @click="handleAdd"
            style="width: 100%; margin-top: 5px"
        >
            <template #icon>
                <plus-outlined />
            </template>
            添加
        </a-button>
    </div>
</template>

<script setup lang="ts" name="Attachments">
import {
    PlusOutlined,
    DeleteOutlined,
    UploadOutlined,
} from '@ant-design/icons-vue';
import { PropType } from 'vue';
import { IAttachments } from '../../types';
import { FILE_UPLOAD } from '@/api/comm';
import { LocalStore } from '@/utils/comm';
import { TOKEN_KEY } from '@/utils/variable';
import { UploadChangeParam } from 'ant-design-vue';

type Emits = {
    (e: 'update:attachments', data: IAttachments[]): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    attachments: {
        type: Array as PropType<IAttachments[]>,
        default: () => [],
    },
});

const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'done') {
        const result = info.file.response?.result;
        console.log('result: ', result);
    }
};

const fileList = ref<IAttachments[]>([]);
watch(
    () => props.attachments,
    (val) => {
        fileList.value = val;
    },
    { deep: true },
);

const handleDelete = (id: number) => {
    const idx = fileList.value.findIndex((f) => f.id === id);
    fileList.value.splice(idx, 1);
    emit('update:attachments', fileList.value);
};
const handleAdd = () => {
    fileList.value.push({
        id: fileList.value.length,
        name: '',
        location: '',
    });
    emit('update:attachments', fileList.value);
};
</script>

<style lang="less" scoped>
.attachment-wrapper {
    .attachment-item {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-bottom: 10px;
    }
}
</style>
