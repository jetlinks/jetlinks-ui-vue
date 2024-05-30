<template>
    <div class="calendarRight">
        <div class="tips">
            <span
                >将左侧标签拖拽至右侧日历中，日历中的标签在场景联动中可以被引用作为执行动作的触发条件</span
            >
            <permissionButton type="text">
                <template #icon><AIcon type="ClearOutlined" style="font-size: 16px;"/></template
                >清空</permissionButton
            >
        </div>
        <FullCalendar />
    </div>
</template>

<script setup name="Calendar">
import FullCalendar from '../FullCalendar/index.vue';
</script>
<style lang="less" scoped>
.calendarRight {
    width: 80%;
    padding: 10px 20px;
    background: #fff;
    .tips {
        display: flex;
        justify-content: space-between;
    }
}
</style>
