<template>
    <div class="calendar">
        <div class="header">
            <a-radio-group
                v-model:value="trigger"
                button-style="solid"
                @change="onChangeTirger"
            >
                <a-radio-button value="week">按周</a-radio-button>
                <a-radio-button value="calendar">自定义</a-radio-button>
            </a-radio-group>
        </div>
        <div class="content">
            <div
                class="top"
                :style="{ height: (list?.length + 1) * 40 + 'px' }"
            >
                <div v-for="item in Array.from(Array(25), (v, k) => k)" >
                    {{ item }}
                </div>
            </div>
            <div
                class="item"
                v-for="item in list"
                :style="{
                    bottom: list?.length * 40 + 'px',
                }"
                @click="onClick(item)"
            >
                <div class="item-label">{{ item.label }}</div>
                <div class="item-content">
                    <div v-for="i in item?.times">
                        <div
                            v-if="i?.mod === 'once'"
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
                                        {{ p }}
                                    </div>
                                </template>
                                <a-badge status="processing" />
                            </a-tooltip>
                        </div>
                        <div
                            v-else
                            class="item-content-box"
                            :style="handleRange(i)"
                        ></div>
                    </div>
                </div>
                <div class="item-setting">
                    <a-button @click="handleSetting(item)">设置</a-button>
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
import { onlyMessage } from '@/utils/comm';
import { queryTags } from '@/api/media/auto';
import { cloneDeep } from 'lodash-es';

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
});

const emits = defineEmits(['update:value','update:trigger' ,'change']);

const trigger = ref('week');
const visible = ref(false);
const record = ref<Record<string, any>>({});
const list = ref<any>([]);
const tags = ref([]);

const onClick = (item: any) => {
    console.log(item);
};

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
    return { width: width + 'px', left: left + 'px', height: '38px' };
};

const handlePoint = (obj) => {
    if (obj?.mod === 'once' && obj?.once?.time) {
        const point = handleTime(obj.once.time);
        const res = Math.floor(point / 3600) * 30 + 83;
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
    console.log('list====', list);
    return list;
};

const handleSetting = (data) => {
    record.value = data;
    visible.value = true;
};

const onChangeTirger = (e) => {
    initList(e.target.value);
    emits('update:trigger', e.target.value);
};

const initList = async (trigger,isFrist:boolean = true) => {
    const res = await queryTags();
    if (res.status === 200) {
        tags.value = res.result.map((item) => ({
            label: item.name,
            value: item.id,
        }));
    }
    if (trigger === 'week') {
        list.value = cloneDeep(weeks);
    } else {
        list.value = tags.value;
    }
   
};

const changList = (arr: any[], when: any[], points: any[]) => {
    list.value = list.value?.map((item: any) => {
        if (when.includes(item.value)) {
            item.times = arr;
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
    const isFull = records.every((item) => {
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
onMounted(() => {
    initList(props.trigger);
});

watch(
    () => props.value,
    () => {
        list.value = props.value;
    },
    { deep: true, immediate: true },
);

watch(
    () => props.trigger,
    () => {
        trigger.value = props.trigger;
        // initList(props.trigger)
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
        .top {
            display: flex;
            margin-left: 70px;

            > div {
                color: #666;
                font-size: 12px;
                width: 30px;
                display: flex;
                justify-content: center;
                border: 1px solid #eee;
                padding-top: 10px;
            }
        }
        .item {
            display: flex;
            position: relative;
            z-index: 10;
            .item-label {
                width: 70px;
                height: 40px;
                line-height: 40px;
            }
            .item-content {
                width: 750px;
                border-bottom: 1px solid #eee;
                border-top: 1px solid #eee;
                .item-content-box {
                    background-color: rgb(0, 185, 108);
                    height: 100%;
                    position: absolute;
                }
                .item-content-point {
                    position: absolute;
                    z-index: 10;
                    top: 10px;
                }
            }
            .item-setting {
                margin-left: 12px;
                height: 40px;
                line-height: 40px;
            }
        }
    }
}
</style>
