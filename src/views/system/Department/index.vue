<template>
  <j-page-container>
    <FullPage>
      <div class="department-container">
        <div class="left">
          <LeftTree @change="onChange" />
        </div>
        <div class="right">
          <a-tabs v-if='isNoCommunity && Object.keys(modules).length' v-model:activeKey="activeKey" destroyInactiveTabPane>
            <a-tab-pane key="product" :tab="$t('Department.index.945805-0')">
              <Product
                  v-if="Object.keys(modules).length"
                :parentId="departmentId"
                @open-device-bind="openDeviceBind"
              />
            </a-tab-pane>
            <a-tab-pane key="device" :tab="$t('Department.index.945805-1')">
              <Device
                :parentId="departmentId"
                v-model:bindBool="bindBool"
              />
            </a-tab-pane>
            <a-tab-pane key="user" :tab="$t('Department.index.945805-2')">
              <User :parentId="departmentId" />
            </a-tab-pane>
          </a-tabs>
          <User v-else :parentId="departmentId" />
        </div>
      </div>
    </FullPage>
  </j-page-container>
</template>

<script setup lang="ts" name="Department">
import LeftTree from './components/LeftTree.vue'
import User from './user/index.vue';
import Product from './product/index.vue';
import Device from './device/index.vue';
import { isNoCommunity } from "@/utils";

const modules = import.meta.glob('../../../modules/device-manager-ui/index.ts');

const activeKey = ref<'product' | 'device' | 'user'>('product');

const departmentId = ref<string>('');

const bindBool = ref<boolean>(false);
const openDeviceBind = () => {
  bindBool.value = true;
  activeKey.value = 'device';
};

const onChange = (id: string) => {
  departmentId.value = id
}
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
