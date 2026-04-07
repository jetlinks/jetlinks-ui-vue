<template>
  <CardBox
    v-for="slotProps in gateways"
    style="margin-bottom: 16px"
    :showStatus="false"
    @click="handleAccessItemDetail(slotProps)"
  >
    <template #img>
      <img :src="BackMap.get(slotProps.provider)" alt="">
    </template>
    <template #content>
      <div class="card-item-content">
          <j-ellipsis style="width: calc(100% - 100px)">
            <span class="card-title">
              {{ slotProps.name }}
            </span>
          </j-ellipsis>
          <a-row class="card-item-content-box">
            <a-col
              :span="12"
              v-if="slotProps.channelInfo"
              class="card-item-content-text"
            >
              <j-ellipsis>
                <div
                  class="card-item-content-text-title"
                >
                  {{ slotProps.channelInfo.name }}
                </div>
              </j-ellipsis>
              <j-ellipsis
                style="
                  width: calc(100% - 10px);
                  display: flex;
                  margin-top: 4px;
                "
                v-if="slotProps.channelInfo.addresses"
              >
                <a-badge
                  :status="getStatus(slotProps)"
                />
                <span>
                  {{ slotProps.channelInfo.addresses[0].address }}
                </span>
              </j-ellipsis>
            </a-col>
            <a-col
              v-if="slotProps.protocolDetail"
              :span="12"
              class="card-item-content-text"
            >
              <div class="card-item-content-text-title">
                {{ $t('AccessConfig.index.764793-1') }}
              </div>
              <j-ellipsis
                style="width: calc(100% - 10px)"
                :lineClamp="2"
              >
                <div>
                  {{ slotProps.protocolDetail.name }}
                </div>
              </j-ellipsis>
            </a-col>
          </a-row>
          <a-row class="card-item-content-description">
            <a-col :span="24">
              <j-ellipsis :lineClamp="2" style="width: calc(100% - 10px)">
                <!-- {{ getDescription(slotProps) }} -->
              </j-ellipsis>
            </a-col>
          </a-row>
      </div>
    </template>
  </CardBox>
  <Outline v-if="visible" :data="current" @closeDrawer="visible = false" />
</template>

<script setup lang="ts">
import { getCompositeProviderDetail } from '@device-manager-ui/api/link/accessConfig';
import { BackMap } from '../../data'
import Outline from '../index.vue'

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const gateways = ref([])
const visible = ref()
const current = ref()

// const getDescription = (slotProps: Record<string, any>) =>
//   slotProps.description
//     ? slotProps.description
//     : props.otherProvider?.find(
//         (item: Record<string, any>) => item.id === slotProps.provider,
//       )?.description;

const getStatus = (slotProps: Record<string, any>) =>
  slotProps.channelInfo.addresses[0].health === -1 ? 'error' : 'processing';

const handleAccessItemDetail = (item) => {
  current.value = item;
  visible.value = true;
}

onMounted(async () => {
  const res = await getCompositeProviderDetail(props.data.configuration?.gateways || []);
  gateways.value = res.result;
});
</script>