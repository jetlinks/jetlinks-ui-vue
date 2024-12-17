<template>
    <div class="container">
        <div class="header">
            <a-space>
                <div>共{{ statistics?.total || 0 }}个资源</div>
                <div>
                    <AIcon type="CheckCircleOutlined" class="icon"></AIcon>已完成{{ statistics?.success || 0 }}
                </div>
                <div>
                    <AIcon type="ExclamationCircleOutlined" class="icon" />已失败{{ statistics?.fail || 0 }}
                </div>
                <div>
                    <AIcon type="HourglassOutlined" class="icon" />安装中{{ statistics?.install || 0 }}
                </div>
                <div>
                    <AIcon type="ClockCircleOutlined" class="icon" />排队中{{ statistics?.queue || 0 }}
                </div>
                <div>
                    <AIcon type="PauseCircleOutlined" class="icon" />已暂停{{ statistics?.pause || 0 }}
                </div>
            </a-space>
            <a-button @click="pauseAll" type="primary" v-if="controlStatue === 'pause'">
                <template #icon>
                    <AIcon type="PauseOutlined"></AIcon>
                </template>
                全部暂停</a-button>
            <a-space v-else>
                <a-button @click="startAll" type="primary">
                    <template #icon>
                        <AIcon type="CaretRightOutlined"></AIcon>
                    </template>
                    全部开始</a-button>
                <a-button @click="removeAll" type="primary">
                    <template #icon>
                        <AIcon type="DeleteOutlined"></AIcon>
                    </template>
                    全部移除</a-button>
            </a-space>
        </div>
        <UploadFile :data="uploadList">
            <template #control="{ data, index }">
                <div @mouseleave="() => handleMouseLeave(index)" @mouseenter="() => handleMouseEnter(index)"
                    class="listControl">
                    <template v-if="true">
                        <AIcon type="CheckCircleFilled" style="color:#20b759" class="listIcon" v-if="!showBtn[index]">
                        </AIcon>
                        <a-button v-else>查看详情</a-button>
                    </template>
                    <template v-if="false">
                        <AIcon type="ToolOutlined" class="listIcon" v-if="!showBtn[index]">
                        </AIcon>
                        <a-button v-else>暂停</a-button>
                    </template>
                    <template v-if="false">
                        <AIcon type="PauseCircleOutlined" class="listIcon" v-if="!showBtn[index]">
                        </AIcon>
                        <a-button v-else>开始</a-button>
                    </template>
                    <template v-if="false">
                        <AIcon type="LoadingOutlined" class="listIcon" v-if="!showBtn[index]">
                        </AIcon>
                        <a-button v-else>移除</a-button>
                    </template>
                    <template v-if="false">
                        <AIcon type="InfoCircleOutlined" class="listIcon" v-if="!showBtn[index]">
                        </AIcon>
                        <a-button v-else>重装</a-button>
                    </template>
                </div>
            </template>
        </UploadFile>
    </div>
</template>

<script setup>
import UploadFile from './UploadFile.vue';
import { getImage } from '@/utils/comm';
const statistics = ref({

})
const uploadList = ref([
    {
        img: getImage('/device-product.png'),
        name: '测试',
        type: '测试',
        version: 'V1.1.2'
    }
])
const showBtn = ref()
const controlStatue = ref('pause')
const pauseAll = () => {
    controlStatue.value = 'start'
}
const startAll = () => {
    controlStatue.value = 'pause'
}

const removeAll = () =>{
    
}

const handleMouseEnter = (index) => {
    showBtn.value[index] = true;
};

const handleMouseLeave = (index) => {
    showBtn.value[index] = false;
}

watch(() => uploadList, () => {
    const status = []
    uploadList.value.forEach((i) => {
        status.push(false)
    })
    showBtn.value = status
}, {
    immediate: true,
    deep: true
})
</script>
<style lang='less' scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .icon {
        margin-right: 4px;
    }
}

.listControl {
    height: 35px;
}

.listIcon {
    font-size: 32px;
    margin-right: 12px;
}
</style>