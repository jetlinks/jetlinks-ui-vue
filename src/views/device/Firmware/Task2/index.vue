<template>
    <a-drawer
        visible
        title="升级任务"
        placement="right"
        :width="700"
        @close="$emit('closeDrawer')"
    >
        <div v-for="item in taskList">
            <div class="taskTitle">
                
            </div>
        </div>
    </a-drawer>
</template>

<script setup name="TaskDrawer">
import { task, startTask, stopTask } from '@/api/device/firmware';
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
    const res = await task(param);
    if (res.status === 200) {
        taskList.value = res.result.data;
    }
};
onMounted(() => {
    queryTaskList();
});
</script>
<style lang="less" scoped></style>
