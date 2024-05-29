<template>
    <div ref="calendarEl" class="calendar"></div>
</template>

<script setup name="FullCalendar">
import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import locale from '@fullcalendar/core/locales/zh-cn';

const calendarEl = ref();
onMounted(() => {
    const calendar = new Calendar(calendarEl.value, {
        plugins: [interactionPlugin, dayGridPlugin],
        initialView: 'dayGridMonth',
        headerToolbar:{
            start:'today,prev,next',
            end:'title'
        },
        editable: true,
        locale: locale,
        droppable: true,
        events: [],
        height: '780px',
        drop: function (info) {
            // if so, remove the element from the "Draggable Events" list
            info.draggedEl.parentNode.removeChild(info.draggedEl);
        },
    });
    calendar.render();
});
</script>
<style lang="less" scoped>
.calendar {
    width: 70%;
}
</style>
