<template>
  <a-modal
    open
    centered
    title="选择云端产品"
    :maskClosable="false"
    :width="1200"
    @cancel="emits('close')"
  >
    <template #footer>
      <a-button @click="emits('close')">取消</a-button>
      <a-button
        @click="
          emits('submit', {
            masterProductId: selectedRowKeys?.[0],
            edgeMasterId: northCurrent.id,
            productName: productCurrent.name,
            metadata: productCurrent.metadata,
          })
        "
        :disabled="!selectedRowKeys.length"
        type="primary"
        >确定</a-button
      >
    </template>
    <div class="container body_height_60">
      <div class="container_left">
        <template v-if="northList.length">
          <div
            v-for="i in northList"
            class="northItem"
            :class="{ selected: northCurrent?.id === i.id }"
            :key="i.id"
            @click="() => selectNorth(i)"
          >
            <j-ellipsis>{{ i.name || "--" }}</j-ellipsis>
          </div>
        </template>
        <j-empty v-else style="margin-top: 50%"> </j-empty>
      </div>
      <div class="container_right">
        <pro-search
          :columns="columns"
          type="simple"
          target="device-product-cloud"
          @search="handleSearch"
        ></pro-search>
        <div style="height: calc(100% - 3rem);">
          <j-pro-table
            mode="TABLE"
            :request="queryProduct"
            :params="params"
            :columns="columns"
            :showAlert="false"
            :defaultParams="{
              sorts: [{ name: 'createTime', order: 'desc' }],
              terms: [
                { column: 'deviceType', value: 'childrenDevice', type: 'and' },
                { column: 'state', value: 1 },
              ],
            }"
            :imageStyle="{
              width: '2.5rem',
              height: '2.5rem',
            }"
            :rowSelection="{
              selectedRowKeys,
              onSelect,
              onSelectNone,
              type: 'radio',
            }"
            ref="tableRef"
            style="box-sizing: border-box;"
            >
              <template #state="record">
                <j-badge-status
                  :status="record.state"
                  :statusNames="{
                    0: 'error',
                    1: 'success'
                  }"
                  :text="record.state === 1 ? '正常' : '禁用'"
                >
                </j-badge-status>
              </template>
          </j-pro-table>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { queryNorthList, queryCloudsProduct, getProviders } from "@device-manager-ui/api/product";
const emits = defineEmits(["close", "submit"]);
const northList = ref([]);
const northCurrent = ref();
const productCurrent = ref();
const selectedRowKeys = ref([]);
const tableRef = ref();
const params = ref({});
const providers = ref([]);

const columns = computed(() => {
  return [
    {
      dataIndex: 'id',
      title: 'ID',
      search: {
        type: 'string'
      }
    },
    {
      dataIndex: 'name',
      title: '产品名称',
      ellipsis: true,
      search: {
        type: 'string'
      }
    },
    {
      dataIndex: 'accessName',
      title: '接入方式',
      ellipsis: true
    },
    {
      dataIndex: 'state',
      title: '状态',
      scopedSlots: true,
      width: 80,
    },
    {
      dataIndex: "accessProvider",
      title: "网关类型",
      valueType: "accessProvider",
      hideInTable: true,
      search: {
        type: "select",
        options: providers.value,
      },
    },
  ];
});

const getNorth = async () => {
  const res = await queryNorthList({
    sorts: [{ name: "createTime", order: "desc" }],
  });
  if (res.success) {
    northList.value = res.result;
    northCurrent.value = res.result?.[0];
  }
};

const onSelect = (data) => {
  selectedRowKeys.value = [data.id];
  productCurrent.value = data;
};

const onSelectNone = () => {
  selectedRowKeys.value = [];
  productCurrent.value = {}
}

const queryProduct = async (params) => {
  if (!northCurrent.value) return {};
  const res = await queryCloudsProduct(northCurrent.value.id, params);
  return res;
};
const selectNorth = (data) => {
  northCurrent.value = data;
};

const handleSearch = (e) => {
  params.value = e;
};

const getProvidersTypes = async () => {
  const res = await getProviders();
  if (res.success) {
    providers.value = res.result
      .filter((i) => {
        return i.id !== "child-device";
      })
      .map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
  }
};

watch(
  () => {
    northCurrent.value;
  },
  () => {
    selectedRowKeys.value = [];
    tableRef.value?.reload();
  },
  {
    deep: true,
  }
);

onMounted(() => {
  getNorth();
  getProvidersTypes();
});
</script>
<style lang="less" scoped>
.container {
  display: flex;
  gap: 16px;

  .container_left {
    width: 300px;
    padding: 0.25rem;
    overflow: auto;
    .northItem {
      //text-align: center;
      padding: 0.3125rem;
      border-radius: 1rem;
      cursor: pointer;
      border: 0.125rem solid transparent;
    }
    .northItem:hover {
      background-color: #f2f2f2;
    }
    .selected {
      border: 0.125rem solid #797979;
    }
  }
  .container_right {
    flex: 1;
    min-width: 0;
    //padding: 1rem;
    height: 100%;
  }
}
.titleContainer {
  position: relative;
  .modalTitle {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 10%;
  }
}
</style>
