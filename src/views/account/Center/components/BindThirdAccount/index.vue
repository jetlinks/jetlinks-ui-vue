<template>
    <div class="box">
        <div class="content">
            <template v-if="bindList.length">
                <div class="content-item" v-for="item in bindList" :key="item.id">
                    <div class="content-item-left">
                        <img
                            :src="item.logoUrl || getImage(bindIcon[item.provider])"
                            style="height: 50px; width: 50px"
                            width="50px"
                            height="50px"
                            alt=""
                        />
                        <Ellipsis style="max-width: 200px; font-size: 22px">{{
                            item?.name
                        }}</Ellipsis>
                        <div>
                            <j-tag v-if="item.bound">已绑定</j-tag>
                            <j-tag v-else>未绑定</j-tag>
                        </div>
                        <div v-if="item.others?.name">
                            绑定名：{{ item.others?.name }}
                        </div>
                    </div>
                    <div>
                        <j-popconfirm
                            v-if="item.bound"
                            title="确认解除绑定嘛?"
                            @confirm="() => unBind(item.id)"
                        >
                            <j-button>解除绑定</j-button>
                        </j-popconfirm>
                        <j-button v-else type="primary" @click="clickBind(item.id)"
                            >立即绑定</j-button
                        >
                    </div>
                </div>
            </template>
            <j-empty v-else style="margin: 200px 0;" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { BASE_API_PATH } from '@/utils/variable';
import { getSsoBinds_api } from '@/api/account/center';
import { unBind_api } from '@/api/account/center';
import { onlyMessage, getImage } from '@/utils/comm';

const bindList = ref<any[]>([]);
const bindIcon = {
    'dingtalk-ent-app': '/notice/dingtalk.png',
    'wechat-webapp': '/notice/wechat.png',
    'internal-standalone': '/apply/internal-standalone.png',
    'third-party': '/apply/third-party.png',
};
const unBind = (id: string) => {
    unBind_api(id).then((resp) => {
        if (resp.status === 200) {
            onlyMessage('解绑成功', 'success');
            getSsoBinds();
        }
    });
};
const clickBind = (id: string) => {
    window.open(
        `${BASE_API_PATH}/application/sso/${id}/login?autoCreateUser=false`,
    );
    localStorage.setItem('onBind', 'false');
    localStorage.setItem('onLogin', 'yes');
    window.onstorage = (e) => {
        if (e.newValue) {
            getSsoBinds();
        }
    };
};

/**
 * 获取绑定第三方账号
 */
function getSsoBinds() {
    getSsoBinds_api().then((resp: any) => {
        if (resp.status === 200) bindList.value = resp.result;
    });
}

onMounted(() => {
    getSsoBinds();
});
</script>

<style lang="less" scoped>
.box {
    display: flex;
    justify-content: center;
    .content {
        margin-top: 24px;
        width: 80%;

        .content-item {
            width: 100%;
            margin: 10px 0;
            padding: 15px;
            border: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .content-item-left {
                display: flex;
                gap: 24px;
                align-items: center;
            }
        }
    }
}
</style>