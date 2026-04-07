<template>
  <pro-search
    type="simple"
    class="scene-search"
    :columns="columns"
    @search="handleSearch"
  />
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
        :showStatus="true"
        :value="slotProps"
        v-bind="slotProps"
        :active="rowKey === slotProps.id"
        :status="getState(slotProps).value"
        :statusText="getState(slotProps).text"
        :statusNames="StatusColorEnum"
        @click="handleClick"
      >
        <template #img>
          <slot name="img">
            <img
              :src="imgMap.get(slotProps.provider)"
            />
          </slot>
        </template>
        <template #content>
          <div class="card-item-content">
            <j-ellipsis style="width: calc(100% - 100px)">
                                        <span
                                          style="
                                                font-size: 18px;
                                                font-weight: 800;
                                                line-height: 22px;
                                            "
                                        >
                                            {{ slotProps.name }}
                                        </span>
            </j-ellipsis>
            <a-row class="card-item-content-box">
              <a-col :span="12">
                <div class="card-item-content-text">
                  {{ $t('Channel.index.290640-1') }}
                </div>
                <div class="card-item-content-text">
                  <a-tooltip>
                    <template #title>{{
                        protocolList.find(
                          (item) =>
                            item.value ===
                            slotProps.provider,
                        )?.label
                      }}</template>
                    {{
                      protocolList.find(
                        (item) =>
                          item.value ===
                          slotProps.provider,
                      )?.label
                    }}
                  </a-tooltip>
                </div>
              </a-col>

              <a-col :span="12">
                <div class="card-item-content-text">
                  {{ $t('Channel.index.290640-2') }}
                </div>
                <j-ellipsis>
                  <div class="explain">
                    {{ slotProps.description }}
                  </div>
                </j-ellipsis>
              </a-col>
            </a-row>
          </div>
        </template>
      </CardBox>
    </template>
  </j-pro-table>
</template>

<script setup lang="ts" name="Channel">
import {query, getProviders} from '@rule-engine-manager-ui/api/channel'
import {protocolList, imgMap, StatusColorEnum} from "./data";
import { useI18n } from 'vue-i18n';

type Emit = {
  (e: "update:rowKey", data: string): void;
  (e: "update:detail", data: string): void;
  (e: "change", data: string): void;
};

const {t: $t} = useI18n();

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

const columns = [
  {
    title: $t('Channel.index.290640-3'),
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    fixed: 'left',
    search: {
      type: 'string',
    },
  },
  {
    title: $t('Channel.index.290640-4'),
    dataIndex: 'provider',
    key: 'provider',
    ellipsis: true,
    search: {
      type: 'select',
      options: async () => {
        const resp: any = await getProviders();
        if (resp.status === 200) {
          return resp.result
            .map((it: any) => {
              return {
                label: it.name,
                value: it.id,
              }
            });
        }
      },
    },
  },
  {
    title: $t('Channel.index.290640-5'),
    dataIndex: 'state',
    key: 'state',
    ellipsis: true,
    scopedSlots: true,
    search: {
      type: 'select',
      options: [
        { label: $t('Channel.index.290640-6'), value: 'enabled' },
        { label: $t('Channel.index.290640-7'), value: 'disabled' },
      ],
    },
  },
  {
    title: $t('Channel.index.290640-8'),
    dataIndex: 'runningState',
    key: 'runningState',
    ellipsis: true,
    scopedSlots: true,
    search: {
      type: 'select',
      options: [
        { label: $t('Channel.index.290640-9'), value: 'running' },
        { label: $t('Channel.index.290640-10'), value: 'stopped' },
      ],
    },
  },
  {
    title: $t('Channel.index.290640-2'),
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    search: {
      type: 'string',
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
  sorts.push({name: "createTime", order: "desc"});
  p.sorts = sorts;
  const resp = await query(p);
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

const getState = (record: Partial<Record<string, any>>) => {
  if (record) {
    if (record?.state?.value === 'enabled') {
      return { ...record?.runningState };
    } else {
      return {
        text: $t('Channel.index.290640-7'),
        value: 'disabled',
      };
    }
  } else {
    return {};
  }
};

</script>

<style scoped lang="less">

</style>
