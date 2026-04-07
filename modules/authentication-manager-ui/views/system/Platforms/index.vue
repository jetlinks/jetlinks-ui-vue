<template>
    <j-page-container>
        <Api mode="api">
            <template #top>
                <p>
                    <AIcon
                        type="ExclamationCircleOutlined"
                        style="margin-right: 12px; font-size: 14px"
                    />{{ $t('Platforms.index.366248-0') }}
                </p>
            </template>
        </Api>
    </j-page-container>
</template>

<script setup lang="ts" name="Platforms">
import Api from './Api/index.vue';
</script>
