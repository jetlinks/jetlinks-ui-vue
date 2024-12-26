<template>
    <page-container>
        <FullPage>
            <div class="container">
                <ResourceTable>
                    <template #title>
                        <a-space>
                            <span>我的资源</span>
                            <a-button @click="showInstallModal = true"
                                >安装</a-button
                            >
                            <a-button @click="toDetail">详情</a-button>
                        </a-space>
                    </template>
                </ResourceTable>
                <Install
                    v-if="showInstallModal"
                    @close="showInstallModal = false"
                />
            </div>
        </FullPage>
    </page-container>
</template>

<script setup>
import Install from './Install/index.vue';
import { useMenuStore } from '@/store/menu';
const menuStory = useMenuStore();
const showInstallModal = ref(false);

const toDetail = () => {
    menuStory.jumpPage('link/Resource/Detail',{
        id: '1866776402031923200'
    });
};
</script>
<style lang="less" scoped>
.container {
    padding: 20px;
}
</style>
