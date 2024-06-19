<template>
    <div class="tagsContainer" ref="tags">
        <PermissionButton type="text" @click="addTag" :disabled="rapidOn">
            +新增标签
        </PermissionButton>
        <div v-for="i in tagsList" class="tag">
            <div class="tagLeft">
                <div
                    :style="{ background: i.color }"
                    class="colorExtractor"
                ></div>
                <Ellipsis class="tagName" style="max-width: 90px;cursor: move;" :id="i.id">{{
                    i.name
                }}</Ellipsis>
            </div>
            <div>
                <PermissionButton
                    type="text"
                    :disabled="i.disabled || rapidOn"
                    @click="() => editData(i)"
                >
                    <template #icon>
                        <AIcon type="FormOutlined" />
                    </template>
                </PermissionButton>
                <PermissionButton
                    type="text"
                    :disabled="i.disabled || rapidOn"
                    :popConfirm="{
                        title: `确定要删除？`,
                        onConfirm: () => deleteData(i.id),
                    }"
                >
                    <template #icon>
                        <AIcon type="DeleteOutlined" />
                    </template>
                </PermissionButton>
            </div>
        </div>
    </div>
    <EditTag
        v-if="editVisible"
        :edit-type="editType"
        :editData="currentTag"
        @close-edit-tag="editVisible = false"
        @refresh="refreshTags"
    />
</template>

<script setup name="CalendarTags">
import {
    queryTags,
    deleteTags,
    getTagsColor,
    saveTagsColor,
} from '@/api/system/calendar';
import { Draggable } from '@fullcalendar/interaction';
import EditTag from './components/editTag.vue';
import { onlyMessage } from '@/utils/comm';
import { inject } from 'vue';
import { omit } from 'lodash-es';
const tagsMap = inject('tagsMap');
const rapidOn = inject('rapidOn');
const editVisible = ref(false);
const tags = ref();
const tagsList = ref();
const editType = ref();
const currentTag = ref();
const colorMap = new Map();
const addTag = () => {
    editVisible.value = true;
    editType.value = 'add';
};
const buildInTag = ['weekend', 'holiday', 'workday'];
const createDrag = () => {
    new Draggable(tags.value, {
        itemSelector: '.tagName',
        eventData: function (eventEl) {
            return {
                id: eventEl.id,
                title: eventEl.innerText,
                backgroundColor: colorMap.get(eventEl.id) || '#000000',
                color: '#000',
                editable: false,
            };
        },
    });
};
//获取标签列表
const queryTagsData = async () => {
    const res = await queryTags();
    if (res.success) {
        //获取用户添加的标签颜色及权限
        const answer = await getTagsColor();
        if (answer.success) {
            Object.keys(answer.result).forEach((i) => {
                colorMap.set(i, answer.result[i]);
            });
            tagsList.value = res.result.map((i) => {
                let color = '#000000';
                let disabled = false;
                if (colorMap.has(i.id)) {
                    color = colorMap.get(i.id);
                }
                if (buildInTag.includes(i.id)) {
                    disabled = true;
                }
                return {
                    ...i,
                    color,
                    disabled,
                };
            });
            tagsMap.value = tagsList.value.map((i) => {
                return omit(i, ['disabled']);
            });
        }
    }
};

const refreshTags = () => {
    editVisible.value = false;
    queryTagsData();
};

const deleteData = async (id) => {
    const res = await deleteTags([id]);
    if (res.success) {
        if (colorMap.has(id)) {
            colorMap.delete(id);
            let color = new Object();
            colorMap.forEach((item, key) => {
                color[key] = item;
            });
            const deleteColor = await saveTagsColor(color);
        }
        onlyMessage('操作成功');
        queryTagsData();
    }
};

const editData = (data) => {
    editVisible.value = true;
    editType.value = 'edit';
    currentTag.value = data;
};
onMounted(() => {
    queryTagsData();
    createDrag();
});
</script>
<style lang="less" scoped>
.tagsContainer {
    width: 15%;
    background-color: #fff;
    padding: 10px;
    .tag {
        display: flex;
        justify-content: space-between;
        background-color: rgb(242, 242, 242);
        margin-bottom: 10px;
        padding: 0 10px;
        .tagLeft {
            display: flex;
            padding-top: 6px;
            .colorExtractor {
                width: 20px;
                height: 20px;
                margin-right: 10px;
            }
        }
    }
}
</style>
