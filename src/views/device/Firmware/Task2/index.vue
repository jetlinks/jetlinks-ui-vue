<template>
    <a-drawer
        visible
        title="升级任务"
        placement="right"
        :width="700"
        @close="$emit('closeDrawer')"
    >
        <template #extra>
            <a-button type="link" @click="handleAdd">+新增任务 </a-button>
        </template>
        <div v-for="item in taskList" class="task">
            <div class="taskTitle">
                <div>{{ item?.mode?.text }}</div>
                <div>{{ item?.name }}</div>
                <div>
                    完成比例<span class="progress">
                        {{ (item?.progress || 0) + '%' }}
                    </span>
                </div>
                <a-button type="text" @click="() => taskDetail(item)"
                    >任务详情</a-button
                >
            </div>
            <a-descriptions bordered :column="2">
                <a-descriptions-item
                    v-if="item?.mode?.value === 'push'"
                    label="响应超时时间"
                    >{{
                        item?.responseTimeoutSeconds + 's'
                    }}</a-descriptions-item
                >
                <a-descriptions-item label="升级超时时间">{{
                    item?.timeoutSeconds + 's'
                }}</a-descriptions-item>
                <a-descriptions-item label="升级设备">{{
                    item?.deviceId?.length ? '所有设备' : '选择设备'
                }}</a-descriptions-item>
                <a-descriptions-item label="说明">{{
                    item?.description || '--'
                }}</a-descriptions-item>
            </a-descriptions>
        </div>
    </a-drawer>
    <Save v-if="visible" :data="current" @change="saveChange"></Save>
    <TaskDetail
        v-if="detailVisible"
        @close-detail="closeDetail"
        @refresh="queryTaskList"
        :data="currentTask"
    />
</template>

<script setup name="TaskDrawer">
import { queryTaskPaginateNot } from '@/api/device/firmware';
import Save from './Save/index.vue';
import TaskDetail from './Detail/index.vue';
const emit = defineEmits(['closeDrawer']);
const props = defineProps({
    firmwareId: {
        type: String,
        default: '',
    },
});
const taskList = ref();
const visible = ref(false);
const detailVisible = ref(false);
const current = ref();
//任务详情传参
const currentTask = ref();
const queryTaskList = async () => {
    const param = {
        paging: false,
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [
            {
                terms: [
                    {
                        column: 'firmwareId',
                        value: props.firmwareId,
                    },
                ],
            },
        ],
    };
    const res = await queryTaskPaginateNot(param);
    if (res.status === 200) {
        taskList.value = res.result;
        if (currentTask.value?.id) {
            currentTask.value = taskList.value.find(
                (i) => i.id === currentTask.value.id,
            );
        }
    }
};
const handleAdd = () => {
    visible.value = true;
    current.value = {};
};
const saveChange = (value) => {
    visible.value = false;
    current.value = {};
    if (value) {
        onlyMessage('操作成功', 'success');
        tableRef.value.reload();
    }
};
const taskDetail = (data) => {
    detailVisible.value = true;
    currentTask.value = data;
};
const closeDetail = () =>{
    detailVisible.value = false;
    queryTaskList()
}
onMounted(() => {
    queryTaskList();
});
</script>
<style lang="less" scoped>
.task {
    margin-bottom: 20px;
}
.taskTitle {
    display: flex;
    justify-content: space-around;
    .progress {
        color: rgb(217, 0, 27);
        margin-left: 5px;
    }
}
</style>
