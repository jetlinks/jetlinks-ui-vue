<template>
    <JsonViewer :value=context :expanded="true" :expandDepth="4"></JsonViewer>
</template>

<script lang="ts" setup>
import { JsonViewer } from 'vue3-json-viewer';
import templateApi from '../../../../api/template';
const props = defineProps({
    data: Object
})
const typeObj = {
    weixin: 'wechat',
    dingTalk: 'dingtalk',
};
/**
 * 查看用户名
 */
const userList = ref([])
const departmentList = ref([])
const detailData = ref();
const context = ref()
/**
 * 改变部门和用户
 */
const replaceData = async (data: any) => {
    detailData.value = data
    context.value = data.context
    if (context.value.detailJson) {
        context.value.detailJson = context.value.detailJson.replace(/\\\"/g, '\"')
    }
    if (context.value.hasOwnProperty('userIdList') || context.value.hasOwnProperty('toUser')) {
        templateApi.getUser(
            typeObj[detailData.value.notifyType],
            detailData.value.notifierId,
        ).then((res: any) => {
            if (res.status === 200) {
                userList.value = res.result
                userList.value.forEach((item: any) => {
                    item.id === context.value?.userIdList ? context.value.userIdList = item.name : ''
                    item.id === context.value?.toUser ? context.value.toUser = item.name : ''
                })
            }
        })
    }
    if (context.value.hasOwnProperty('departmentIdList')) {
        templateApi.getDept(typeObj[detailData.value.notifyType],
            detailData.value.notifierId).then((res: any) => {
                if (res.status === 200) {
                    departmentList.value = res.result
                    departmentList.value.forEach((item: any) => {
                        item.id === context.value.departmentIdList ? context.value.departmentIdList = item.name : ''
                    })
                }
            })
    }
}
replaceData(props.data)
</script>
<style lang="less" scoped></style>