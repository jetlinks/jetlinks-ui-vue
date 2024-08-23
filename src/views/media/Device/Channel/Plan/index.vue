<template>
    <a-modal
        title="计划管理"
        visible
        @cancel="emit('close')"
        :maskClosable="false"
        width="1000px"
    >
        <div class="content">
            <div class="items">
                
                <div style="display: flex;">
                    <TitleComponent data="录制计划" />
                    <a-button v-if="_ref.recordStatus === 'edit'" type="link" @click="onAdd('record')"><AIcon type="EditOutlined" /></a-button>
                </div>
                <div class="item" v-if="_ref.recordStatus === 'add'">
                    <a-button shape="round" @click="onAdd('record')">
                        点击关联录制计划
                    </a-button>
                </div>
                <div v-if="_ref.recordStatus === 'select'">
                    <span>关联计划：</span>
                    <a-select
                        v-model:value="_ref.recordId"
                        style="width: 200px"
                        :options="_ref.recordOptions"
                        placeholder="请选择计划"
                    />
                    <a-button style="margin: 0 12px;">取消</a-button>
                    <a-button type="primary" @click="onSave('photograph')">保存</a-button>
                </div>
                <div v-if="_ref.recordStatus === 'edit'">
                    <span>关联计划：</span>
                    <span>保存周期：</span>
                    <div style="height: 400px;">
                        计划详情：
                        <Calendar />
                    </div>
                </div>
            </div>

            <div class="items">
                <div><TitleComponent data="抓拍计划" /></div>
                <div class="item" v-if="_ref.photographStatus === 'add'">
                    <a-button shape="round" @click="onAdd('photograph')">
                        点击关联抓拍计划
                    </a-button>
                </div>
                <div v-if="_ref.photographStatus === 'select'">
                    <span>关联计划：</span>
                    <a-select
                        v-model:value="_ref.photographId"
                        style="width: 200px"
                        :options="_ref.photographOptions"
                        placeholder="请选择计划"
                    />
                    <a-button style="margin: 0 12px;">取消</a-button>
                    <a-button type="primary" @click="onSave('photograph')">保存</a-button>
                </div>
                <div v-if="_ref.photographStatus === 'edit'">
                    <span>关联计划：</span>
                    <span>保存周期：</span>
                    <div >
                        计划详情：
                        <Calendar/>
                    </div>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script setup lang="ts" name="Plan">
import { reactive } from 'vue';
import Calendar from '@/views/media/AutoVideo/components/Calendar/index.vue';

const emit = defineEmits(['close']);

const _ref = reactive({
    recordStatus: 'add',
    recordOptions: [],
    recordData: {},
    recordId: undefined,
    photographStatus: 'add',
    photographOptions: [],
    photographData: {},
    photographId: undefined,
});

const onAdd = (type: string) => {
    if (type === 'record') {
        _ref.recordStatus = 'select';
    } else {
        _ref.photographStatus = 'select';
    }
};

const onSave = (type:string)=>{
    if (type === 'record') {
        _ref.recordStatus = 'edit';
    } else {
        _ref.photographStatus = 'edit';
    }
}

</script>

<style lang="less" scoped>
.content {
    .items {
        margin-bottom: 12px;
        .item {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 60px;
            background-color: #eee;
            margin: 6px 0;
        }
    }
}
</style>
