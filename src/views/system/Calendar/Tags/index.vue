<template>
    <div class="tagsContainer" ref="tags">
        <PermissionButton type="text" @click="addTag">
            +新增标签
        </PermissionButton>
        <div v-for="i in tagsList" class="tag">
            <div class="tagLeft">
                <div
                    :style="{ background: i.color }"
                    class="colorExtractor"
                ></div>
                <div class="tagName">{{ i.name }}</div>
            </div>
            <div>
                <PermissionButton
                    type="text"
                    :disabled="i.disabled"
                    @click="() => editData(i)"
                >
                    <template #icon>
                        <AIcon type="FormOutlined" />
                    </template>
                </PermissionButton>
                <PermissionButton
                    type="text"
                    :disabled="i.disabled"
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
                title: eventEl.innerText,
            };
        },
    });
};
//获取标签列表
const queryTagsData = async () => {
    const res = await queryTags();
    if (res.status === 200) {
        //获取用户添加的标签颜色及权限
        const answer = await getTagsColor();
        if (answer.status === 200) {
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
        }
    }
};

const refreshTags = () => {
    editVisible.value = false;
    queryTagsData();
};

const deleteData = async (id) => {
    const res = await deleteTags([id]);
    if (res.status === 200) {
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
    currentTag.value = data
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
