<template>
    <div ref="calendarEl" class="calendar"></div>
</template>

<script setup name="FullCalendar">
import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import locale from '@fullcalendar/core/locales/zh-cn';

const calendarEl = ref();
let calendar;
const removeEvent = (id) => {
    const eventToRemove = calendar.getEventById(id);
    if (eventToRemove) {
        // 如果找到事件，则使用remove方法将其从日历中删除
        eventToRemove.remove();
    } else {
        console.error('未找到该事件');
    }
};
onMounted(() => {
    calendar = new Calendar(calendarEl.value, {
        plugins: [interactionPlugin, dayGridPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
            start: 'today,prev,next',
            end: 'title',
        },
        editable: true,
        locale: locale,
        droppable: true,
        events: [],
        height: '780px',
        drop: function (info) {
            console.log(info);
            // info.draggedEl.parentNode.removeChild(info.draggedEl);
        },
        eventContent: function (arg) {
            var event = arg.event;
            var eventElement = document.createElement('div');
            var eventHtml = `
                <div class="custom-event">
                    <p>${event.title}</p>
                    <a-button id=${event.id} data-event-id=${event.id}>x</a-button>
                </div>
            `;
            eventElement.innerHTML = eventHtml;
            return { domNodes: [eventElement] };
        },
        // eventClick: function (info) {
        //     removeEvent(info.event._def.publicId);
        // },
        eventDidMount: function (info) {
            var deleteBtn = info.el.querySelector(`#${info.event._def.publicId}`);
            var eventId = deleteBtn.getAttribute('data-event-id');

            // 添加点击事件处理程序
            deleteBtn.addEventListener('click', function () {
                var eventToRemove = calendar.getEventById(eventId);
                if (eventToRemove) {
                    eventToRemove.remove();
                } else {
                    console.error('未找到该事件');
                }
            });
            var date = info.event.start.toISOString().split('T')[0];
            var eventsOnDate = calendar.getEvents().filter(function (event) {
                return event.start.toISOString().split('T')[0] === date;
            });

            // 检查日期上的事件数量是否超过限制
            if (eventsOnDate.length > 5) {
                // 给出提示
                alert('每个日期只能有五个事件！');
                // 将超出限制的事件从日历中删除
                info.event.remove();
            }
        },
    });
    calendar.render();
});
</script>
<style lang="less" scoped>
.custom-event{
    display: flex;
}</style>
