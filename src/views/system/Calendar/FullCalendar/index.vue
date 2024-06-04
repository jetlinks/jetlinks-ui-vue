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
            <PermissionButton type="link" @click="saveCalendar"
                >确认</PermissionButton
            >
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
                    initialData.value.push({
                        date: i.date,
                        id: item.id,
                        name: item.name,
                    });
                });
            });
            // initialData.value = cloneDeep(eventsData.value);
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
// 事件是否发生变化
const eventChange = computed(() => {
    return (
        JSON.stringify(eventsData.value) !== JSON.stringify(initialData.value)
    );
});
// 自定义切换月份逻辑
const handleCustomPrev = () => {
    calendarApi.value.prev();
};
const handleCustomNext = () => {
    calendarApi.value.next();
};
//保存编辑后的日历
const saveCalendar = async () => {
    let submitDate = [];
    eventsData.value.forEach((i) => {
        const existIndex = submitDate.findIndex((item) => {
            return item.date === i.date;
        });
        if (existIndex !== -1) {
            submitDate[existIndex]?.tags?.push({
                id: i.id,
                name: i.name,
            });
        } else {
            submitDate.push({
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
    const res = await saveEvents(submitDate);
    if (res.status === 200) {
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
//多选日期处理数据
const handleSelect = (selectionInfo) => {
    choiceStart.value = dayjs(selectionInfo.startStr);
    choiceEnd.value = dayjs(selectionInfo.endStr);
    emit('selectDate', {
        start: choiceStart.value.format('YYYY.MM.DD'),
        end: choiceEnd.value.subtract(1, 'day').format('YYYY.MM.DD'),
        days: choiceEnd.value.diff(choiceStart.value, 'day'),
    });
};
//插件配置项
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
        center: 'title',
        end: '',
    },
    views: {
        doubleMonth: {
            type: 'dayGridMonth',
            duration: { months: 2 }, // Show two months
        },
    },
    events: initialEventData.value,
    selectable: props.selectable,
    unselectAuto: false,
    locale: locale,
    droppable: true,
    height: '740px',
    drop: function (info) {},
    select: handleSelect,
    eventReceive: handleEventAdd,
    datesSet: handleViewDidMount,
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
//请求需要快速作用的日期的数据作比较
const queryRapidDateEvent = async (startDate, endDate) => {
    const res = await queryEvents(startDate, endDate);
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
                initialData.value.push({
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
    }
    console.log(interfaceData.value);
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
    await queryRapidDateEvent(
        dayjs(choiceEnd.value).format('YYYY-MM-DD'),
        dayjs(choiceEnd.value)
            .add(effectDays - 1, 'day')
            .format('YYYY-MM-DD'),
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
    emit('resetRapid');
};
//取消多选
const reselection = () => {
    calendarApi.value.unselect();
};
defineExpose({
    reselection,
    rapidAction,
});
watch(
    () => props.selectable,
    (val) => {
        calendarApi.value.setOption('selectable', val);
        if (!val) {
            emit('resetRapid');
        }
    },
);
watch(
    () => tagsList.value,
    (val, oldVal) => {
        if (val?.length === oldVal?.length) {
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
});
</script>
<style lang="less" scoped>
:deep(.fc-header-toolbar) {
    background-color: #edebeb;
}
.calendarContainer {
    position: relative;
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
        display: none;
    }
}
.event:hover {
    .closeBtn {
        display: inline-block;
    }
}
</style>
