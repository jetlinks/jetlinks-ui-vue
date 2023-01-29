<template>
    <div>
        <Ctwing
            v-if="channel === 'Ctwing'"
            :provider="props.provider"
            :data="props.data"
        />
        <OneNet
            v-if="channel === 'OneNet'"
            :provider="props.provider"
            :data="props.data"
        />
    </div>
</template>

<script lang="ts" setup name="AccessCloud">
import Ctwing from './Ctwing.vue';
import OneNet from './OneNet.vue';

const route = useRoute();
const id = route.query.id;

const props = defineProps({
    provider: {
        type: Object,
        default: () => {},
    },
    data: {
        type: Object,
        default: () => {},
    },
});

const channel = props.provider.channel;
</script>

<style lang="less" scoped></style>
