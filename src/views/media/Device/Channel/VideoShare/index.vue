<template>
    <a-modal
        title="视频分享"
        visible
        @cancel="emit('close')"
        :maskClosable="false"
        width="900px"
    >
        <div class="top">
            <span>有效期：</span>
            <a-input-number
                style="width: 200px"
                :precision="0"
                :min="1"
                v-model:value="expires"
            >
                <template #addonAfter>
                    <a-select
                        v-model:value="unit"
                        :options="[
                            { label: '秒', value: 'seconds' },
                            { label: '分', value: 'minutes' },
                            { label: '小时', value: 'hours' },
                        ]"
                    />
                </template>
            </a-input-number>
            
        </div>
        <a-table :columns="columns" :dataSource="dataSource" :pagination="false">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'actions'">
                    <a-button type="link" @click="onCopy(record)"
                        >复制链接</a-button
                    >
                </template>
            </template>
        </a-table>
        <template #footer>
            <a-button type="primary" @click="emit('close')">确定</a-button>
        </template>
    </a-modal>
</template>

<script setup lang="ts" name="Address">
// import DeviceApi from '@/api/media/device';
import { pick, toUpper } from 'lodash-es';
import { onMounted, ref } from 'vue';
import { onlyMessage } from '@/utils/comm';

const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
});
const emit = defineEmits(['close']);
const types = ['flv', 'hls', 'mp4', 'rtmp', 'rtsp', 'rtc'];
const unit = ref('hours');
const expires = ref(1);
const dataSource = ref<any[]>([]);

const result = {
    rtsp: 'rtsp://192.168.35.210:554/device/34020000001320000155/34020000001320000001?token=AQAAAZErsgTXABQzNDAyMDAwMDAwMTMyMDAwMDE1NaM4hacTu98d7mya1getDQ0',
    rtmp: 'rtmp://192.168.35.210:1935/device/34020000001320000155/34020000001320000001?token=AQAAAZErsgTXABQzNDAyMDAwMDAwMTMyMDAwMDE1NaM4hacTu98d7mya1getDQ0',
    flv: 'http://192.168.35.210:8188/device/34020000001320000155/34020000001320000001.live.flv?token=AQAAAZErsgTXABQzNDAyMDAwMDAwMTMyMDAwMDE1NaM4hacTu98d7mya1getDQ0',
    mp4: 'http://192.168.35.210:8188/device/34020000001320000155/34020000001320000001.live.mp4?token=AQAAAZErsgTXABQzNDAyMDAwMDAwMTMyMDAwMDE1NaM4hacTu98d7mya1getDQ0',
    hls: 'http://192.168.35.210:8188/device/34020000001320000155/34020000001320000001/hls.m3u8?token=AQAAAZErsgTXABQzNDAyMDAwMDAwMTMyMDAwMDE1NaM4hacTu98d7mya1getDQ0',
    rtc: 'http://192.168.35.210:8188/index/api/webrtc?app=device&stream=34020000001320000155/34020000001320000001&type=play&token=AQAAAZErsgTXABQzNDAyMDAwMDAwMTMyMDAwMDE1NaM4hacTu98d7mya1getDQ0',
    streamId: '34020000001320000155/34020000001320000001',
    forRecord: false,
};

const columns = [
    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        ellipsis: true,
        width:70
    },
    {
        title: '链接',
        dataIndex: 'url',
        key: 'url',
        ellipsis: true,
    },
    {
        title: '操作',
        key: 'actions',
        width: 100,
    },
];

const handleResult =  (params?: any) => {
    // let arr:any
    // const res = await DeviceApi.queryShareUrl(
    //     props.data.deviceId,
    //     props.data.channelId,
    //     params ? params : {},
    // );
    // if (res.status === 200) {
    //    arr = res.result
    //     console.log('url.value====', url.value);
    // }
    return result
};

const _query = ()=>{
    const res = handleResult();
    dataSource.value = types.map(item=>({
        id:item,
        type:item,
        url:res[item],
    }))

    console.log('dataSource.value====', dataSource.value,res);
}


const onCopy = (record) => {
    if(navigator.clipboard){
        navigator.clipboard.writeText(record.url)
        onlyMessage('复制成功！');
    }else{
        const input = document.createElement('input');
        input.value = JSON.stringify(record.url);
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        onlyMessage('复制成功！');
    }
};

onMounted(() => {
    _query()
});
</script>

<style lang="less" scoped>
.top {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
}
</style>
