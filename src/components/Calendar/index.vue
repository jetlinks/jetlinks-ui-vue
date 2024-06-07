<template>
    <div class="calendarContainer">
        <FullCalendar
            ref="calendarEl"
            class="calendar"
            :options="calendarOptions"
        >
            <template v-slot:eventContent="arg">
                <div class="event">
                    <i>{{ arg.event.title }}</i>
                </div>
            </template>
        </FullCalendar>
        <div class="calenderButton">
            <a-button @click="handleCustomPrev" :disabled="selectable"
                >上月</a-button
            >
            <a-button @click="handleCustomToday" :disabled="selectable"
                >今天</a-button
            >
            <a-button @click="handleCustomNext" :disabled="selectable"
                >下月</a-button
            >
        </div>
    </div>
</template>

<script setup name="FullCalendar">
import FullCalendar from '@fullcalendar/vue3';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import locale from '@fullcalendar/core/locales/zh-cn';
import { queryEvents, getTagsColor } from '@/api/system/calendar';
import dayjs from 'dayjs';
const props = defineProps({
    height: {
        type: Number,
        default: 700,
    },
});
const calendarEl = ref();
const calendarApi = ref();
// 最新的事件数据
const eventsData = ref([]);
//接口获取转换为日历插件需要使用的格式
const initialEventData = ref([]);
//接口获取到的数据
const interfaceData = ref([]);
const colorMap = new Map();
// 日历初始化后请求日历中显示的事件
const handleViewDidMount = async (arg) => {
    const startDate = dayjs(arg.view.activeStart).format('YYYY-MM-DD');
    // fullcalendar插件获取当前日期截至日期会多一天
    const endDate = dayjs(arg.view.activeEnd)
        .subtract(1, 'day')
        .format('YYYY-MM-DD');
    const answer = await getTagsColor();
    if (answer.status === 200) {
        Object.keys(answer.result).forEach((i) => {
            colorMap.set(i, answer.result[i]);
        });
    }
    queryEvents(startDate, endDate).then((res) => {
        if (res.status === 200) {
            const data = res.result.filter((i) => {
                return !interfaceData.value.find((item) => {
                    return item.date === i.date;
                });
            });
            interfaceData.value = [...interfaceData.value, ...data];
            data.forEach((i) => {
                i.tags.forEach((item) => {
                    eventsData.value.push({
                        date: i.date,
                        id: item.id,
                        name: item.name,
                    });
                });
            });
            initialEventData.value = eventsData.value.map((i) => {
                return {
                    id: i.id,
                    title: i.name,
                    start: i.date,
                    backgroundColor: colorMap.get(i.id) || '#000000',
                };
            });
            calendarApi.value.removeAllEvents();
            calendarApi.value.addEventSource(initialEventData.value);
        }
    });
};
// 自定义切换月份逻辑
const handleCustomPrev = () => {
    calendarApi.value.prev();
};
const handleCustomNext = () => {
    calendarApi.value.next();
};
const handleCustomToday = () => {
    calendarApi.value.today();
};
//插件配置项
const calendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
        start: 'title',
        center: '',
        end: '',
    },
    events: initialEventData.value,
    locale: locale,
    droppable: true,
    height: props.height + 'px',
    datesSet: handleViewDidMount,
};
onMounted(() => {
    calendarApi.value = calendarEl.value.getApi();
});
</script>
<style lang="less" scoped>
:deep(.fc-header-toolbar) {
    background-color: #edebeb;
}
.calendarContainer {
    position: relative;
    .calenderButton {
        position: absolute;
        left: 10%;
        top: 2px;
    }
    .event {
        position: relative;
        height: 30px;
        line-height: 30px;
    }
}
</style>
