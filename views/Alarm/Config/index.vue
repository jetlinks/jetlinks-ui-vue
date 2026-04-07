<template>
  <j-page-container :tabList="list" @tabChange="onTabChange" :tabActiveKey="tab">
    <div v-if="tab == 'config'">
      <a-row :gutter="24">
        <a-col :span="14">
          <FullPage>
            <div class="alarm-level">
              <a-card
                :headStyle="{
                  borderBottom: 'none',
                  padding: 0,
                }"
                :bodyStyle="{ padding: 0 }"
                :bordered="false"
              >
                <template #title>
                  <div class="alarmLevelTitle">{{ $t('Config.index.945945-0') }}</div>
                </template>
                <div
                  v-for="(item, i) in levels"
                  :key="i"
                  class="alarmInputItem"
                >
                  <div>
                    <img :src="configImages.alarm[i]" alt="" />
                    <span>{{ $t('Config.index.945945-1', [i + 1]) }}</span>
                  </div>
                  <div>
                    <a-input
                      type="text"
                      v-model:value="item.title"
                      :maxlength="64"
                    ></a-input>
                  </div>
                </div>
              </a-card>
              <j-permission-button
                type="primary"
                size="middle"
                @click="handleSaveLevel"
                :hasPermission="alarmPermissionKey + ':update'"
                >{{ $t('Config.index.945945-2') }}</j-permission-button
              >
            </div>
          </FullPage>
        </a-col>
        <a-col :span="10">
          <FullPage>
            <div class="description">
              <h1>{{ $t('Config.index.945945-3') }}</h1>
              <div>
                {{ $t('Config.index.945945-4') }}
              </div>
              <div>{{ $t('Config.index.945945-5') }}</div>
              <div>{{ $t('Config.index.945945-6') }}</div>
            </div>
          </FullPage>
        </a-col>
      </a-row>
    </div>
    <Io v-else></Io>
  </j-page-container>
</template>

<script lang="ts" setup>
import { onlyMessage } from "@jetlinks-web/utils";
import { isNoCommunity } from '@jetlinks-web-core/utils/utils'
import { queryLevel, saveLevel } from "../../../api/config";
import Io from "./Io/index.vue";
import { configImages } from "../../../assets/index";
import { useI18n } from 'vue-i18n';
import { useMircoAppData } from '@jetlinks-web-core/hooks/useMircoApp'

const { t: $t } = useI18n();
const { data: AlarmConfigType } = useMircoAppData('platformName')
const alarmPermissionKey = inject('alarmPermissionKey', 'rule-engine/Alarm/Config')

const list = isNoCommunity && AlarmConfigType === 'iot'
  ? [
      {
        key: "config",
        tab: $t('Config.index.945945-7'),
      },
      {
        key: "io",
        tab: $t('Config.index.945945-8'),
      },
    ]
  : [
      {
        key: "config",
        tab: $t('Config.index.945945-7'),
      },
    ];

let levels = ref([]);
let tab = ref<"io" | "config" | string>("config");
const getAlarmLevel = () => {
  queryLevel().then((res: any) => {
    if (res.success) {
      levels.value = res.result.levels;
    }
  });
};
getAlarmLevel();
const handleSaveLevel = async () => {
  saveLevel(levels.value.map(item => ({level: item.level, title: item.title}))).then((res: any) => {
    if (res.success) {
      onlyMessage($t('Config.index.945945-9'));
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
  background-color: @primary-color;
  border-radius: 0 3px 3px 0;
  content: " ";
}
.alarmInputItem {
  margin-bottom: 22px;
}
.description {
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
