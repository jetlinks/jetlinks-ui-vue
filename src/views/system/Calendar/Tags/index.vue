<template>
    <div class="tagsContainer" ref="tags">
        <a-button type="text" @click="addTag"> +新增标签 </a-button>
        <div v-for="i in tagsList" class="tag">
            <div class="tagLeft">
                <div
                    :style="{ background: i.color }"
                    class="colorExtractor"
                ></div>
                <div>{{ i.name }}</div>
            </div>
            <div>
                <a-button type="text" :disabled="i.disabled">
                    <template #icon>
                        <AIcon type="FormOutlined" />
                    </template>
                </a-button>
                <a-button
                    type="text"
                    :disabled="i.disabled"
                    @click="() => deleteData(i.id)"
                >
                    <template #icon>
                        <AIcon type="DeleteOutlined" />
                    </template>
                </a-button>
            </div>
        </div>
    </div>
    <EditTag
        v-if="editVisible"
        @close-edit-tag="editVisible = false"
        @refresh="refreshTags"
    />
</template>

<script setup name="CalendarTags">
import { queryTags, deleteTags } from '@/api/system/calendar';
import { Draggable } from '@fullcalendar/interaction';
import EditTag from './components/editTag.vue';
import { onlyMessage } from '@/utils/comm';
const editVisible = ref(false);
const tags = ref();
const tagsList = ref();
const addTag = () => {
    editVisible.value = true;
};
const createDrag = () => {
    new Draggable(tags.value, {
        itemSelector: '.tag',
        eventData: function (eventEl) {
            return {
                title: eventEl.innerText,
            };
        },
    });
};
const queryTagsData = async () => {
    const res = await queryTags();
    if (res.status === 200) {
        //获取用户添加的标签颜色及权限
        tagsList.value = res.result.map((i) => {
            if (i.id.includes('-')) {
                const color = i.id.split('-')[0];
                return {
                    ...i,
                    color,
                };
            }
            //内置标签给颜色和权限
            switch (i.id) {
                case 'workday':
                    return {
                        ...i,
                        color: '#81d3f8',
                        disabled: true,
                    };
                case 'weekend':
                    return {
                        ...i,
                        color: '#caf982',
                        disabled: true,
                    };
                case 'holiday':
                    return {
                        ...i,
                        color: '#4e5878',
                        disabled: true,
                    };
                default:
                    return {
                        ...i,
                        color: '#000000',
                    };
            }
        });
    }
    console.log(tagsList.value);
};

const refreshTags = () => {
    editVisible.value = false;
    queryTagsData();
};

const deleteData = async (id) => {
    const res = await deleteTags([id]);
    if (res.status === 200) {
        onlyMessage('操作成功');
        queryTagsData();
    }
};
onMounted(() => {
    queryTagsData();
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
