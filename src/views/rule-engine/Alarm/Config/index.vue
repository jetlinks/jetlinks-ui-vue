<template>
    <page-container
        :tabList="list"
        @tabChange="onTabChange"
        :tabActiveKey="tab"
    >
        <div v-if="tab == 'config'">
            <j-row :gutter="24">
                <j-col :span="14">
                    <FullPage>
                        <div class="alarm-level">
                            <j-card
                                :headStyle="{
                                    borderBottom: 'none',
                                    padding: 0,
                                }"
                                :bodyStyle="{ padding: 0 }"
                                :bordered="false"
                            >
                                <template #title>
                                    <div class="alarmLevelTitle">
                                        告警级别配置
                                    </div>
                                </template>
                                <div
                                    v-for="(item, i) in levels"
                                    :key="i"
                                    class="alarmInputItem"
                                >
                                    <div>
                                        <img
                                            :src="
                                                getImage(
                                                    `/alarm/alarm${i + 1}.png`,
                                                )
                                            "
                                            alt=""
                                        />
                                        <span>{{ `级别${i + 1}` }}</span>
                                    </div>
                                    <div>
                                        <j-input
                                            type="text"
                                            v-model:value="item.title"
                                            :maxlength="64"
                                        ></j-input>
                                    </div>
                                </div>
                            </j-card>
                            <!-- <j-button
                            type="primary"
                            size="middle"
                            @click="handleSaveLevel"
                            >保存</j-button
                        > -->
                            <PermissionButton
                                type="primary"
                                size="middle"
                                @click="handleSaveLevel"
                                hasPermission="rule-engine/Alarm/Config:update"
                                >保存</PermissionButton
                            >
                        </div>
                    </FullPage>
                </j-col>
                <j-col :span="10">
                    <FullPage>
                        <div class="description">
                            <h1>功能说明</h1>
                            <div>
                                1、告警级别用于描述告警的严重程度，请根据业务管理方式进行自定义。
                            </div>
                            <div>2、告警级别将会在告警配置中被引用。</div>
                            <div>3、最多可配置5个级别。</div>
                        </div>
                    </FullPage>
                </j-col>
            </j-row>
        </div>
        <Io v-else></Io>
    </page-container>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
import { queryLevel, saveLevel } from '@/api/rule-engine/config';
import { LevelItem } from './typing';
import { message } from 'jetlinks-ui-components';
import Io from './Io/index.vue';
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
let levels = ref<LevelItem[]>([]);
let tab = ref<'io' | 'config' | string>('config');
const getAlarmLevel = () => {
    queryLevel().then((res: any) => {
        if (res.status == 200) {
            levels.value = res.result.levels;
        }
    });
};
getAlarmLevel();
const handleSaveLevel = async () => {
    saveLevel(levels.value).then((res) => {
        if (res.status === 200) {
            message.success('操作成功');
        }
    });
};
const onTabChange = (e: string) => {
    tab.value = e;
};
</script>
<style lang="less" scoped>
.alarm-level {
    padding: 24px;
    background-color: white;
    height: 700px;
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
.description {
    height: 700px;
    height: 100%;
    padding: 24px;
    overflow-y: auto;
    color: rgba(#000, 0.8);
    font-size: 14px;
    background-color: #fff;
    h1 {
        margin: 16px 0;
        color: rgba(#000, 0.85);
        font-weight: bold;
        font-size: 14px;
    }
}
</style>