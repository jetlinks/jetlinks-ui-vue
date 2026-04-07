<template>
  <a-modal
      open
      :centered="true"
      @cancel="emits('close')"
      :maskClosable="false"
      :width="1000"
      :footer="null"
      :closable="false"
  >
    <template #title>
      <div class="header">
        <div @click="emits('close')">
          <AIcon
              type="ArrowLeftOutlined"
              style="font-size: 18px; margin-bottom: 12px"
          />
          {{ $t('Apply.Product.773301-0') }}
        </div>
        <div class="title">{{ $t('Apply.Product.773301-1') }}</div>
      </div>
    </template>
    <pro-search :columns="columns" type="simple" @search="handleSearch"/>
    <a-divider style="margin: 0"/>
    <div class="content">
      <j-pro-table
          ref="actionRef"
          mode="CARD"
          :columns="columns"
          :params="params"
          :request="
                    (e) =>
                        type === 'metadata'
                            ? _queryProduct(_id, e)
                            : _queryProtocol(_id, type, e)
                "
          :gridColumns="[2]"
          :defaultParams="defaultParams"
          :bodyStyle="{
                    paddingRight: 0,
                    paddingLeft: 0,
                }"
      >
        <template #card="slotProps">
          <CardBox
              :value="slotProps"
              :status="String(slotProps.state)"
              :statusText="slotProps.state === 1 ? $t('Apply.Product.773301-2') : $t('Apply.Product.773301-3')"
              :statusNames="{ '1': 'processing', '0': 'error' }"
          >
            <template #img>
              <slot name="img">
                <img
                    :width="80"
                    :height="80"
                    :src="
                                        slotProps.photoUrl ||
                                        device.deviceProduct
                                    "
                />
              </slot>
            </template>
            <template #content>
              <div style="width: calc(100% - 100px)">
                <j-ellipsis>
                                    <span
                                        style="
                                            font-size: 16px;
                                            font-weight: 600;
                                        "
                                    >
                                        {{ slotProps.name }}
                                    </span>
                </j-ellipsis>
              </div>
              <a-row>
                <a-col :span="12">
                  <div class="card-item-content-text">
                    {{ $t('Apply.Product.773301-4') }}
                  </div>
                  <Ellipsis>{{
                      slotProps.deviceType?.text
                    }}
                  </Ellipsis>
                </a-col>
                <a-col :span="12">
                  <div class="card-item-content-text">
                    {{ $t('Apply.Product.773301-5') }}
                  </div>
                  <Ellipsis>{{
                      slotProps?.accessName || $t('Apply.Product.773301-6')
                    }}
                  </Ellipsis>
                </a-col>
              </a-row>
            </template>
          </CardBox>
        </template>
      </j-pro-table>
    </div>
  </a-modal>
</template>

<script setup lang="ts" name="Product">
import {_queryProduct, _queryProtocol} from '@device-manager-ui/api/resource/resource';
import {device} from '@device-manager-ui/assets/device/index.ts';
import {useI18n} from 'vue-i18n';

const {t: $t} = useI18n();
const emits = defineEmits(['close']);
const props = defineProps({
  type: {
    type: String,
    default: 'metadata',
  },
  protocolList: {
    type: Array,
    default: () => [],
  }
});

const defaultParams = computed(() => {
  if (props.type === 'plugin') {
    return {
      "terms": [
        {
          "column": "access_id$prod-plugin",
          value: props.protocolList.map(item => item.id),
          "type": "and"
        }
      ]
    }
  } else if (props.type === 'protocol') {
    return {
      terms: [
        {
          column: 'messageProtocol',
          termType: 'in',
          value: props.protocolList.map(item => item.id)
        }
      ]
    }
  }
  return {}
})

const route = useRoute();
const _id = route.params?.id;
const params = ref({});
const handleSearch = (p: any) => {
  params.value = p;
};

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 300,
    ellipsis: true,
    fixed: 'left',
    search: {
      type: 'string',
    },
  },
  {
    title: $t('Apply.Product.773301-7'),
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
    search: {
      type: 'string',
      first: true,
    },
  },
  {
    title: $t('Apply.Product.773301-4'),
    dataIndex: 'deviceType',
    width: 150,
    search: {
      type: 'select',
      options: [
        {label: $t('Apply.Product.773301-8'), value: 'device'},
        {label: $t('Apply.Product.773301-9'), value: 'childrenDevice'},
        {label: $t('Apply.Product.773301-10'), value: 'gateway'},
      ],
    },
  },
  {
    title: $t('Apply.Product.773301-11'),
    dataIndex: 'state',
    width: '90px',
    search: {
      type: 'select',
      options: [
        {label: $t('Apply.Product.773301-3'), value: 0},
        {label: $t('Apply.Product.773301-2'), value: 1},
      ],
    },
  },
  {
    title: $t('Apply.Product.773301-12'),
    dataIndex: 'describe',
    ellipsis: true,
    width: 300,
  },
];
</script>

<style lang="less" scoped>
.header {
  display: flex;

  .title {
    width: 90%;
    text-align: center;
  }
}

.content {
  height: 70vh;
  padding: 0 10px;
}
</style>
