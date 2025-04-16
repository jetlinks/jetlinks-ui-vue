<template>
  <j-page-container>
    <FullPage>
      <div class="department-container">
        <div class="left">
          <LeftTree @change="onChange" />
        </div>
        <div class="right">
          <a-tabs
            v-if="isNoCommunity && extraComponents?.length"
            v-model:activeKey="activeKey"
            destroyInactiveTabPane
          >
            <a-tab-pane
              v-for="item in extraComponents"
              :key="item.name"
              :tab="$t(item.label)"
            >
              <component
                :is="item.component"
                :parentId="departmentId"
                @open-device-bind="openDeviceBind"
                v-model:bindBool="bindBool"
              />
            </a-tab-pane>
            <a-tab-pane key="position" :tab="$t('Department.index.945805-3')">
              <Position :parentId="departmentId" @changeTabs="onChangeTabs" />
            </a-tab-pane>
            <a-tab-pane key="user" :tab="$t('Department.index.945805-2')">
              <User :parentId="departmentId" :positionId="positionId" />
            </a-tab-pane>
          </a-tabs>
          <User v-else :parentId="departmentId" />
        </div>
      </div>
    </FullPage>
  </j-page-container>
</template>

<script setup lang="ts" name="Department">
import LeftTree from "./components/LeftTree.vue";
import User from "./user/index.vue";
import Position from "./positions/index.vue";
import { getModulesComponents, isNoCommunity } from "@/utils";

const activeKey = ref<"product" | "device" | "user">("product");

const departmentId = ref<string>("");
const positionId = ref<string>("");
const extraComponents = ref([]);

const bindBool = ref<boolean>(false);
const openDeviceBind = () => {
  bindBool.value = true;
  activeKey.value = "device";
};

const onChange = (id: string) => {
  departmentId.value = id;
  if (!id) {
    console.log('1111111')
  }
};

const onChangeTabs = (id) => {
  positionId.value = id;
  activeKey.value = "user";
  setTimeout(() => {
    positionId.value = undefined;
  }, 100);
};

onMounted(() => {
  extraComponents.value = getModulesComponents("department");
});
</script>

<style lang="less" scoped>
.department-container {
  display: flex;
  background-color: #fff;
  padding: 24px;
  height: 100%;

  .left {
    position: absolute;
    height: 100%;
    width: 300px;
  }

  .right {
    width: calc(100% - 316px);
    margin-left: 316px;
    :deep(.ant-tabs-nav-wrap) {
      padding-left: 24px;
    }
  }
}
</style>
