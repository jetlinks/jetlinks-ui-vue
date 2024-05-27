<template>
    <a-drawer
        visible
        title="升级任务"
        placement="right"
        :width="700"
        @close="$emit('closeDrawer')"
    >
        <template #extra>
            <a-button type="link">+新增任务 </a-button>
        </template>
        <div v-for="item in taskList" class="task">
            <div class="taskTitle">
                <div>{{ item?.mode?.text }}</div>
                <div>{{ item?.name }}</div>
                <div>{{ item?.progress }}</div>
                <a-button type="text">任务详情</a-button>
            </div>
            <a-descriptions bordered :column="2">
                <a-descriptions-item  v-if="item?.mode?.value ==='push'" label="响应超时时间">{{
                    item?.responseTimeoutSeconds + 's'
                }}</a-descriptions-item>
                <a-descriptions-item label="升级超时时间">{{
                    item?.timeoutSeconds + 's'
                }}</a-descriptions-item>
                <a-descriptions-item label="升级设备">{{
                    item?.deviceId.length ? '所有设备' : '选择设备'
                }}</a-descriptions-item>
                <a-descriptions-item label="说明">{{
                    item?.description
                }}</a-descriptions-item>
            </a-descriptions>
        </div>
    </a-drawer>
</template>

<script setup name="TaskDrawer">
import {
    queryTaskPaginateNot,
    startTask,
    stopTask,
} from '@/api/device/firmware';
const emit = defineEmits(['closeDrawer']);
const props = defineProps({
    firmwareId: {
        type: String,
        default: '',
    },
});
const taskList = ref();
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
    }
};
onMounted(() => {
    queryTaskList();
});
</script>
<style lang="less" scoped>
.task{
    margin-bottom: 20px;
}
.taskTitle {
    display: flex;
    justify-content: space-around;
}
</style>
