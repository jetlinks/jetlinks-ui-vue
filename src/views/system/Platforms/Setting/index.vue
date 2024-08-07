<template>
    <page-container>
        <div class="api-container">
            <Api mode="api">
            <template #top>
                <p>
                    <AIcon
                        type="ExclamationCircleOutlined"
                        style="margin-right: 12px; font-size: 14px"
                    />{{ $t('Setting.index.788297-0') }}
                </p>
            </template>
        </Api>
        </div>
    </page-container>
</template>

<script setup lang="ts" name="Api">
import Api from '../Api/index.vue';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
</script>

<style lang="less" scoped>
.api-container {
    background-color: #fff;
    padding: 24px;
}

</style>