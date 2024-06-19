<template>
    <div class="calendarContainer">
        <FullCalendar
            ref="calendarEl"
            class="calendar"
            :options="calendarOptions"
        >
            <template v-slot:eventContent="arg">
                <div class="event">
                    <div class="event-title">{{ arg.event.title }}</div>
                    <a-button
                        v-if="!selectable"
                        type="text"
                        class="closeBtn"
                        @click="() => deleteEvent(arg)"
                        >x</a-button
                    >
                </div>
            </template>
        </FullCalendar>
        <div class="calenderButton">
            <a-date-picker
                v-model:value="current"
                :disabled="selectable"
                format="YYYY-MM"
                picker="month"
                @change="changeDate"
                valueFormat="YYYY-MM"
            />
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
        <div class="compareTip" v-if="eventChange">
            点击确认完成本次日历维护
        </div>
        <div class="compareSave" v-if="eventChange">
            <PermissionButton
                type="link"
                @click="saveCalendar"
                :disabled="selectable"
                >确认</PermissionButton
            >
        </div>
        <div
            v-if="selectable && !choiceEnd && showTips"
            class="tips"
            :style="{ top: mouseY + 'px', left: mouseX + 20 + 'px' }"
        >
            {{ choiceStart ? '点击选中模板结束日期' : '点击选中模板开始日期' }}
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
import { queryEvents, getTagsColor, saveEvents } from '@/api/system/calendar';
import { cloneDeep, flatten } from 'lodash-es';
import { defineExpose } from 'vue';
import { inject } from 'vue';
const props = defineProps({
    selectable: {
        type: String,
        default: false,
    },
});
const emit = defineEmits(['selectDate', 'resetRapid']);
const tagsList = inject('tagsMap');
//请求接口的结束时间（请求过的日期就不再请求接口了）
const queryEndDate = ref([]);
//当前日历展示日期
const current = ref(dayjs().format('YYYY-MM'));
const mouseY = ref();
const mouseX = ref();
//是否显示提示
const showTips = ref();
const calendarEl = ref();
const calendarApi = ref();
// 最新的事件数据
const eventsData = ref([]);
//接口获取到的事件数据  用于对比是否有更改
const initialData = ref([]);
//接口获取转换为日历插件需要使用的格式
const initialEventData = ref([]);
//接口获取到的数据
const interfaceData = ref([]);
const colorMap = new Map();
//多选开始日期
const choiceStart = ref();
//多选结束日期
const choiceEnd = ref();
//上次悬停改变过的数据
const lastHoverDate = ref([]);
//请求数据逻辑
const queryEventsData = async (startDate, endDate, updateView) => {
    const res = await queryEvents(startDate, endDate);
    if (res.success) {
        const data = res.result.filter((i) => {
            const nonentity = !interfaceData.value.find((item) => {
                return item.date === i.date;
            });
            if (nonentity) {
                i.tags.forEach((item) => {
                    eventsData.value.push({
                        date: i.date,
                        id: item.id,
                        name: item.name,
                    });
                    initialData.value.push({
                        date: i.date,
                        id: item.id,
                        name: item.name,
                    });
                });
            }
        });
        interfaceData.value = [...interfaceData.value, ...data];
        if (updateView) {
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
    }
};
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
    // fullcalendar插件获取当前日期截至日期会多一天
    const endDate = dayjs(arg.view.activeEnd)
        .subtract(1, 'day')
        .format('YYYY-MM-DD');
    if (queryEndDate.value.includes(endDate)) {
        return;
    }
    queryEndDate.value.push(endDate);
    const answer = await getTagsColor();
    if (answer.success) {
        Object.keys(answer.result).forEach((i) => {
            colorMap.set(i, answer.result[i]);
        });
    }
    queryEventsData(startDate, endDate, true);
};
// 事件是否发生变化
const eventChange = computed(() => {
    return (
        JSON.stringify(eventsData.value) !== JSON.stringify(initialData.value)
    );
});
// 自定义切换月份逻辑
const handleCustomPrev = () => {
    calendarApi.value.prev();
    current.value = dayjs(current.value).subtract(1, 'month').format('YYYY-MM');
};
const handleCustomNext = () => {
    current.value = dayjs(current.value).add(1, 'month').format('YYYY-MM');
    calendarApi.value.next();
};
const handleCustomToday = () => {
    current.value = dayjs().format('YYYY-MM');
    calendarApi.value.today();
};
//保存编辑后的日历
const saveCalendar = async () => {
    let formatEventData = [];
    let submitData = [];
    eventsData.value.forEach((i) => {
        const existIndex = formatEventData.findIndex((item) => {
            return item.date === i.date;
        });
        if (existIndex !== -1) {
            formatEventData[existIndex]?.tags?.push({
                id: i.id,
                name: i.name,
            });
        } else {
            formatEventData.push({
                date: i.date,
                tags: [
                    {
                        id: i.id,
                        name: i.name,
                    },
                ],
            });
        }
    });
    const formatEventDataMap = new Map();
    formatEventData.map((i) => {
        formatEventDataMap.set(i.date, i);
    });
    submitData = cloneDeep(formatEventData);
    interfaceData.value?.forEach((i) => {
        if (!formatEventDataMap.has(i.date)) {
            submitData.push({
                date: i.date,
                tags: [],
            });
        }
    });
    const res = await saveEvents(submitData);
    if (res.success) {
        onlyMessage('操作成功');
        initialData.value = cloneDeep(eventsData.value);
    }
};
//获取两个时间段之间的所有日期
const getDatesBetween = (start, end) => {
    const dates = [];
    let currentDate = start.clone();
    while (currentDate.isBefore(end)) {
        dates.push(currentDate.format('YYYY-MM-DD'));
        currentDate = currentDate.add(1, 'day');
    }
    return dates;
};
//多选日期处理数据(原生拖拽逻辑)
const handleSelect = (selectionInfo) => {
    choiceStart.value = dayjs(selectionInfo.startStr);
    choiceEnd.value = dayjs(selectionInfo.endStr);
    emit('selectDate', {
        start: choiceStart.value.format('YYYY.MM.DD'),
        end: choiceEnd.value.subtract(1, 'day').format('YYYY.MM.DD'),
        days: choiceEnd.value.diff(choiceStart.value, 'day'),
    });
};
//多选日期处理数据(点击逻辑)
const handleDateClick = (selectInfo) => {
    if (!props.selectable) {
        return;
    }
    if (!choiceStart.value) {
        choiceStart.value = dayjs(selectInfo.dateStr);
        const selectedDate = document.querySelector(
            `.fc-day[data-date="${selectInfo.dateStr}"]`,
        );
        selectedDate.classList.add('selectedDate');
    } else {
        if (dayjs(selectInfo.dateStr).isBefore(choiceStart.value)) {
            onlyMessage('结束时间必须大于开始时间');
            return;
        }
        choiceEnd.value = dayjs(selectInfo.dateStr).add(1, 'day');
        emit('selectDate', {
            start: choiceStart.value.format('YYYY.MM.DD'),
            end: choiceEnd.value.subtract(1, 'day').format('YYYY.MM.DD'),
            days: choiceEnd.value.diff(choiceStart.value, 'day'),
        });
    }
};
//多选背景颜色渲染逻辑
const handleCellDidMount = (info) => {
    info.el.addEventListener('mouseenter', () => {
        const currentDate = dayjs(info.date);
        //每次移动清空之前所有的颜色
        if (lastHoverDate.value && !choiceEnd.value) {
            lastHoverDate.value.forEach((i) => {
                const selectedDate = document.querySelector(
                    `.fc-day[data-date="${i}"]`,
                );
                selectedDate.classList.remove('selectedDate');
            });
        }
        if (
            choiceStart.value &&
            currentDate.isAfter(choiceStart.value) &&
            !choiceEnd.value
        ) {
            const dateArr = getDatesBetween(
                choiceStart.value,
                currentDate.add(1, 'day'),
            );
            dateArr.forEach((i) => {
                const selectedDate = document.querySelector(
                    `.fc-day[data-date="${i}"]`,
                );
                selectedDate.classList.add('selectedDate');
            });
            lastHoverDate.value = dateArr;
            lastHoverDate.value.shift();
        }
    });
};
//插件配置项
const calendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
        start: '',
        center: '',
        end: '',
    },
    events: initialEventData.value,
    // selectable: props.selectable,
    unselectAuto: false,
    locale: locale,
    droppable: true,
    height: '720px',
    // select: handleSelect, //原生拖拽多选日期逻辑
    eventReceive: handleEventAdd,
    datesSet: handleViewDidMount,
    dateClick: handleDateClick,
    dayCellDidMount: handleCellDidMount,
};
// //编辑标签后刷新日历数据
// const refreshCalendar = () => {
//     handleViewDidMount(calendarApi.value);
// };
//对比函数(判断出日期相等但是标签id不同的事件和日期事件数量少于5的)
const compare = (effectData, eventsData) => {
    const addEvents = effectData.filter((i) => {
        const equality = eventsData.find((item) => {
            return i.date === item.date && i.id === item.id;
        });
        const exceed =
            eventsData.filter((item) => {
                return i.date === item.date;
            }).length >= 5;
        return !equality && !exceed;
    });
    return addEvents;
};
//快速作用
const rapidAction = async (effectDays) => {
    const dates = getDatesBetween(choiceStart.value, choiceEnd.value);
    //获取所选日期中所有的标签事件组成二维数组
    const selectData = dates.map((i) => {
        return eventsData.value.filter((item) => {
            return i === item.date;
        });
    });
    //创建一个长度为 影响天数的数组
    const effectData = Array.from({ length: effectDays });
    //循环数组添加日期和标签时间等数据
    for (let i = 0; i < effectData.length; i++) {
        effectData[i] = cloneDeep(selectData[i % selectData.length]);
        effectData[i]?.forEach((item) => {
            item.date = dayjs(item.date)
                .add(
                    selectData.length * Math.ceil((i + 1) / selectData.length),
                    'day',
                )
                .format('YYYY-MM-DD');
        });
    }
    //二维数组扁平成一维数组
    const effectDataArr = flatten(effectData);
    //查询所影响的日期的数据，做对比等逻辑处理（数据是只请求了页面显示过的日期所以需要请求影响的日期，以防没有数据导致重复事件）
    await queryEventsData(
        dayjs(choiceEnd.value).format('YYYY-MM-DD'),
        dayjs(choiceEnd.value)
            .add(effectDays - 1, 'day')
            .format('YYYY-MM-DD'),
        false,
    );
    const imparity = compare(effectDataArr, eventsData.value);
    eventsData.value = [...eventsData.value, ...imparity];
    const addEvents = imparity.map((i) => {
        return {
            id: i.id,
            title: i.name,
            start: i.date,
            backgroundColor: colorMap.get(i.id) || '#000000',
        };
    });
    //在已有事件基础上添加事件展示
    calendarApi.value.addEventSource(addEvents);
    onlyMessage('操作成功');
    emit('resetRapid');
};
//取消多选(原生)
// const reselection = () => {
//     calendarApi.value.unselect();
// };
//取消多选自定义
const reselection = () => {
    if (choiceStart.value) {
        lastHoverDate.value.push(dayjs(choiceStart.value).format('YYYY-MM-DD'));
    }
    if (choiceEnd.value) {
        lastHoverDate.value.push(dayjs(choiceStart.value).format('YYYY-MM-DD'));
    }
    lastHoverDate.value.forEach((i) => {
        const selectedDate = document.querySelector(
            `.fc-day[data-date="${i}"]`,
        );
        selectedDate.classList.remove('selectedDate');
    });
    (choiceStart.value = ''), (choiceEnd.value = '');
};
//重新获取数据
const refresh = () => {
    eventsData.value = [];
    initialData.value = [];
    interfaceData.value = [];
    queryEndDate.value = [];
    handleViewDidMount(calendarApi.value);
};
//日期切换
const changeDate = (date) => {
    calendarApi.value.gotoDate(date);
};
defineExpose({
    reselection,
    rapidAction,
    refresh,
});
watch(
    () => props.selectable,
    (val) => {
        calendarApi.value.setOption('droppable', !val);
        if (!val) {
            emit('resetRapid');
        }
    },
);
watch(
    () => tagsList.value,
    (val, oldVal) => {
        if (val?.length <= oldVal?.length) {
            const tagsMap = new Map();
            tagsList.value.forEach((i) => {
                tagsMap.set(i.id, {
                    name: i.name,
                    color: i.color,
                });
            });
            eventsData.value = eventsData.value.filter((i) => {
                return tagsMap.has(i.id);
            });
            initialEventData.value = eventsData.value.map((i) => {
                return {
                    id: i.id,
                    title: tagsMap.get(i.id)?.name,
                    start: i.date,
                    backgroundColor: tagsMap.get(i.id)?.color || '#000000',
                };
            });
            calendarApi.value.removeAllEvents();
            calendarApi.value.addEventSource(initialEventData.value);
        }
    },
    {
        deep: true,
    },
);
onMounted(() => {
    calendarApi.value = calendarEl.value.getApi();
    const calendarBody = document.querySelector(`.fc-view-harness`);
    calendarBody?.addEventListener('mousemove', (event) => {
        if (props.selectable) {
            showTips.value = true;
            mouseX.value = event.clientX;
            mouseY.value = event.clientY;
        }
    });
    calendarBody?.addEventListener('mouseout', () => {
        if (props.selectable) {
            showTips.value = false;
        }
    });
});
</script>
<style lang="less" scoped>
:deep(.fc-header-toolbar) {
    background-color: #edebeb;
}
.calendarContainer {
    position: relative;
    padding-top: 20px;
    .compareTip {
        position: absolute;
        right: 20%;
        top: 7px;
        transform: translateX(50%);
    }
    .compareSave {
        position: absolute;
        right: 0;
        top: 2px;
    }
    .calenderButton {
        position: absolute;
        top: 2px;
    }
    .event {
        position: relative;
        height: 30px;
        line-height: 30px;

        .closeBtn {
            position: absolute;
            right: 0;
            top: -5px;
            color: #fff;
            display: none;
        }
    }
    .event:hover {
        .closeBtn {
            display: inline-block;
        }
    }
    .event-title {
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 显示省略号 */
        width: calc(100% - 30px);
    }
}
:deep(.fc-highlight) {
    background-color: transparent;
}
.tips {
    position: fixed;
    z-index: 99999;
    padding: 5px 10px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 5px;
    color: white;
}
</style>
<style>
.selectedDate {
    background-color: rgb(234, 234, 255) !important;
}
</style>
