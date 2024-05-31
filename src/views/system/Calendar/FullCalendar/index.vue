<template>
    <FullCalendar ref="calendarEl" class="calendar" :options="calendarOptions">
        <template v-slot:eventContent="arg">
            <div class="event">
                <i>{{ arg.event.title }}</i>
                <a-button
                    type="text"
                    class="closeBtn"
                    @click="() => deleteEvent(arg)"
                    >x</a-button
                >
            </div>
        </template></FullCalendar
    >
</template>

<script setup name="FullCalendar">
import FullCalendar from '@fullcalendar/vue3';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import locale from '@fullcalendar/core/locales/zh-cn';
import { onlyMessage } from '@/utils/comm';
import dayjs from 'dayjs';

const calendarEl = ref();
const eventsData = ref([]);
const initialEventData = [];
// 事件点击删除逻辑
const deleteEvent = (data) => {
    const event = data.event;
    event.remove();
    let subscript;
    eventsData.value.forEach((i, index) => {
        if (i.date === event.startStr && i.id === event.id) {
            console.log(1234);
            subscript = index;
        }
    });
    eventsData.value.splice(subscript, 1);
};
// 事件拖拽添加逻辑处理
const handleEventAdd = ({ event }) => {
    const thatEvent = eventsData.value.filter((i) => {
        return i.date === event.startStr;
    });
    if (thatEvent?.length >= 5) {
        event.remove();
        onlyMessage('该日期已超出可配置标签上限', 'error');
        return;
    } else if (thatEvent.length) {
        const alreadyExist = thatEvent.find((i) => {
            return i.id === event.id;
        });
        if (alreadyExist) {
            event.remove();
        } else {
            eventsData.value.push({
                date: event.startStr,
                id: event.id,
                name: event.title,
            });
        }
    } else {
        eventsData.value.push({
            date: event.startStr,
            id: event.id,
            name: event.title,
        });
    }
    console.log(eventsData.value, 'add');
};
const handleViewDidMount = (arg) => {
    const startDate = arg.view.activeStart;
    const endDate = arg.view.activeEnd;
    console.log('Start Date:', dayjs(startDate).format('YYYY-MM-DD'));
    console.log('End Date:', dayjs(endDate).format('YYYY-MM-DD'));
};
const calendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
        start: 'prev,today,next',
        end: '',
    },
    events: initialEventData,
    editable: true,
    locale: locale,
    droppable: true,
    height: '780px',
    drop: function (info) {},
    eventReceive: handleEventAdd,
    eventsSet: function (events) {},
    viewDidMount: handleViewDidMount,
};
</script>
<style lang="less" scoped>
.event {
    position: relative;
    height: 30px;
    line-height: 30px;

    .closeBtn {
        position: absolute;
        right: 0;
        top: -5;
        color: #fff;
    }
}
</style>
