<template>
  <div class="list">
    <div class="header">
      <a-space :size="12">
        <AIcon type="AppstoreOutlined" style="font-size: 18px" />
        <span style="font-size: 20px">{{ type === 'plugin' ? $t('Apply.ProtocolList.294910-6') : $t('Apply.ProtocolList.294910-0') }}</span>
        <span @click="handleClick('metadata')"
          >{{ $t('Apply.ProtocolList.294910-1') }} <span style="color: #1890ff"> {{ count }} </span></span
        >
      </a-space>
    </div>
    <div v-if="!!protocolList.length" class="protocol-items">
      <CardItem
        v-for="(item, index) in protocolList"
        type="protocol"
        v-model:value="protocolList[index]"
        :options="[
          { label: $t('Apply.ProtocolList.294910-2'), value: 'cover', icon: 'SyncOutlined' },
          { label: $t('Apply.ProtocolList.294910-3'), value: 'ignore', icon: 'icon-hulve' },
        ]"
      >
        <template #leftRender>
          <a-space :size="12" align="end">
            <div>
              <div style="color: #00000080">{{ type === 'plugin' ? $t('Apply.ProtocolList.294910-7') : $t('Apply.ProtocolList.294910-4') }}</div>
              <div class="protocol-item">
                <div class="protocol-item-img">
                  <img :src="device.deviceCard" />
                </div>
                <div class="protocol-item-text">
                  <j-ellipsis>
                    {{ item.name }}
                  </j-ellipsis>
                </div>
                <div class="protocol-item-version">
                  <j-ellipsis>
                    {{ item.configuration.version || "--" }}
                  </j-ellipsis>
                </div>
              </div>
            </div>
            <div>
              <AIcon
                type="ArrowRightOutlined"
                style="font-size: 18px; margin-bottom: 12px"
              />
            </div>
            <div>
              <div style="color: #00000080">{{ type === 'plugin' ? $t('Apply.ProtocolList.294910-8') : $t('Apply.ProtocolList.294910-5') }}</div>
              <div class="protocol-item">
                <div class="protocol-item-img">
                  <img :src="device.deviceCard" />
                </div>
                <div class="protocol-item-text">
                  <j-ellipsis>
                    {{ item.newProtocol?.name || "--" }}
                  </j-ellipsis>
                </div>
                <div class="protocol-item-version">
                  <j-ellipsis>
                    {{ item.newProtocol?.version || "--" }}
                  </j-ellipsis>
                </div>
              </div>
            </div>
          </a-space>
        </template>
      </CardItem>
    </div>
    <div style="padding: 100px 0;" v-else>
      <j-empty  />
    </div>
    <Product v-if="visible" :protocolList="protocolList" :type="type" @close="visible = false" />
  </div>
</template>

<script setup lang="ts" name="List">
import { device } from "@device-manager-ui/assets/device/index.ts";
import CardItem from "./CardItem.vue";
import Product from "./Product.vue";
import { _queryProtocol } from "@device-manager-ui/api/resource/resource.ts";

const props = defineProps({
  protocolList: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String,
    default: 'protocol' // plugin
  }
});

const route = useRoute();
const _id = route.params?.id as any;

const visible = ref(false);
// const productList = ref<any>([]);
const count = ref(0);

// 受协议影响的产品
const getProtocol = async () => {
  const res = await _queryProtocol(_id, props.type, props.type !== 'plugin' ? {
        terms: [
            {
              column: 'messageProtocol',
              termType: 'in',
              value: props.protocolList.map(item => item.id)
            }
        ]
      } :
      {
        "terms": [
          {
            "column": "access_id$prod-plugin",
            value: props.protocolList.map(item => item.id),
            "type": "and"
          }
        ]
      }
  );
  if (res.success) {
    count.value = res.result.total;
  }
};
const handleClick = (type: any) => {
  visible.value = true;
};

onMounted(() => {
  getProtocol();
});
</script>

<style lang="less" scoped>
.list {
  .header {
    padding-bottom: 12px;
    display: flex;
    justify-content: space-between;
  }
  .items {
    background-color: #eee;
    padding: 6px;
    border: 1px solid #eeeeee;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 190px;
    // max-height: 190px;
    // height: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
    &.items-expand {
      height: 100%;
    }
    .render-img {
      height: 56px;
      width: 56px;
      img {
        height: 100%;
        width: 100%;
      }
    }
  }
  .expand-btn {
    color: #1890ff;
    cursor: pointer;
    width: 100%;
    text-align: center;
  }
  .protocol-items {
    background-color: #eeeeee;
    padding: 6px;
    border: 1px solid #eeeeee;
    border-radius: 6px;
    display: flex;
    flex-direction: column;

    .protocol-item {
      display: flex;
      align-items: center;
      background-color: #eeeeee83;
      border-radius: 6px;
      padding: 6px;
      gap: 12px;
      .protocol-item-img {
        height: 30px;
        width: 30px;
        img {
          height: 100%;
          width: 100%;
        }
      }
      .protocol-item-text {
        width: 170px;
      }
      .protocol-item-version {
        width: 60px;
      }
    }
  }
}
</style>
