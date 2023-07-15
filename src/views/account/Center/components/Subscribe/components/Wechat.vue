<template><div id="login_container"></div></template>

<script lang="ts" setup>
import { createScript } from '@/utils/document';

const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    }
})

const initData = async (appid: string) => {
    const _script = await createScript(
        'http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js',
    );
    if(_script) {
        console.log(props.data)
        const obj = new WxLogin({
            id: 'login_container',
            appid: props.data.appid,
            redirect_uri: props.data.redirect_uri,
            state: props.data.state,
            scope: 'snsapi_login',
            style: 'white'
        });
        console.log(obj)
    }
};

watchEffect(() => {
    if(props.data?.appid) {
        initData(props.data?.appid)
    }
    
})
</script>