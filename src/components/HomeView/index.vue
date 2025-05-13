<template>
    <div class="view-content">
        <div
            class="select-item"
            v-for="item in list"
            :key="item.id"
            @click="onChange(item.id)"
            :class="{
                active: currentView === item.id,
            }"
        >
            <img :src="getImage(`/home/home-view/${item.id}${currentView === item.id ? '-active' : ''}.png`)" alt="" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getImage } from '@jetlinks-web/utils';
// import { useI18n } from 'vue-i18n';

// const { t: $t } = useI18n();
const list = [
    {
        id: 'device',
        // name: $t('HomeView.index.817508-0'),
    },
    {
        id: 'ops',
        // name: $t('HomeView.index.817508-1'),
    },
    {
        id: 'comprehensive',
        // name: $t('HomeView.index.817508-2'),
    },
];

const props = defineProps({
    value: {
        type: String,
        default: ''
    },
})

const emits = defineEmits(['update:value', 'change'])

const currentView = ref<string>('');

const onChange = (id: string) => {
    emits('change', id);
    emits('update:value', id)
}

watchEffect(() => {
    currentView.value = (props.value || '') as string
})
</script>

<style lang="less" scoped>
.view-content {
    display: flex;
    justify-content: space-between;
    .select-item {
        cursor: pointer;
        width: 30%;
        border-radius: 14px;
        color: #333333;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            background-size: cover;
        }

        &:hover {
            box-shadow: 0px 3px 6px -4px rgba(0, 0, 0, 0.12),
                0px 6px 16px 0px rgba(0, 0, 0, 0.08),
                0px 9px 16px 8px rgba(0, 0, 0, 0.1);
        }
    }
}
</style>
