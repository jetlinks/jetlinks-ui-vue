<template>
    <div class="calendarContainer">
        <CalendarTags/>
        <FullCalendar />
    </div>
</template>

<script setup>
import FullCalendar from './FullCalendar/index.vue';
import CalendarTags from './Tags/index.vue';
</script>
<style lang="less" scoped>
.calendarContainer {
    display: flex;
    justify-content: space-around;
}
</style>
