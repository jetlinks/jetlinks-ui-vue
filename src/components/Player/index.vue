<!-- 视频播放 -->
<template>
    <vue3videoPlay v-bind="options" />
</template>

<script setup lang="ts">
import 'vue3-video-play/dist/style.css';
import vue3videoPlay from 'vue3-video-play';

const props = defineProps({
    src: { type: String, default: '' },
    type: { type: String, default: 'mp4' },
    width: { type: String, default: '500px' },
    height: { type: String, default: '280px' },
});

watch(
    () => props.src,
    (val: string) => {
        options.src = val;
    },
);

const options = reactive({
    ...props,
    color: '#409eff', //主题色
    title: '', //视频名称
    // src: props.src,
    // type: props.type,
    muted: false, //静音
    webFullScreen: false,
    speedRate: ['0.75', '1.0', '1.25', '1.5', '2.0'], //播放倍速
    autoPlay: true, //自动播放
    loop: false, //循环播放
    mirror: false, //镜像画面
    ligthOff: false, //关灯模式
    volume: 0.3, //默认音量大小
    control: true, //是否显示控制
    controlBtns: [
        'audioTrack',
        'quality',
        'speedRate',
        'volume',
        'setting',
        'pip',
        'pageFullScreen',
        'fullScreen',
    ], //显示所有按钮,
});
</script>
