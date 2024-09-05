<template>
    <page-container>
        <Api mode="api">
            <template #top>
                <p>
                    <AIcon
                        type="ExclamationCircleOutlined"
                        style="margin-right: 12px; font-size: 14px"
                    />配置系统支持API赋权的范围
                </p>
            </template>
        </Api>
    </page-container>
</template>

<script setup lang="ts" name="Platforms">
import Api from './Api/index.vue';
</script>
