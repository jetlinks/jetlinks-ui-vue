<template>
    <div class="calendarContainer">
        <CalendarTags/>
        <CalendarRight />
    </div>
</template>

<script setup>
import CalendarTags from './Tags/index.vue';
import CalendarRight from './CalendarRight/index.vue'
import { provide } from 'vue';
const tags = ref()
const rapidOn = ref()
provide('tagsMap',tags)
provide('rapidOn',rapidOn)
</script>
<style lang="less" scoped>
.calendarContainer {
    display: flex;
    justify-content: space-around;
}
</style>
