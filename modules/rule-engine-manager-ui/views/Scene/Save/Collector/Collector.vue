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
    :params="params"
    :request="productQuery"
    :gridColumn="2"
    :gridColumns="[2, 2, 2]"
    :bodyStyle="{
      paddingRight: 0,
      paddingLeft: 0,
    }"
    :defaultParams="defaultParams"
  >
    <template #card="slotProps">
      <CardBox
        :value="slotProps"
        :active="rowKey === slotProps.id"
        :status="
          slotProps.state.value == 'disabled'
          ? slotProps.state.value
          : slotProps.runningState.value
        "
        :statusText="
            slotProps.state.value == 'disabled'
          ? slotProps.state.text
          : slotProps.runningState.text"
        :statusNames="{
          running: 'success',
          enabled: 'success',
          allError: 'error',
          disabled: 'error',
          partialError: 'error',
          failed: 'error',
          partError: 'warning',
          notActive: 'warning',
          stopped: 'default',
          none: '#646C73',
        }"
        @click="handleClick"
      >
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
              <a-col :span="24">
                <div class="card-item-content-text">
                  {{ $t('Collector.actions.index-6100078-6') }}
                </div>
                <div class="card-item-content-text">
                  {{ slotProps.pointNumber }}
                </div>
              </a-col>
            </a-row>
          </div>
        </template>
      </CardBox>
    </template>
  </j-pro-table>
</template>

<script setup lang="ts" name="Collector">
import {queryCollector} from '@rule-engine-manager-ui/api/collector'
import { useI18n } from 'vue-i18n'

type Emit = {
  (e: "update:rowKey", data: string): void;
  (e: "update:collectorName", data: string): void;
  (e: "update:detail", data: string): void;
  (e: "change", data: string): void;
};

const { t: $t } = useI18n()

const props = defineProps({
  rowKey: {
    type: String,
    default: "",
  },
  detail: {
    type: Object,
    default: () => ({}),
  },
  channelId: {
    type: String,
    default: "",
  }
});

const emit = defineEmits<Emit>();

const columns = [
  {
    title: $t('Save.index.4001415-4'),
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    fixed: 'left',
    search: {
      type: 'string',
    },
  },
  {
    title: 'ID',
    key: 'id',
    dataIndex: 'id',
    search: {
      type: 'string'
    }
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
]

const actionRef = ref();
const params = ref({});
const firstFind = ref(true);

const defaultParams = {
    sorts: [
        {name: 'createTime', order: 'desc'}
    ],
    terms: [
        {column: 'channelId', value: props.channelId, termType: 'eq'}
    ]
}

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
    const resp = await queryCollector(p);
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
  if (props.rowKey === detail.id) {
    return;
  }
  emit("update:rowKey", detail.id);
  emit("update:collectorName", detail.name);
  emit("update:detail", detail);
  emit("change", detail);
};

</script>

<style scoped lang="less">
</style>
