<template>
    <div class="calendarContainer" v-if="showCalendar">
        <div class="calenderButton">
          <a-space>
            <a-date-picker
                v-model:value="current"
                :disabled="selectable"
                format="YYYY-MM"
                picker="month"
                @change="changeDate"
                valueFormat="YYYY-MM"
            />
            <a-button @click="handleCustomPrev" :disabled="selectable"
                >{{ $t('FullCalendar.index.397640-0') }}</a-button
            >
            <a-button @click="handleCustomToday" :disabled="selectable"
                >{{ $t('FullCalendar.index.397640-1') }}</a-button
            >
            <a-button @click="handleCustomNext" :disabled="selectable"
                >{{ $t('FullCalendar.index.397640-2') }}</a-button
            >
          </a-space>
        </div>
        <a-button v-if="preview" class="skip" type="link" @click="gotoCalendar"
            >{{ $t('FullCalendar.index.397640-3') }}</a-button
        >
        <div class="compareTip" v-if="eventChange">
            {{ $t('FullCalendar.index.397640-4') }}
        </div>
        <div class="compareSave" v-if="eventChange">
            <j-permission-button
                type="primary"
                @click="saveCalendar"
                :disabled="selectable"
                >{{ $t('FullCalendar.index.397640-5') }}</j-permission-button
            >
        </div>
        <FullCalendar
            ref="calendarEl"
            class="calendar"
            :options="calendarOptions"
        >
            <template v-slot:eventContent="arg">
                <div class="event">
                    <div
                        class="decoration"
                        :style="{ backgroundColor: arg.backgroundColor }"
                    ></div>
                    <a-tooltip>
                        <template #title>{{ arg.event.title }}</template>
                        <div class="event-title">{{ arg.event.title }}</div>
                    </a-tooltip>
                    <a-button
                        v-if="!selectable && !preview"
                        type="text"
                        class="closeBtn"
                        @click="() => deleteEvent(arg)"
                        >x</a-button
                    >
                </div>
            </template>
        </FullCalendar>
        <div
            v-if="selectable && !choiceEnd && showTips"
            class="tips"
            :style="{ top: mouseY + 'px', left: mouseX + 20 + 'px' }"
        >
            {{ choiceStart ? $t('FullCalendar.index.397640-6') : $t('FullCalendar.index.397640-7') }}
        </div>
    </div>
</template>

<script setup name="FullCalendar">
import FullCalendar from '@fullcalendar/vue3';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import locale from '@fullcalendar/core/locales/zh-cn';
import { onlyMessage } from '@jetlinks-web/utils';
import dayjs from 'dayjs';
import { queryEvents, saveEvents } from '@/api/system/calendar';
import { cloneDeep, flatten } from 'lodash-es';
import { defineExpose } from 'vue';
import { inject } from 'vue';
import { useMenuStore } from '@/store/menu';
import { useSystemStore } from '@/store/system';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
    selectable: {
        type: String,
        default: false,
    },
    preview: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(['selectDate', 'resetRapid']);
const menuStory = useMenuStore();
const system = useSystemStore();
const showCalendar = ref(false);
const calendarTagColor = system.calendarTagColor;
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
                        name: item.i18nName || item.name,
                    });
                    initialData.value.push({
                        date: i.date,
                        id: item.id,
                        name: item.i18nName || item.name,
                    });
                });
            }
            return nonentity;
        });
        interfaceData.value = [...interfaceData.value, ...data];
        if (updateView) {
            initialEventData.value = eventsData.value.map((i) => {
                return {
                    id: i.id,
                    title: i.name,
                    start: i.date,
                    backgroundColor: calendarTagColor.get(i.id) || '#000000',
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
        onlyMessage($t('FullCalendar.index.397640-8'), 'error');
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
    if (calendarTagColor.size === 0) {
        await system.queryTagsColor();
    }
    await queryEventsData(startDate, endDate, true);
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
        onlyMessage($t('FullCalendar.index.397640-9'));
        // initialData.value = cloneDeep(eventsData.value);
        refresh();
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
    } else if(!choiceEnd.value) {
        if (dayjs(selectInfo.dateStr).isBefore(choiceStart.value)) {
            onlyMessage($t('FullCalendar.index.397640-10'));
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
    height: props.preview ? '600px' : '620px',
    // select: handleSelect, //原生拖拽多选日期逻辑
    eventReceive: handleEventAdd,
    datesSet: handleViewDidMount,
    dateClick: handleDateClick,
    dayCellDidMount: handleCellDidMount,
    //星期只显示数字
    dayHeaderContent: function (arg) {
        return arg.date.toLocaleDateString('default', { weekday: 'narrow' });
    },
    dayCellContent: function (e) {
        return {
            html: '<div class="custom-day-cell">' + e.date.getDate() + '</div>',
        };
    },
};
// //编辑标签后刷新日历数据
// const refreshCalendar = () => {
//     handleViewDidMount(calendarApi.value);
// };
//对比函数(判断出日期相等但是标签id不同的事件和日期事件数量少于5的)
const compare = (effectData, eventsData, effectDates) => {
    //获取新增的事件
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
    const filterDate = [];
    //比对新增事件 + 原本事件 > 5 的日期
    effectDates.forEach((i) => {
        const addEventNumber = addEvents.filter((item) => {
            return i === item.date;
        }).length;
        const eventNumber = eventsData.filter((item) => {
            return i === item.date;
        }).length;
        if (addEventNumber + eventNumber > 5) {
            filterDate.push(i);
        }
    });
    // 过滤掉日期影响后 >5 的新增事件
    const filteredEvents = addEvents.filter((i) => {
        return !filterDate.includes(i.date);
    });
    return filteredEvents;
};
//快速作用
const rapidAction = async (effectDays) => {
    const dates = getDatesBetween(choiceStart.value, choiceEnd.value);
    const effectDates = getDatesBetween(
        choiceEnd.value,
        choiceEnd.value.add(effectDays, 'day'),
    );
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
        if (effectData[i].length) {
            effectData[i].forEach((item) => {
                item.date = dayjs(item.date)
                    .add(
                        selectData.length *
                            Math.ceil((i + 1) / selectData.length),
                        'day',
                    )
                    .format('YYYY-MM-DD');
            });
        } else {
            eventsData.value = eventsData.value.filter((item) => {
                console.log(effectData[i]);
                return item.date !== effectDates[i];
            });
        }
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
    const imparity = compare(effectDataArr, eventsData.value, effectDates);
    eventsData.value = [...eventsData.value, ...imparity];
    initialEventData.value = eventsData.value.map((i) => {
        return {
            id: i.id,
            title: i.name,
            start: i.date,
            backgroundColor: calendarTagColor.get(i.id) || '#000000',
        };
    });
    calendarApi.value.removeAllEvents();
    calendarApi.value.addEventSource(initialEventData.value);
    onlyMessage($t('FullCalendar.index.397640-9'));
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

const gotoCalendar = () => {
    menuStory.jumpPage('system/Calendar', {});
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
    () => tagsList?.value,
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
setTimeout(() => {
    showCalendar.value = true;
    nextTick(() => {
        calendarApi.value = calendarEl.value?.getApi();
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
}, 300);
</script>
<style lang="less" scoped>
:deep(.fc-header-toolbar) {
    background-color: #edebeb;
}
.calendarContainer {
    position: relative;
    padding: 44px 24px 0;
    border: 1px solid #d9d9d9;
    border-radius: 12px;
    .compareTip {
        position: absolute;
        right: 20%;
        top: 27px;
        transform: translateX(40%);
    }
    .skip {
        position: absolute;
        right: 0;
        top: 27px;
    }
    .compareSave {
        position: absolute;
        right: 10px;
        top: 22px;
    }
    .calenderButton {
        position: absolute;
        top: 22px;
    }
    .event {
        position: relative;
        height: 32px;
        padding: 6px;
        color: #1a1a1a;
        display: flex;

        .closeBtn {
            position: absolute;
            right: 0;
            top: 0;
            color: #777777;
            display: none;
            font-size: 16px;
        }
    }
    .event:hover {
        .closeBtn {
            display: inline-block;
        }
    }
    .decoration {
        width: 4px;
        height: 16px;
        border-radius: 2px;
        margin: 2px 4px;
        display: inline-block;
    }
    .event-title {
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 显示省略号 */
        width: calc(100% - 30px);
        font-size: 14px;
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
:deep(.fc-theme-standard th) {
    border: none;
}
:deep(.fc-theme-standard td) {
    border: none;
    border-top: 1px solid #cccccc;
}
:deep(.fc-theme-standard .fc-scrollgrid) {
    border: none;
}
:deep(.fc) {
    .fc-col-header-cell-cushion {
        color: #777777;
    }
    th {
        text-align: right;
        color: #777777;
    }
    table {
        border-collapse: separate;
        border-spacing: 5px 0;
    }
    .fc-daygrid-day.fc-day-today {
        background-color: transparent;
        .fc-daygrid-day-number {
            background-color: #1677ff;
            color: white;
            border-radius: 50%;
            width: 30px;
            text-align: center;
        }
    }
    .fc-event {
        border: none !important;
    }
    .fc-daygrid-event-harness {
        margin: 0 4px;
        margin-top: 4px !important;
        border-radius: 6px;
    }
    .fc-daygrid-day-frame {
        height: 155px;
        .fc-daygrid-day-events {
            max-height: 120px;
            overflow-y: auto;
            &::-webkit-scrollbar-thumb {
                background-color: #d0d0d0; /* 滚动条拖动部分颜色 */
                border-radius: 4px; /* 滚动条拖动部分圆角 */
            }
        }
    }
    .fc-scroller {
        &::-webkit-scrollbar {
            width: 5px; /* 滚动条宽度 */
            background-color: #fff; /* 滚动条背景色 */
        }
        &::-webkit-scrollbar-thumb {
            background-color: #d0d0d0; /* 滚动条拖动部分颜色 */
            border-radius: 4px; /* 滚动条拖动部分圆角 */
        }
    }
}
:deep(.fc-scrollgrid-section-body > td) {
    border: none !important;
}
:deep(.fc-daygrid-day-number) {
    color: #1a1a1a;
    font-weight: 600;
}
</style>
<style>
.calendarContainer {
    .fc-event {
        background: #edf5ff !important;
    }
    .fc-daygrid-day-events {
        &::-webkit-scrollbar {
            width: 5px; /* 滚动条宽度 */
            background-color: #fff; /* 滚动条背景色 */
        }
    }
}

.selectedDate {
    background-color: #edf5ff !important;
    .fc-event {
        background: #fff !important;
    }
    .fc-daygrid-day-events {
        &::-webkit-scrollbar {
            width: 5px; /* 滚动条宽度 */
            background-color: #edf5ff; /* 滚动条背景色 */
        }
    }
}
</style>
