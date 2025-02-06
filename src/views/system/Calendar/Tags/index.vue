<template>
    <div class="tagsContainer" ref="tags">
        <j-permission-button
            type="primary"
            hasPermission="system/Calendar:add"
            ghost
            block
            @click="addTag"
            :disabled="rapidOn"
            style="margin-bottom: 10px"
        >
            +{{ $t('Tags.index.675027-0') }}
        </j-permission-button>
        <div class="content">
            <div v-for="i in tagsList" class="tag">
                <div class="tagLeft">
                    <div
                        :style="{ background: i.color }"
                        class="colorExtractor"
                    ></div>
                    <j-ellipsis
                        class="tagName"
                        style="
                        width: 120px;
                    "
                        :id="i.id"
                    >{{ i.i18nName || i.name }}
                    </j-ellipsis>
                </div>
                <div class="controls">
                    <j-permission-button
                        type="text"
                        hasPermission="system/Calendar:update"
                        :disabled="i.disabled || rapidOn"
                        :tooltip="{
                        title: $t('Tags.index.675027-1')
                    }"
                        @click="() => editData(i)"
                    >
                        <template #icon>
                            <AIcon type="EditOutlined" />
                        </template>
                    </j-permission-button>
                    <j-permission-button
                        type="text"
                        hasPermission="system/Calendar:delete"
                        :disabled="i.disabled || rapidOn"
                        :tooltip="{
                        title: $t('Tags.index.675027-2')
                    }"
                        :popConfirm="{
                        title: $t('Tags.index.675027-3'),
                        onConfirm: () => deleteData(i.id),
                    }"
                    >
                        <template #icon>
                            <AIcon type="DeleteOutlined" />
                        </template>
                    </j-permission-button>
                </div>
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
import { onlyMessage } from '@jetlinks-web/utils';
import { inject } from 'vue';
import { omit } from 'lodash-es';
import { useSystemStore } from '@/store/system';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const system = useSystemStore();
const calendarTagColor = system.calendarTagColor;
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
const defaultColor = new Map();
defaultColor.set('weekend', 'rgb(149, 222, 100)');
defaultColor.set('holiday', 'rgb(161, 180, 204)');
defaultColor.set('workday', 'rgb(105,177,255)');

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
        await system.queryTagsColor();
        tagsList.value = res.result.map((i) => {
            let color = '#000000';
            let disabled = false;
            if (calendarTagColor.has(i.id)) {
                color = calendarTagColor.get(i.id);
            }
            if (buildInTag.includes(i.id)) {
                disabled = true;
                color = defaultColor.get(i.id);
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
        onlyMessage($t('Tags.index.675027-4'));
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
    width: 260px;
    background-color: #fff;
    border-right: 1px solid #cccccc;
    padding-right: 24px;
    .content {
        overflow: auto;
        height: 700px;
    }
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
