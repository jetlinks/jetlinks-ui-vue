<template>
    <page-container :tabList="list" @tabChange="onTabChange">
        <div v-if="true">
            <a-row :gutter="24">
                <a-col :span="14">
                    <div class="alarm-level">
                        <a-card :headStyle="{ borderBottom: 'none' }" :bodyStyle="{paddingTop:0}">
                            <template #title>
                                <div class="alarmLevelTitle">告警级别配置</div>
                            </template>
                            <div
                                v-for="(item, i) in levels"
                                :key="i"
                                class="alarmInputItem"
                            >
                                <div>
                                    <img
                                        :src="
                                            getImage(`/alarm/alarm${i + 1}.png`)
                                        "
                                        alt=""
                                    />
                                    <span>{{ `级别${i + 1}` }}</span>
                                </div>
                                <div>
                                    <a-input type="text" v-model:value="item.title" :maxlength=64></a-input>
                                </div>
                            </div>
                        </a-card>
                    </div>
                </a-col>
                <a-col :span="10">123</a-col>
            </a-row>
        </div>
    </page-container>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
import { queryLevel } from '@/api/rule-engine/config';
const list = ref([
    {
        key: 'config',
        tab: '告警级别',
    },
    {
        key: 'io',
        tab: '数据流转',
    },
]);
interface levelsObj {
    level: number;
    title?: string;
}
let levels = ref<levelsObj[]>([]);
const getAlarmLevel = () => {
    queryLevel().then((res: any) => {
        if (res.status == 200) {
            levels.value = res.result.levels;
        }
    });
};
getAlarmLevel();
const onTabChange = (e: string) => {};
</script>
<style lang="less" scoped>
.alarm-level {
    padding: 24px;
}
.alarmLevelTitle {
    position: relative;
    padding-left: 10px;
    color: rgba(0, 0, 0, 0.8);
    font-weight: 600;
    line-height: 1;
    margin-bottom: 16px;
}
.alarmLevelTitle::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: #1d39c4;
    border-radius: 0 3px 3px 0;
    content: ' ';
}
.alarmInputItem {
    margin-bottom: 22px;
}
</style>