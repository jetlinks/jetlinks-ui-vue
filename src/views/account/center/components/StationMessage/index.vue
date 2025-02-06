<template>
  <div style="padding-right: 20px">
    <a-tabs
      tab-position="left"
      v-if="tabs.length"
      :destroyInactiveTabPane="true"
      v-model:activeKey="user.other.tabKey"
    >
      <a-tab-pane v-for="item in tabs" :key="item.provider" :tab="item.name">
        <NotificationRecord :type="item.provider" />
      </a-tab-pane>
    </a-tabs>
    <j-empty v-else style="margin: 200px 0" />
  </div>
</template>

<script lang="ts" setup>
import NotificationRecord from "./components/NotificationRecord/index.vue";
import { getInitData } from "../data";
import { getAllNotice } from "@/api/account/center";
import { useRouterParams } from "@jetlinks-web/hooks";
import { useUserStore } from "@/store/user";
import { omit } from "lodash-es";

const tabs = ref<any[]>([]);
const router = useRouterParams();
const user = useUserStore();
// let initData: any[]
const queryTypeList = () => {
  getAllNotice().then((resp: any) => {
    if (resp.status === 200) {
      const dataMap = new Map();
      resp.result.forEach((i: any) => {
        if (!dataMap.has(i.type.id)) {
          dataMap.set(i.type.id, {
            name: i.type.name,
            provider: i.type.id,
            children: [
              {
                ...omit(i, ["type"]),
              },
            ],
          });
        } else {
          dataMap.get(i.type.id).children.push({
            ...omit(i, ["type"]),
          });
        }
      });
      tabs.value = [...dataMap.values()];
      if (!user.other.tabKey) {
        user.other.tabKey = tabs.value?.[0]?.provider;
      }
    }
  });
};

watchEffect(() => {
  if (router.params.value?.other?.tabKey) {
    user.other.tabKey = router.params.value?.other?.tabKey;
  }
  if (router.params?.value.row) {
    if (
      ["device-transparent-codec"].includes(
        router.params?.value.row.topicProvider
      )
    ) {
      user.other.tabKey = "system-business";
    }
    if (["system-event"].includes(router.params?.value.row.topicProvider)) {
      user.other.tabKey = "system-monitor";
    }
    if (
      [
        "workflow-task-cc",
        "workflow-task-todo",
        "workflow-task-reject",
        "workflow-process-finish",
        "workflow-process-repealed",
        "workflow-task-transfer-todo",
      ].includes(router.params?.value.row.topicProvider)
    ) {
      user.other.tabKey = "workflow-notification";
    }
  }
});

onMounted(() => {
  queryTypeList();
});
</script>
