<template>
    <page-container>
        <Api mode="api">
            <template #top>
                <p>
                    <AIcon
                        type="ExclamationCircleOutlined"
                        style="margin-right: 12px; font-size: 14px"
                    />{{ $t('Platforms.index.715916-0') }}
                </p>
            </template>
        </Api>
    </page-container>
</template>

<script setup lang="ts" name="Platforms">
import Api from './Api/index.vue';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
</script>
