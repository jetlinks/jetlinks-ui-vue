<template>
    <a-card>
        <a-row type="flex">
            <a-col flex="200px">
                <div>
                    <a-input-search
                        v-model:value="value"
                        placeholder="请输入事件名称"
                        style="width: 200px; margin-bottom: 10px"
                        @search="onSearch"
                    />
                    <a-tabs
                        tab-position="left"
                        :style="{ height: '600px' }"
                        v-model:activeKey="activeKey"
                        tabBarStyle="width: 200px"
                    >
                        <a-tab-pane v-for="i in tabList" :key="i.key" :tab="i.tab" />
                    </a-tabs>
                </div>
            </a-col>
            <a-col flex="auto">
                <!-- <component :is="tabs[activeKey]" /> -->
                123
            </a-col>
        </a-row>
    </a-card>
</template>

<script lang="ts" setup>
const activeKey = ref<string>('property')
const tabList = ref<{key: string, tab: string}[]>([
    {
        key: 'property',
        tab: '属性'
    },
    {
        key: 'event1',
        tab: '事件1'
    }
])

const onSearch = () => {

}
</script>