<template>
    <j-page-container>
      <full-page :fixed="false">
        <div class="calendarContainer">
            <CalendarTags />
            <CalendarRight />
        </div>
      </full-page>
    </j-page-container>
</template>

<script setup>
import CalendarTags from './Tags/index.vue';
import CalendarRight from './CalendarRight/index.vue';
import { provide } from 'vue';
import FullPage from "@/layout/FullPage.vue";

const tags = ref();
const rapidOn = ref();

provide('tagsMap', tags);
provide('rapidOn', rapidOn);

</script>
<style lang="less" scoped>
.calendarContainer {
    display: flex;
    height: 100%;
    padding: 24px;
  gap: 24px;
}
</style>
