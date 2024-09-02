<template>
    <div class="calendar">
        <div class="header" v-if="!view">
            <span>{{ type === 'auto' ? '录像时段' : '抓拍时间' }}: </span>
            <a-radio-group
                v-model:value="trigger"
                :disabled="disabled"
                @change="onChangeTirgger"
            >
                <a-radio value="week">按周</a-radio>
                <a-radio value="calender">自定义日历</a-radio>
            </a-radio-group>
        </div>
        <div class="content">
            <div class="top">
                <div
                    v-for="item in Array.from(Array(25), (v, k) => k)"
                    class="top-items"
                >
                    <div class="top-item">{{ item }}</div>
                </div>
            </div>
            <div class="item" v-for="item in list">
                <div class="item-label">
                    <j-ellipsis>
                        {{ item.label }}
                    </j-ellipsis>
                </div>
                <div class="item-content">
                    <div v-for="i in item?.times">
                        <div
                            v-if="i?.mod === 'once' && i.once.time"
                            class="item-content-point"
                            :style="handlePoint(i)"
                        >
                            <a-tooltip>
                                <template #title>
                                    <div
                                        v-for="p in handleTooltip(
                                            item?.points,
                                            i.once.time,
                                        )"
                                    >
                                        {{ p }}执行一次
                                    </div>
                                </template>
                                <!-- <a-badge status="processing" /> -->
                                <div style="width: 16px; height: 16px">
                                    <img
                                        :src="
                                            handleTooltip(
                                                item?.points,
                                                i.once.time,
                                            )?.length > 1
                                                ? getImage('/media/points.png')
                                                : getImage('/media/point.png')
                                        "
                                    />
                                </div>
                            </a-tooltip>
                        </div>
                        <div
                            v-else
                            :class="{
                                'item-content-box': true,
                                'item-content-box-bg':
                                    type === 'auto' ? false : true,
                            }"
                            :style="handleRange(i)"
                        >
                            <a-tooltip>
                                <template #title>
                                    {{
                                        handleRangeTooltip(item?.times, {
                                            from: i.from || i?.period?.from,
                                            to: i.to || i?.period?.to,
                                        })
                                    }}
                                </template>
                                <div style="width: 100%; height: 100%"></div>
                            </a-tooltip>
                        </div>
                    </div>
                </div>
                <div class="item-setting" v-if="!disabled">
                    <a-button @click="handleSetting(item)" size="small"
                        >设置</a-button
                    >
                </div>
            </div>
        </div>
    </div>
    <Setting
        v-if="visible"
        @close="visible = false"
        :data="record"
        :trigger="trigger"
        :options="list"
        :type="type"
        @save="onSave"
    />
</template>

<script setup lang="ts" name="Calendar">
import { weeks } from '../utils';
import { computed, onMounted, ref, watch } from 'vue';
import Setting from './Setting.vue';
import { onlyMessage, getImage } from '@/utils/comm';
import { queryTags } from '@/api/media/auto';
import { cloneDeep } from 'lodash-es';
import { formatTime } from '@/utils/utils';

const props = defineProps({
    value: {
        type: Array,
        default: [],
    },
    type: {
        type: String,
        default: 'auto',
    },
    trigger: {
        type: String,
        default: 'week',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    view: {
        type: Boolean,
        default: false,
    },
});

const emits = defineEmits(['update:value', 'update:trigger', 'change']);

const trigger = ref('week');
const visible = ref(false);
const record = ref<Record<string, any>>({});
const list = ref<any>([]);
const tags = ref([]);

const handleTime = (time: string) => {
    return time
        .split(':')
        .map(Number)
        .reduce((prev, next, index) => {
            let _time = index === 2 ? next : next * 60 ** (2 - index);
            prev += _time;
            return prev;
        }, 0);
};

const handleRange = (obj) => {
    const item = {
        from: '',
        to: '',
    };
    if (obj?.from && obj?.to) {
        item['from'] = obj.from;
        item['to'] = obj.to;
    }
    if (obj?.mod === 'period' && obj?.period && obj.period?.from) {
        item['from'] = obj.period?.from;
        item['to'] = obj.period.to;
    }

    const startTime = handleTime(item.from);
    const endTime = handleTime(item.to);

    const durationInSeconds = endTime - startTime;
    const secondsIn24Hours = 24 * 60 * 60;
    const width = (durationInSeconds / secondsIn24Hours) * 720;
    const left = (startTime / secondsIn24Hours) * 720 + 70;

    return { width: width + 'px', left: left + 'px', height: '20px' };
};

const handlePoint = (obj) => {
    if (obj?.mod === 'once' && obj?.once?.time) {
        const point = handleTime(obj.once.time);
        const res = Math.floor(point / 3600) * 30 + 78;
        return {
            left: `${res}px`,
        };
    }
};

const handleTooltip = (arr, one) => {
    const _one = Math.floor(handleTime(one) / 3600);
    const list = arr?.filter((item) => {
        const comm = Math.floor(handleTime(item) / 3600);
        if (comm === _one) {
            return true;
        }
        return false;
    });
    return list;
};

const handleSetting = (data) => {
    record.value = data;
    visible.value = true;
};

const onChangeTirgger = (e) => {
    initList(e.target.value);
    emits('update:trigger', e.target.value);
};

//合并数组
const mergeArray = (arr) => {
    return arr.map((item) => {
        const obj = list.value.find((i) => i.value === item.value);
        return {
            ...item,
            ...obj,
        };
    });
};

//合并数组段
const mergeArrays = (arr) => {
    const _arr = cloneDeep(arr);
    return _arr.reduce((prev, next) => {
        const item = prev?.find(
            (item) =>
                Math.max(next.start, item.start) <=
                Math.min(next.end, item.end),
        );

        if (item) {
            item.start = Math.min(item.start, next.start);
            item.end = Math.max(item.end, next.end);
        } else {
            prev.push(next);
        }

        return prev;
    }, []);
};

const handleRangeTooltip = (arr, obj) => {
    // console.log('arr====', arr, obj);
    const _arr = arr
        ?.map((i) => {
            if (i.from) {
                return {
                    start: handleTime(i.from),
                    end: handleTime(i.to),
                };
            } else {
                return {
                    start: handleTime(i?.period?.from || '00:00:00'),
                    end: handleTime(i?.period?.to || '00:00:00'),
                };
            }
        })
        .filter((i) => i);
    const item = mergeArrays(_arr)?.find((item) => {
        return (
            Math.max(handleTime(obj.from), item.start) <=
            Math.min(handleTime(obj.to), item.end)
        );
    });
    // console.log('_obj====', item, _arr);
    return `${formatTime(item.start * 1000)} - ${formatTime(
        item.end * 1000,
    )}周期执行`;
};

const initList = async (trigger) => {
    if (trigger === 'week') {
        list.value = mergeArray(cloneDeep(weeks));
    } else {
        const res = await queryTags();
        if (res.success) {
            tags.value = res.result.map((item) => ({
                label: item.name,
                value: item.id,
            }));
        }
        list.value = mergeArray(tags.value);
    }
};

const changList = (arr: any[], when: any[], points: any[]) => {
    // console.log('when====',when);
    // console.log('arr====',arr);
    list.value = list.value?.map((item: any) => {
        if (when.includes(item.value)) {
            item.times = arr.map((i) => ({
                ...i,
                when: item.when || [item.value],
            }));
            item.points = points;
        } else {
            item.times = item.times?.length ? item.times : [];
        }
        return item;
    });
    emits('change', list.value);
    emits('update:value', list.value);
    // console.log('list.value====', list.value);
};

const onSave = (records, when) => {
    const isFull = records?.every((item) => {
        if (item?.mod === 'period' && !item.period.from && item.period.every) {
            return false;
        }
        if (item?.mod === 'period' && item.period.from && !item.period.every) {
            return false;
        }
        return true;
    });
    if (isFull) {
        const points = [];
        records.forEach((item) => {
            if (item?.mod === 'once' && item?.once.time) {
                points.push(item?.once.time);
            }
        });
        changList(records, when, points);
        visible.value = false;
    } else {
        onlyMessage('请检查配置项', 'warning');
    }
};

watch(
    () => props.value,
    (val) => {
        if (val?.length) {
            list.value = props.value;
        } else {
            initList(props.trigger);
        }
    },
    { deep: true, immediate: true },
);

watch(
    () => props.trigger,
    () => {
        trigger.value = props.trigger;
    },
    { immediate: true },
);
</script>

<style lang="less" scoped>
.calendar {
    width: 100%;
    .header {
        margin-bottom: 12px;
    }
    .content {
        position: relative;
        padding-top: 35px;

        .top {
            display: flex;
            // margin-left: 70px;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 70px;
            // border: 1px solid #eee;
            border-left: 1px solid #0000000f;
            border-bottom: 1px solid #0000000f;
            border-top: 1px solid #0000000f;
            border-radius: 6px;

            .top-items {
                color: #1a1a1a;
                font-size: 12px;
                width: 30px;
                display: flex;
                justify-content: center;
                border-right: 1px solid #0000000f;
                border-radius: 6px;
                .top-item {
                    background-color: #fafafa;
                    width: 100%;
                    height: 35px;
                    line-height: 35px;
                    text-align: center;
                    border-bottom: 1px solid #0000000f;
                }
            }
        }
        .item {
            display: flex;
            position: relative;
            z-index: 10;
            .item-label {
                width: 70px;
                height: 35px;
                line-height: 35px;
                color: #000;
            }
            .item-content {
                width: 750px;
                border-radius: 6px;
                border-bottom: 1px solid #0000000f;
                .item-content-box {
                    background-color: #95de64;
                    height: 100%;
                    position: absolute;
                    top: 8px;
                }
                .item-content-box-bg {
                    background-color: rgba(22, 119, 255, 0.1);
                }
                .item-content-point {
                    position: absolute;
                    z-index: 10;
                    top: 6px;
                    img{
                        width: 100%;
                        // height: 100%;
                    }
                }
            }
            .item-setting {
                margin-left: 12px;
                height: 35px;
                line-height: 35px;
            }
        }
    }
}
</style>
