<template>
    <a-modal visible @cancel="emit('close')" :closable="false">
        <div style="padding: 30px;">
            <div style="display: flex; padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px solid #E4E7F6">
                <a-avatar :size="100" :src="userInfo.avatar"></a-avatar>
                <div style="margin-left: 24px;  max-width: 280px;" >
                    <div class="name"><j-ellipsis>{{ userInfo.name }}</j-ellipsis></div>
                    <div class="subTitle"><j-ellipsis>{{ $t('Detail.index.153077-0') }} {{ userInfo?.username }}</j-ellipsis></div>
                    <!-- <div class="subTitle">账号ID: {{ userInfo?.id }}</div> -->
                </div>
            </div>
            <a-descriptions
                :column="1"
                :labelStyle="{
                    color: 'rgba(0, 0, 0, 0.6)',
                    maxWidth: '120px',
                    whiteSpace: 'nowrap'
                }"
                :contentStyle="{
                    color: '#333333',
                }"
            >
                <a-descriptions-item :label="$t('Detail.index.153077-1')">
                    <j-ellipsis :lineClamp="2">
                        {{ role }}
                    </j-ellipsis>
                </a-descriptions-item>
                <a-descriptions-item :label="$t('Detail.index.153077-2')">
                    <j-ellipsis :lineClamp="2">
                        {{ org }}
                    </j-ellipsis>
                </a-descriptions-item>
                <a-descriptions-item :label="$t('Detail.index.153077-8')" v-if="isNoCommunity">
                  <j-ellipsis :lineClamp="2">
                    {{ pos }}
                  </j-ellipsis>
                </a-descriptions-item>
                <a-descriptions-item :label="$t('Detail.index.153077-3')">
                    <j-ellipsis :lineClamp="2">
                        {{ userInfo?.telephone }}
                    </j-ellipsis>
                </a-descriptions-item>
                <a-descriptions-item :label="$t('Detail.index.153077-4')">
                    <j-ellipsis :lineClamp="2">
                        {{ userInfo?.email }}
                    </j-ellipsis>
                </a-descriptions-item>
            </a-descriptions>
        </div>
        <template #footer>
            <a-button type="primary" @click="emit('close')">{{ $t('Detail.index.153077-5') }}</a-button>
        </template>
    </a-modal>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'
import { useI18n } from 'vue-i18n';
import {isNoCommunity} from "@/utils";

const { t: $t } = useI18n();
const { userInfo } = useUserStore();
const emit = defineEmits(['close', 'save']);

const role = computed(() => {
    const _role = userInfo?.roleList.map((item: any) => item?.name).join(';');
    return _role || $t('Detail.index.153077-6');
});

const org = computed(() => {
    const _role = userInfo?.orgList.map((item: any) => item?.name).join(';');
    return _role || $t('Detail.index.153077-7');
});

const pos = computed(() => {
  const _role = (userInfo?.positions || [])?.map((item: any) => item?.name).join(';');
  return _role || $t('Detail.index.153077-9');
});
</script>

<style lang="less" scoped>
.name {
    color: #1D2129;
    font-weight: 500;
    font-size: 26px;
    margin: 15px 0 10px 0;
}

.subTitle {
    color: rgba(0, 0, 0, 0.6);
}
</style>
