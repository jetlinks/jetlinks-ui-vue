<template>
    <div class="calendar">
        <div class="header">
            <a-radio-group v-model:value="trigger" button-style="solid">
                <a-radio-button value="week">按周</a-radio-button>
                <a-radio-button value="custom">自定义</a-radio-button>
            </a-radio-group>
        </div>
        <div class="content">
            <div class="top" :style="{ height: (list.length + 1) * 40 + 'px' }">
                <div v-for="item in Array.from(Array(25), (v, k) => k)">
                    {{ item }}
                </div>
            </div>
            <div
                class="item"
                v-for="item in list"
                :style="{
                    bottom: list.length * 40 + 'px',
                }"
                @click="onClick(item)"
            >
                <div class="item-label">{{ item.label }}</div>
                <div class="item-content">
                    <div
                        class="item-content-box"
                        :style="handleRes(item.times)"
                    ></div>
                </div>
                <div class="item-setting">
                    <a-button @click="handleSetting(item)">设置</a-button>
                </div>
            </div>
        </div>
    </div>
    <Setting v-if="visible" @close="visible = false" :data="record" :options="weeks"/>
</template>

<script setup lang="ts" name="Calendar">
import { weeks } from '../utils';
import { computed, ref } from 'vue';
import Setting from './Setting.vue'

const trigger = ref('week');
const visible = ref(false)
const record = ref<Record<string, any>>({});
const list = computed(() => (trigger.value === 'week' ? res : []));

const res = [
    {
        value: '1',
        label: '周一',
        times: [2, 12],
    },
    {
        value: '3',
        label: '周三',
        times: [2, 16],
    },
    {
        value: '1',
        label: '周一',
        times: [2, 12],
    },
    {
        value: '3',
        label: '周三',
        times: [2, 16],
    },
];

const onClick = (item: any) => {
    console.log(item);
};

const handleRes = (arr) => {
    const width = arr[1] * 30 - arr[0] * 30;
    const left = arr[0] * 30 + 30;
    return { width: width + 'px', left: left + 'px' };
};

const handleSetting = (data)=>{
    record.value = data
    visible.value = true
}

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
                    background-color: rgb(0, 110, 74);
                    height: 100%;
                    position: relative;
                }
            }
            .item-setting{
                margin-left: 12px;
                height: 40px;
                line-height: 40px;
            }
        }
    }
}
</style>
