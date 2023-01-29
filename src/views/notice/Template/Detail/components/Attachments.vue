<!-- 附件信息 -->
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
                        @change="(e) => handleChange(e, item.id)"
                    >
                        <upload-outlined />
                    </a-upload>
                </template>
            </a-input>
            <delete-outlined
                @click="handleDelete(item.id)"
                style="cursor: pointer"
            />
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

// const fileList = computed({
//     get: () => props.attachments.map((m) => ({ id: fileId(), ...m })),
//     set: (val) =>
//         emit(
//             'update:attachments',
//             val.map(({ name, location }) => ({ name, location })),
//         ),
// });

const fileList = ref<IAttachments[]>([]);

watch(
    () => props.attachments,
    (val) => {
        fileList.value = val.map((m) => ({
            id: fileId(),
            ...m,
        }));
    },
    { deep: true },
);

const handleChange = (info: UploadChangeParam, id: string | undefined) => {
    if (info.file.status === 'done') {
        const targetFileIdx = fileList.value.findIndex((f) => f.id === id);
        fileList.value[targetFileIdx].name = info.file.name;
        fileList.value[targetFileIdx].location = info.file.response?.result;
        emit(
            'update:attachments',
            fileList.value.map(({ name, location }) => ({ name, location })),
        );
    }
};

/**
 * 删除附件
 * @param id
 */
const handleDelete = (id: string | undefined) => {
    const idx = fileList.value.findIndex((f) => f.id === id);

    fileList.value.splice(idx, 1);
};

/**
 * 添加附件
 */
const handleAdd = () => {
    fileList.value.push({
        id: fileId(),
        name: '',
        location: '',
    });
};

/**
 * 附件标识
 */
const fileId = () => String(new Date().getTime() + Math.random() * 9);
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
