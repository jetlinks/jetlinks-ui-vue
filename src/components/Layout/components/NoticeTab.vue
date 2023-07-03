<template>
    <j-badge :count="total" :offset="[3, -3]">
        {{ tab }}
    </j-badge>
</template>

<script setup lang="ts">
import { getList_api } from '@/api/account/notificationRecord';
import { PropType } from 'vue';

const props = defineProps({
    tab: {
        type: String,
        default: '',
    },
    type: {
        type: Array as PropType<string[]>,
        default: () => [],
    },
    refresh: {
        type: Boolean
    }
});

const total = ref<number>(0);

const getData = (type: string[]) => {
    const params = {
        sorts: [
            {
                name: 'notifyTime',
                order: 'desc',
            },
        ],
        terms: [
            {
                terms: [
                    {
                        type: 'and',
                        value: type,
                        termType: 'in',
                        column: 'topicProvider',
                    },
                    {
                        type: 'and',
                        value: 'unread',
                        termType: 'eq',
                        column: 'state',
                    },
                ],
            },
        ],
    };
    getList_api(params).then((resp: any) => {
        total.value = resp.result.total;
    });
};

watch(
    () => props.refresh,
    () => {
        getData(props.type);
    },
    {
        immediate: true,
        deep: true
    }
);
</script>