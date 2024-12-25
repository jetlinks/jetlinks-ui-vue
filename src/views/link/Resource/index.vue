<template>
    <page-container>
        <div class="container">
            <FullPage>
                <a-button @click="showInstallModal = true">安装</a-button>
                <a-button @click="toDetail">详情</a-button>
            </FullPage>
        </div>
        <Install v-if="showInstallModal"  @close="showInstallModal = false"/>
        <ResourceTable />
    </page-container>
</template>

<script setup>
import Install from './Install/index.vue'
import {useMenuStore} from '@/store/menu';
import ResourceTable from '@/components/ResourceTable/ResourceTable.vue';
const menuStory = useMenuStore();
const showInstallModal = ref(false)

const toDetail = () => {
    menuStory.jumpPage('link/Resource/Detail',{
        id: '1871071629752754176'
    });
}

</script>
<style lang='less' scoped>
.container{
    border: 1px solid rgb(230,230,230);
}
</style>