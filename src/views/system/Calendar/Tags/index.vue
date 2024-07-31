<template>
    <div class="tagsContainer" ref="tags">
        <PermissionButton type="primary"  hasPermission="system/Calendar:add" ghost block @click="addTag" :disabled="rapidOn" style="margin-bottom: 10px;">
            + 新增标签
        </PermissionButton>
        <div v-for="i in tagsList" class="tag">
            <div class="tagLeft">
                <div
                    :style="{ background: i.color }"
                    class="colorExtractor"
                ></div>
                <Ellipsis
                    class="tagName"
                    style="
                        width: 120px;
                        cursor: url('/images/calendar/hover.png'), pointer;
                    "
                    :id="i.id"
                    >{{ i.name }}</Ellipsis
                >
            </div>
            <div class="controls">
                <PermissionButton
                    type="text"
                     hasPermission="system/Calendar:update"
                    :disabled="i.disabled || rapidOn"
                    :tooltip="{
                        title: '编辑'
                    }"
                    @click="() => editData(i)"
                >
                    <template #icon>
                        <AIcon type="EditOutlined" />
                    </template>
                </PermissionButton>
                <PermissionButton
                    type="text"
                     hasPermission="system/Calendar:delete"
                    :disabled="i.disabled || rapidOn"
                    :tooltip="{
                        title: '删除'
                    }"
                    :popConfirm="{
                        title: `确认删除？`,
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
import { queryTags, deleteTags, saveTagsColor } from '@/api/system/calendar';
import { Draggable } from '@fullcalendar/interaction';
import EditTag from './components/editTag.vue';
import { onlyMessage } from '@/utils/comm';
import { inject } from 'vue';
import { omit } from 'lodash-es';
import { useSystem } from '@/store/system';
const system = useSystem();
const calendarTagColor = system.$state.calendarTagColor;
const tagsMap = inject('tagsMap');
const rapidOn = inject('rapidOn');
const editVisible = ref(false);
const tags = ref();
const tagsList = ref();
const editType = ref();
const currentTag = ref();
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
                backgroundColor: calendarTagColor.get(eventEl.id) || '#000000',
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
        await system.getTagsColor();
        tagsList.value = res.result.map((i) => {
            let color = '#000000';
            let disabled = false;
            if (calendarTagColor.has(i.id)) {
                color = calendarTagColor.get(i.id);
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
};

const refreshTags = () => {
    editVisible.value = false;
    queryTagsData();
};

const deleteData = async (id) => {
    const res = await deleteTags([id]);
    if (res.success) {
        if (calendarTagColor.has(id)) {
            calendarTagColor.delete(id);
            let color = new Object();
            calendarTagColor.forEach((item, key) => {
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
    border-right: 1px solid #CCCCCC;
    .tag {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        padding: 0 10px;
        height: 32px;
        .tagLeft {
            display: flex;
            padding-top: 6px;
            .colorExtractor {
                margin-top: 3px;
                width: 16px;
                height: 16px;
                border-radius: 2px;
                margin-right: 8px;
            }
        }
        .controls{
            display: none;
            font-size: 14px;
           
            :deep(.ant-btn-text){
                padding: 4px 8px;
            }
        }
        &:hover{
            .controls{
                display: block;
            }
        }
    }
    .tag:hover{
        background-color: rgb(242, 242, 242);
        border-radius: 4px;
    }
}
</style>
