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
    :request="deviceQuery"
    :gridColumn="2"
    :gridColumns="[2, 2, 2]"
    :params="params"
    :bodyStyle="{
      paddingRight: 0,
      paddingLeft: 0,
    }"
  >
    <template #card="slotProps">
      <CardBox
        :value="slotProps"
        :active="deviceRowKeys.includes(slotProps.id)"
        :status="slotProps.state?.value"
        :statusText="slotProps.state?.text"
        :statusNames="{
          online: 'processing',
          offline: 'error',
          notActive: 'warning',
        }"
        @click="handleClick"
      >
        <template #img>
          <slot name="img">
            <Image
              :src="slotProps.photoUrl || sceneImages.deviceCard"
              class="card-list-img-80"
            />
          </slot>
        </template>
        <template #content>
          <j-ellipsis style="width: calc(100% - 100px)">
            <span style="font-size: 16px; font-weight: 600">
              {{ slotProps.name }}
            </span>
          </j-ellipsis>
          <a-row>
            <a-col :span="12">
              <div class="card-item-content-text">{{ $t('Device.DeviceList.372526-0') }}</div>
              <div>
                <j-ellipsis>
                  {{ slotProps.deviceType?.text }}
                </j-ellipsis>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="card-item-content-text">{{ $t('Device.DeviceList.372526-1') }}</div>
              <div>
                <j-ellipsis>
                  {{ slotProps.productName }}
                </j-ellipsis>
              </div>
            </a-col>
          </a-row>
        </template>
      </CardBox>
    </template>
  </j-pro-table>
</template>

<script setup lang="ts" name="DeviceSelectList">
import type { PropType } from "vue";
import { sceneImages } from "../../../../assets/index";
import { query } from "../../../../api/others";
import { cloneDeep } from "lodash-es";
import type { SelectorValuesItem } from "../../typings";
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
type Emit = {
  (e: "update", data: SelectorValuesItem[]): void;
};

const params = ref({});
const props = defineProps({
  rowKeys: {
    type: Array as PropType<SelectorValuesItem[]>,
    default: () => [],
  },
  productId: {
    type: String,
    default: "",
  },
});

const emit = defineEmits<Emit>();

const deviceRowKeys = computed(() => {
  return props.rowKeys.map((item) => item.value);
});

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
    title: $t('Device.DeviceList.372526-2'),
    dataIndex: "name",
    width: 200,
    ellipsis: true,
    search: {
      type: "string",
      first: true,
    },
  },
  {
    title: $t('Device.DeviceList.372526-3'),
    dataIndex: "createTime",
    width: 200,
    search: {
      type: "date",
    },
  },
  {
    title: $t('Device.DeviceList.372526-4'),
    dataIndex: "state",
    width: 90,
    search: {
      type: "select",
      options: [
        { label: $t('Device.DeviceList.372526-5'), value: "notActive" },
        { label: $t('Device.DeviceList.372526-6'), value: "offline" },
        { label: $t('Device.DeviceList.372526-7'), value: "online" },
      ],
    },
  },
];

const handleSearch = (p: any) => {
  params.value = p;
};

const deviceQuery = (p: any) => {
  const sorts: any = [];

  if (props.rowKeys) {
    props.rowKeys.forEach((rowKey) => {
      sorts.push({
        name: "id",
        value: rowKey.value,
      });
    });
  }
  sorts.push({ name: "createTime", order: "desc" });
  const terms = [
    ...p.terms,
    { terms: [{ column: "productId", value: props.productId }] },
  ];
  return query({ ...p, terms, sorts });
};

const handleClick = (detail: any) => {
  const cloneRowKeys = cloneDeep(props.rowKeys);
  const indexOf = cloneRowKeys.findIndex((item) => item.value === detail.id);
  if (indexOf !== -1) {
    cloneRowKeys.splice(indexOf, 1);
  } else {
    cloneRowKeys.push({
      name: detail.name,
      value: detail.id,
    });
  }
  emit("update", cloneRowKeys);
};
</script>

<style scoped>
.search {
  margin-bottom: 0;
  padding-right: 0px;
  padding-left: 0px;
}
</style>
