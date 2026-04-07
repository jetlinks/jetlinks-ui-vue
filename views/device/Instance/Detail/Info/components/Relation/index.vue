<template>
    <div style="margin-top: 20px">
        <a-descriptions bordered :labelStyle="{width: '150px'}">
            <template #title>
                {{ $t('Relation.index.878714-0') }}
                <j-permission-button
                    type="link"
                    @click="visible = true"
                    hasPermission="device/Instance:update"
                >
                    <AIcon type="EditOutlined" />{{ $t('Relation.index.878714-1') }}<a-tooltip
                        :title="$t('Relation.index.878714-2')"
                        ><AIcon type="QuestionCircleOutlined"
                    /></a-tooltip>
                </j-permission-button>
            </template>
            <a-descriptions-item
                :span="1"
                v-for="item in dataSource"
                :key="item.objectId"
            >
                <template #label>
                    <j-ellipsis>{{ item.relationName }}</j-ellipsis>
                </template>
                <j-ellipsis>
                    {{
                        item?.related
                            ? (item?.related || []).map((i) => i.name).join(',')
                            : ''
                    }}
                </j-ellipsis>
            </a-descriptions-item>
        </a-descriptions>
        <Save v-if="visible" @save="saveBtn" @close="visible = false" />
    </div>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '../../../../../../../store/instance';
import Save from './Save.vue';

const instanceStore = useInstanceStore();

const dataSource = ref<Record<any, any>[]>([]);
const visible = ref<boolean>(false);

watchEffect(() => {
    const arr = (instanceStore.current?.relations || []).reverse();
    dataSource.value = arr as Record<any, any>[];
});

const saveBtn = () => {
    visible.value = false;
    if (instanceStore.current.id) {
        instanceStore.refresh(instanceStore.current.id);
    }
};
</script>
