<template>
  <j-page-container>
    <FullPage>
      <div class="department-container">
        <div class="left">
          <LeftTree @change="onChange" />
        </div>
        <div class="right">
<!--           && extraComponents?.length-->
          <a-tabs
            v-if="isNoCommunity"
            v-model:activeKey="activeKey"
            destroyInactiveTabPane
          >
            <a-tab-pane key="position" :tab="$t('Department.index.945805-3')">
              <Position :parentId="departmentId" @changeTabs="onChangeTabs" />
            </a-tab-pane>
            <a-tab-pane key="user" :tab="$t('Department.index.945805-2')">
              <User :parentId="departmentId" :positionId="positionId" />
            </a-tab-pane>
            <a-tab-pane key="property" :tab="$t('Department.index.945805-4')">
              <Property :department-id="departmentId" />
            </a-tab-pane>
            <!-- <a-tab-pane
              v-for="item in _extra"
              :key="item.name"
              :tab="$t(item.label)"
            >
              <component
                :is="item.component"
                :parentId="departmentId"
                @open-device-bind="openDeviceBind"
                v-model:bindBool="bindBool"
              />
            </a-tab-pane> -->
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
import { isNoCommunity } from "@jetlinks-web-core/utils";
import Product from './product/index.vue'
import Device from './device/index.vue'
import Property from './property/index.vue'

const activeKey = ref<"product" | "device" | "user" | "position">("position");

const departmentId = ref<string>("");
const positionId = ref<string>("");
const extraComponents = ref([]);

const bindBool = ref<boolean>(false);

// const hasPerm = useAuthStore().hasPermission(
//     // `${USER_CENTER_MENU_CODE}:${USER_CENTER_MENU_BUTTON_CODE}`,
// )

const _extra = [
  {
    name: 'product',
    label: 'Department.index.945805-0',
    component: Product
  },
  {
    name: 'device',
    label: 'Department.index.945805-1',
    component: Device
  },
]
const openDeviceBind = () => {
  bindBool.value = true;
  activeKey.value = "device";
};

const onChange = (id: string) => {
  departmentId.value = id;
};

const onChangeTabs = (id) => {
  positionId.value = id;
  activeKey.value = "user";
  setTimeout(() => {
    positionId.value = undefined;
  }, 100);
};

// onMounted(() => {
//   extraComponents.value = getModulesComponents("department");
// });
</script>

<style lang="less" scoped>
.department-container {
  display: flex;
  background-color: #fff;
  padding: 24px;
  height: 100%;
  position: relative;

  .left {
    position: absolute;
    width: 300px;
    top: 24px;
    bottom: 24px;
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
