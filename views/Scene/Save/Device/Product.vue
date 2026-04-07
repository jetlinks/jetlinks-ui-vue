<template>
  <pro-search
    :columns="columns"
    type="simple"
    @search="handleSearch"
    class="scene-search"
    target="scene-triggrt-device-device"
  />
  <a-divider style="margin: 0" />
  <j-pro-table
    ref="actionRef"
    mode="CARD"
    :columns="columns"
    :params="params"
    :request="productQuery"
    :gridColumn="2"
    :gridColumns="[2, 2, 2]"
    :bodyStyle="{
      paddingRight: 0,
      paddingLeft: 0,
    }"
  >
    <template #card="slotProps">
      <CardBox
        :value="slotProps"
        :active="rowKey === slotProps.id"
        :status="slotProps.state"
        :statusText="slotProps.state === 1 ? $t('Device.Product.372522-0') : $t('Device.Product.372522-1')"
        :statusNames="{ 1: 'processing', 0: 'error' }"
        @click="handleClick"
      >
        <template #img>
          <slot name="img">
            <Image
              :src="slotProps.photoUrl ||
                                sceneImages.deviceProduct"
              class="card-list-img-80"
            />
          </slot>
        </template>
        <template #content>
          <div style="width: calc(100% - 100px)">
            <j-ellipsis>
              <span style="font-size: 16px; font-weight: 600">
                {{ slotProps.name }}
              </span>
            </j-ellipsis>
          </div>
          <a-row>
            <a-col :span="12">
              <div class="card-item-content-text">{{ $t('Device.Product.372522-2') }}</div>
              <div>{{ slotProps.deviceType?.text }}</div>
            </a-col>
          </a-row>
        </template>
      </CardBox>
    </template>
  </j-pro-table>
</template>

<script setup lang="ts" name="Product">
import {
  getProviders,
  queryGatewayList,
  queryProductList,
  queryProductSortTree,
} from "@rule-engine-manager-ui/api/others";
import { getTreeData_api } from "@rule-engine-manager-ui/api/department";
import { sceneImages } from "@rule-engine-manager-ui/assets/index";
import { accessConfigTypeFilter } from "@rule-engine-manager-ui/utils/setting";
import { useI18n } from 'vue-i18n'
import { useTermOptions } from '@jetlinks-web/components/es/Search/hooks/useTermOptions'

const { t: $t } = useI18n()
type Emit = {
  (e: "update:rowKey", data: string): void;
  (e: "update:detail", data: string): void;
  (e: "change", data: string): void;
};

const actionRef = ref();
const params = ref({});
const props = defineProps({
  rowKey: {
    type: String,
    default: "",
  },
  detail: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits<Emit>();
const firstFind = ref(true);

const { termOptions } = useTermOptions({ pick: ['eq']})

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    width: 300,
    ellipsis: true,
    fixed: "left",
    search: {
      type: "string",
    },
  },
  {
    title: $t('Device.Product.372522-3'),
    dataIndex: "name",
    width: 200,
    ellipsis: true,
    search: {
      type: "string",
      first: true,
    },
  },
  {
    title: $t('Device.Product.372522-4'),
    dataIndex: "accessProvider",
    width: 150,
    ellipsis: true,
    hideInTable: true,
    search: {
      type: "select",
      options: () =>
        getProviders().then((resp: any) => {
          return accessConfigTypeFilter(resp.result || []);
        }),
    },
  },
  {
    title: $t('Device.Product.372522-5'),
    dataIndex: "accessId",
    width: 150,
    ellipsis: true,
    search: {
      type: "select",
      options: () =>
        queryGatewayList().then((resp: any) =>
          resp.result.map((item: any) => ({
            label: item.name,
            value: item.id,
          }))
        ),
    },
  },
  {
    title: $t('Device.Product.372522-2'),
    dataIndex: "deviceType",
    width: 150,
    search: {
      type: "select",
      options: [
        { label: $t('Device.Product.372522-6'), value: "device" },
        { label: $t('Device.Product.372522-7'), value: "childrenDevice" },
        { label: $t('Device.Product.372522-8'), value: "gateway" },
      ],
    },
  },
  {
    title: $t('Device.Product.372522-9'),
    dataIndex: "state",
    width: "90px",
    search: {
      type: "select",
      options: [
        { label: $t('Device.Product.372522-1'), value: 0 },
        { label: $t('Device.Product.372522-0'), value: 1 },
      ],
    },
  },
  {
    title: $t('Device.Product.372522-10'),
    dataIndex: "describe",
    ellipsis: true,
    width: 300,
  },
  {
    dataIndex: "classifiedId",
    title: $t('Device.Product.372522-11'),
    hideInTable: true,
    search: {
      type: "treeSelect",
      options: () => {
        return new Promise((res) => {
          queryProductSortTree({ paging: false }).then((resp) => {
            res(resp.result);
          });
        });
      },
      componentProps: {
        fieldNames: {
          label: "name",
          value: "id",
        },
      },
    },
  },
  {
    dataIndex: "id$dim-assets",
    title: $t('Device.Product.372522-12'),
    hideInTable: true,
    search: {
      type: "treeSelect",
      termOptions: termOptions,
      componentProps: {
        fieldNames: {
          label: "name",
          value: "value",
        },
      },

      options: () =>
        new Promise((resolve) => {
          getTreeData_api({ paging: false }).then((resp: any) => {
            const formatValue = (list: any[]) => {
              return list.map((item: any) => {
                if (item.children) {
                  item.children = formatValue(item.children);
                }
                return {
                  ...item,
                  value: JSON.stringify({
                    assetType: "product",
                    targets: [
                      {
                        type: "org",
                        id: item.id,
                      },
                    ],
                  }),
                };
              });
            };
            resolve(formatValue(resp.result) || []);
          });
        }),
    },
  },
];

const handleSearch = (p: any) => {
  params.value = p;
};

const productQuery = async (p: any) => {
  const sorts: any = [];

  if (props.rowKey) {
    sorts.push({
      name: "id",
      value: props.rowKey,
    });
  }
  sorts.push({ name: "createTime", order: "desc" });
  p.sorts = sorts;
  const resp = await queryProductList(p);
  if (resp.success && props.rowKey && firstFind.value) {
    const productItem = (resp.result as { data: any[] }).data.find(
      (item: any) => item.id === props.rowKey
    );
    emit("update:detail", productItem);
    firstFind.value = false;
  }
  return {
    ...resp,
  };
};

const handleClick = (detail: any) => {
  emit("update:rowKey", detail.id);
  emit("update:detail", detail);
  emit("change", detail);
};
</script>

<style scoped lang="less">
.search {
  margin-bottom: 0;
  padding-right: 0px;
  padding-left: 0px;
}
</style>
