<template>
    <div>
        <a-descriptions bordered :column="1">
            <a-descriptions-item :label="$t('components.FourthKind.428296-0')">
                {{ data?.provider }}
            </a-descriptions-item>
        </a-descriptions>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const props = defineProps({
    data: {
        type: Object,
    },
});
</script>
<style lang="less" scoped></style>
