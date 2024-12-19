<template>
    <div class="container">
        <div>
            <div class="tips">
                <div>您已进入高级模式，可自定义接入配置</div>
                <a-button type="link" @click="quitAdvanceMode">退出高级模式</a-button>
            </div>
            <div>
                请选择接入方式
            </div>
            <a-row :gutter="[12, 12]">
                <a-col :span="12">
                    <div>
                        <img src="" alt="">
                        <div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </div>
        <div>
            <div>
                <img src="" alt="">
                <div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
        <div>
            <Title data="网络组件">
                <template #extra>
                    <a-button type="link" @click="visibleAddNetwork = true">选择</a-button>
                </template>
            </Title>
            <Title data="协议">
                <template #extra>
                    <a-button type="link" @click="visibleAddProtocol = true">选择</a-button>
                </template>
            </Title>
            <Title data="插件">
                <template #extra>
                    <a-button type="link" @click="visibleAddPlugin = true">选择</a-button>
                </template>
            </Title>
        </div>
    </div>
    <Network v-if="visibleAddNetwork" :type="accessType" :selectedNetWork="network" @close="visibleAddNetwork = false" />
    <Protocol v-if="visibleAddProtocol" :type="accessType" :selectedNetWork="protocol" @close="visibleAddProtocol = false" />
    <Plugin v-if="visibleAddPlugin" :type="accessType" :selectedNetWork="plugin" @close="visibleAddPlugin = false" />
</template>

<script setup>
import { BackMap } from '@/views/link/AccessConfig/data';
import Network from './NetWork/index.vue';
import Protocol from './Protocol/index.vue'
import Title from './Title/index.vue'
import Plugin from './Plugin/index.vue'
const emits = defineEmits(['quit'])
const accessType = 'mqtt-server-gateway'
const network = ref()
const protocol = ref()
const plugin = ref()
const visibleAddNetwork = ref(false)
const visibleAddProtocol = ref(false)
const visibleAddPlugin = ref(false)
const quitAdvanceMode = () => {
    emits('quit')
}
</script>
<style lang='less' scoped>
.container {
    border: 1px solid #bebfbf;
    border-radius: 8px;
    padding: 5px 10px;
}

.tips {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}
</style>