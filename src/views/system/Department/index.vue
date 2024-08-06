<template>
    <page-container>
        <div class="department-warp">
          <div class='department-container'>
            <div class="left">
              <LeftTree @change="(id) => (departmentId = id)" />
            </div>
            <div class="right">
              <j-tabs v-if='isNoCommunity' v-model:activeKey="activeKey" destroyInactiveTabPane>
                <j-tab-pane key="product" :tab="$t('Department.index.338023-0')">
                  <Product
                    :parentId="departmentId"
                    @open-device-bind="openDeviceBind"
                  />
                </j-tab-pane>
                <j-tab-pane key="device" :tab="$t('Department.index.338023-1')">
                  <Device
                    :parentId="departmentId"
                    v-model:bindBool="bindBool"
                  />
                </j-tab-pane>
                <j-tab-pane key="user" :tab="$t('Department.index.338023-2')">
                  <User :parentId="departmentId" />
                </j-tab-pane>
              </j-tabs>
              <User :parentId="departmentId" v-else />
            </div>
          </div>
        </div>
    </page-container>
</template>

<script setup lang="ts" name="Department">
import LeftTree from './components/LeftTree.vue';
import Product from './product/index.vue';
import Device from './device/index.vue';
import User from './user/index.vue';
import { isNoCommunity } from '@/utils/utils'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const activeKey = ref<'product' | 'device' | 'user'>('product');

const departmentId = ref<string>('');

const bindBool = ref<boolean>(false);
const openDeviceBind = () => {
    bindBool.value = true;
    activeKey.value = 'device';
};
</script>

<style lang="less" scoped>
.department-warp {
  background-color: #fff;
  padding: 24px;
  .department-container {
      position: relative;

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
}
</style>
