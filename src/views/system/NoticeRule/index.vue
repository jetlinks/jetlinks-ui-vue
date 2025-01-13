<template>
  <j-page-container>
    <FullPage>
      <div class="content">
        <div style="margin-bottom: 15px">
          <div class="alert">
            <AIcon type="InfoCircleOutlined" />
            {{ $t("NoticeRule.index.804848-0") }}
          </div>
        </div>
        <div class="content-collapse">
          <a-collapse
            :bordered="false"
            v-model:activeKey="activeKey"
            expand-icon-position="right"
          >
            <template #expandIcon="{ isActive }">
              <AIcon
                type="CaretRightOutlined"
                :style="{
                  transform: `rotate(${isActive ? 90 : 0}deg)`,
                }"
              />
            </template>
            <a-collapse-panel v-for="item in tabs" :key="item.provider">
              <template #header>
                <div>
                  {{ item.name }}
                  <span
                    style="margin-left: 10px"
                    class="alert"
                    v-if="item.provider === 'alarm'"
                    >{{ $t("NoticeRule.index.804848-1") }}</span
                  >
                </div>
              </template>
              <div>
                <template
                  v-for="(child, index) in item.children"
                  :key="child.provider"
                >
                  <Item
                    :data="child"
                    @refresh="onRefresh"
                    :isLast="index === item.children?.length"
                    :provider="item.provider"
                  />
                </template>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </div>
    </FullPage>
  </j-page-container>
</template>

<script lang="ts" setup>
import { queryChannelConfig } from "@/api/system/noticeRule";
import Item from "./components/Item/index.vue";
import { omit } from "lodash-es";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();

const activeKey = ref<string[]>([]);
const tabs = ref<any[]>([]);
const handleSearch = () => {
  queryChannelConfig().then((resp) => {
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
          activeKey.value.push(i.type.id);
        } else {
          dataMap.get(i.type.id).children.push({
            ...omit(i, ["type"]),
          });
        }
      });
      tabs.value = [...dataMap.values()];
    }
  });
};

const onRefresh = () => {
  handleSearch();
};

onMounted(() => {
  handleSearch();
});
</script>

<style lang="less" scoped>
.content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  justify-content: space-between;
  height: 100%;

  .btn {
    padding: 24px 0;
    width: 100%;
    background-color: #fff;
  }
}
.alert {
  padding-left: 10px;
  color: rgba(0, 0, 0, 0.55);
}

.content-collapse {
  overflow-y: auto;
  flex: 1 1 0;
  min-height: 0;

  :deep(.ant-collapse) {
    border-color: #ebeef3;
    background-color: #fff;

    .ant-collapse-item {
      border: 1px solid #ebeef3;
      margin-bottom: 24px;
    }

    .ant-collapse-header {
      background-color: #f7f8fa;
      height: 42px;
    }
    .ant-collapse-content {
      padding: 17px 21px 7px 21px;
    }

    .ant-collapse-content-box {
      padding: 0;
    }
  }
}
</style>
