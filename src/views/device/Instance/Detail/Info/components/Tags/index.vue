<template>
    <div style="margin-top: 20px">
        <j-descriptions bordered>
            <template #title>
                {{ $t('Tags.index.735522-0') }}
                <PermissionButton
                    type="link"
                    @click="visible = true"
                    hasPermission="device/Instance:update"
                >
                    <AIcon type="EditOutlined" />{{ $t('Tags.index.735522-1') }}
                </PermissionButton>
            </template>
            <j-descriptions-item
                :span="1"
                v-for="item in dataSource"
                :key="item.key"
            >
                <template #label>
                    <Ellipsis>{{ `${item.name}（${item.key})` }}</Ellipsis>
                </template>
                <Ellipsis>{{ findName(item) }}</Ellipsis>
            </j-descriptions-item>
        </j-descriptions>
        <Save v-if="visible" @close="visible = false" @save="saveBtn" />
    </div>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@/store/instance';
import Save from './Save.vue';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const instanceStore = useInstanceStore();

const dataSource = ref<Record<any, any>[]>([]);
const visible = ref<boolean>(false);

watchEffect(() => {
    const arr = instanceStore.current?.tags || [];
    dataSource.value = arr as Record<any, any>[];
});

const saveBtn = () => {
    visible.value = false;
    if (instanceStore.current.id) {
        instanceStore.refresh(instanceStore.current.id);
    }
};

const findName = (item: any) => {
  let name = undefined
  if (item.dataType) {
    const _element = item.dataType.elements?.find((a: any) => a.value === item.value)
    name = _element?.text
  }
  return name || item.value
}
</script>
