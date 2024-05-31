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
                    <a-button
                        type="text"
                        class="closeBtn"
                        @click="() => deleteEvent(arg)"
                        >x</a-button
                    >
                </div>
            </template></FullCalendar
        >
        <div class="compareTip" v-if="eventChange">
            点击确认完成本次日历维护
        </div>
        <div class="compareSave" v-if="eventChange">
            <PermissionButton type="link">确认</PermissionButton>
        </div>
    </div>
</template>

<script setup name="FullCalendar">
import FullCalendar from '@fullcalendar/vue3';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import locale from '@fullcalendar/core/locales/zh-cn';
import { onlyMessage } from '@/utils/comm';
import dayjs from 'dayjs';
import { queryEvents, getTagsColor } from '@/api/system/calendar';
import { cloneDeep } from 'lodash-es';

const calendarEl = ref();
// 最新的事件数据
const eventsData = ref([]);
//接口获取到的数据
const initialData = ref([]);
//接口获取转换为日历插件需要使用的格式
const initialEventData = ref([]);
const colorMap = new Map();
// 事件点击删除逻辑
const deleteEvent = (data) => {
    const event = data.event;
    event.remove();
    let subscript;
    eventsData.value.forEach((i, index) => {
        if (i.date === event.startStr && i.id === event.id) {
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
};
// 日历初始化后请求日历中显示的事件
const handleViewDidMount = async (arg) => {
    const startDate = dayjs(arg.view.activeStart).format('YYYY-MM-DD');
    const endDate = dayjs(arg.view.activeEnd).format('YYYY-MM-DD');
    const answer = await getTagsColor();
    if (answer.status === 200) {
        Object.keys(answer.result).forEach((i) => {
            colorMap.set(i, answer.result[i]);
        });
    }
    queryEvents(startDate, endDate).then((res) => {
        if (res.status === 200) {
            res.result.forEach((i) => {
                i.tags.forEach((item) => {
                    eventsData.value.push({
                        date: i.date,
                        id: item.id,
                        name: item.name,
                    });
                });
            });
            initialData.value = cloneDeep(eventsData.value);
            initialEventData.value = eventsData.value.map((i) => {
                return {
                    id: i.id,
                    title: i.name,
                    start: i.date,
                    backgroundColor: colorMap.get(i.id) || '#000000',
                };
            });
            calendarEl.value
                .getApi()
                .setOption('events', initialEventData.value);
        }
    });
};
// 事件是否发生变化
const eventChange = computed(() => {
    return (
        JSON.stringify(eventsData.value) !== JSON.stringify(initialData.value)
    );
});
// 自定义切换月份逻辑
const handleCustomPrev = () => {
    if (eventChange.value) {
        onlyMessage('请先保存数据','warning')
    } else {
        calendarEl.value.getApi().prev();
    }
};
const handleCustomNext = () => {
    if (eventChange.value) {
        onlyMessage('请先保存数据','warning')
    } else {
        calendarEl.value.getApi().next();
    }
};
const calendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin],
    initialView: 'dayGridMonth',
    customButtons: {
        customPrev: {
            text: '上月',
            click: handleCustomPrev,
        },
        customNext: {
            text: '下月',
            click: handleCustomNext,
        },
    },
    headerToolbar: {
        start: 'customPrev,today,customNext',
        end: '',
    },
    events: initialEventData.value,
    editable: true,
    locale: locale,
    droppable: true,
    height: '780px',
    drop: function (info) {},
    eventReceive: handleEventAdd,
    eventsSet: function (events) {},
    viewDidMount: handleViewDidMount,
    prev: function customPrevFunction(info) {
        // 在此处执行自定义的 "prev" 按钮回调函数
        info.preventDefault();
        console.log('点击了 "prev" 按钮');
        // 在这里添加你的自定义逻辑...
    },
};
</script>
<style lang="less" scoped>
:deep(.fc-header-toolbar) {
    background-color: #edebeb;
}
.calendarContainer {
    position: relative;
    .compareTip {
        position: absolute;
        right: 50%;
        top: 5px;
        transform: translateX(50%);
    }
    .compareSave {
        position: absolute;
        right: 0;
        top: 0;
    }
}
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
