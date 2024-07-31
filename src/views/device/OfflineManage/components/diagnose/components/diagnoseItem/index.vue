<template>
    <div class="diagnose-item">
        <div class="flex-lt">
            <div class="icon">
                <img :src="data.path" alt="statusImage" />
            </div>
            <div class="text">
                <p class="title">{{ data.title }}</p>
                <p class="desc">
                    {{ data.desc }}
                </p>
                <div class="additional">
                    <slot>
                        <template
                            v-for="(item, index) in data.additional"
                            :key="index"
                        >
                            <p v-if="!isXieliDevice && index === 3">
                                <a-badge status="default" :text="item" />
                            </p>
                        </template>
                    </slot>
                </div>
            </div>
        </div>
        <div class="flex-rt result">
            {{ data.result }}
        </div>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'DiagnoseItem',
});

defineProps<{ isXieliDevice: boolean }>();

const data = {
    path: '/images/diagnose/status/warning.png',
    title: '其他可能异常',
    desc: '当以上诊断均无异常时，请检查以下内容',
    additional: [
        '产品-${MQTT认证配置}规则可能有加密处理，请认真查看设备接入配置中【消息协议】说明',
        '设备-${MQTT认证配置}规则可能有加密处理，请认真查看设备接入配置中【消息协议】说明',
        '请根据设备接入配置中${URL}信息，任意上报一条数据',
        '请检查电池电量是否充足',
        '其他设备请检查是否存在网络通信故障',
    ],
    result: '可能存在异常',
};
</script>

<style scoped lang="less">
.diagnose-item {
    --result-loading: #000;
    --result-pass: #00b87a;
    --result-fail: #ff3325;
    --result-unknown: #ff9100;

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    padding: 20px;
    border: 1px solid #ececec;
    transform: translateY(-20px);

    &:not(&:first-child) {
        border-top: 0;
    }

    .flex-lt {
        display: flex;
        gap: 24px;
        align-items: center;

        .icon {
            height: 32px;
            width: 32px;
            overflow: hidden;
            //margin-right: 16px;
            img {
                display: block;
                height: 32px;
                width: auto;
            }

            .rotate {
                animation: rotate 1s linear infinite;
            }

            @keyframes rotate {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }
        }

        .text {
            .title {
                color: #000c;
                font-weight: 700;
                font-size: 18px;
            }
            .additional {
                margin: 0;
                //list-style: none;
            }
            p {
                margin-bottom: 0;
            }
        }
    }

    .flex-rt {
        font-weight: 700;
        font-size: 18px;
    }
    .result {
        color: var(--result-unknown);
        text-wrap: nowrap;
    }
}
</style>
