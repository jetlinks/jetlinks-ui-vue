<template>
    <div>{{ duration }}</div>
</template>

<script setup name="Duration">
const props = defineProps({
    data: {
        type: Object,
        default: {},
    },
});
const duration = ref();
import dayjs from 'dayjs';
const calculateDuration = (startTime, endTime) => {
    const diffInSeconds = endTime.diff(startTime, 'second');
    let result;

    if (diffInSeconds < 60) {
        result = `${diffInSeconds.toFixed(1)} s`;
    } else if (diffInSeconds < 3600) {
        result = `${(diffInSeconds / 60).toFixed(1)} min`;
    } else {
        result = `${(diffInSeconds / 3600).toFixed(1)} h`;
    }
    return result;
};
watch(
    () => props.data,
    () => {
        duration.value = calculateDuration(
            dayjs(props.data.alarmTime),
            props.data?.state?.value === 'warning'
                ? dayjs()
                : dayjs(props.data?.handleTime),
        );
    },
    {
        deep: true,
        immediate: true,
    },
);
</script>
<style lang="less" scoped></style>
