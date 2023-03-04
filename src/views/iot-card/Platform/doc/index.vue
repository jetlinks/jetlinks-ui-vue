<template>
    <div v-if="type === 'onelink'" class="doc">
        <div class="url">
            中国移动物联卡能力开放平台：
            <a
                style="word-break: break-all"
                href="https://api.iot.10086.cn/api/index.html#/login"
                target="_blank"
                rel="noreferrer"
            >
                https://api.iot.10086.cn/api/index.html#/login
            </a>
        </div>
        <h1>1.概述</h1>
        <p>
            平台对接通过API的方式与三方系统进行数据对接，为物联卡的管理提供数据交互支持。
        </p>
        <h1>2.配置说明</h1>
        <h2>1、APP ID</h2>
        <p>
            第三方应用唯一标识，中国移动物联网全网管理员在 OneLink
            能力开放平台上分配并展示给集团客户。
            <br />
            获取路径：“中移物联卡能力开放平台”--“个人中心”--“客户信息”--“接入信息”
        </p>
        <div class="image">
            <j-image
                width="100%"
                :src="getImage('/iot-card/onelink-appid.png')"
            />
        </div>
        <h2>2、Password</h2>
        <p>
            API 接入秘钥,由中国移动物联网提供，集团客户从“OneLink
            能力开放平台”获取。
            <br />
            获取路径：“中移物联卡能力开放平台”--“个人中心”--“客户信息”--“接入信息”
        </p>
        <div class="image">
            <j-image
                width="100%"
                :src="getImage('/iot-card/onelink-pass.png')"
            />
        </div>
        <h2>3、接口地址</h2>
        <p>
            https://api.iot.10086.cn/v5/ec/get/token
            <br />
            token后缀请根据实际情况填写
            <br />
            示例：https://api.iot.10086.cn/v5/authService?appid=xxx&password=xxx&transid=xxx
        </p>
    </div>

    <div v-if="type === 'ctwing'" class="doc">
        <div class="url">
            5G连接管理平台：
            <a
                style="word-break: break-all"
                href="https://cmp.ctwing.cn:4821/login"
                target="_blank"
                rel="noreferrer"
            >
                https://cmp.ctwing.cn:4821/login
            </a>
        </div>
        <div>
            <h1>1.概述</h1>
            <p>
                平台对接通过API的方式与三方系统进行数据对接，为物联卡的管理提供数据交互支持。
            </p>
            <h1>2.配置说明</h1>
            <h2>1、用户 id</h2>
            <p>
                5G连接管理平台用户的唯一标识，用于身份识别。
                <br />
                获取路径：“5G连接管理平台”--“能力开放”--“API网关账号管理”
            </p>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/iot-card/ctwing-id.png')"
                />
            </div>

            <h2>2、密码</h2>
            <p>
                用户id经加密之后的密码。
                <br />
                获取路径：“5G连接管理平台”--“能力开放”--“API网关账号管理”
            </p>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/iot-card/ctwing-pass.png')"
                />
            </div>

            <h2>3、secretKey</h2>
            <p>
                APP secret唯一秘钥。
                <br />
                获取路径：“5G连接管理平台”--“能力开放”--“API网关账号管理”
            </p>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/iot-card/ctwing-secret.png')"
                />
            </div>
        </div>
    </div>

    <div v-if="type === 'unicom'" class="doc">
        <div class="url">
            雁飞智连CMP平台：
            <a
                style="word-break: break-all"
                href="  https://cmp.10646.cn/webframe/login"
                target="_blank"
                rel="noreferrer"
            >
                https://cmp.10646.cn/webframe/login
            </a>
        </div>

        <div>
            <h1>1.概述</h1>
            <p>
                平台对接通过API的方式与三方系统进行数据对接，为物联卡的管理提供数据交互支持。
            </p>
            <h1>2.配置说明</h1>
            <h2>1、APP ID</h2>
            <p>
                第三方应用唯一标识。
                <br />
                获取路径：“雁飞智连CMP平台”--“我的应用”--“应用列表”
            </p>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/iot-card/unicom-id.png')"
                />
            </div>

            <h2>2、App Secret</h2>
            <p>
                API 接入秘钥。
                <br />
                获取路径：“雁飞智连CMP平台”--“我的应用”--“应用列表”
            </p>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/iot-card/unicom-secret.png')"
                />
            </div>

            <h2>3、创建者ID</h2>
            <p>
                接口参数中的 OpenId。
                <br />
                获取路径：“雁飞智连CMP平台”--“我的应用”--“应用列表”
                <br />
            </p>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/iot-card/unicom-openid.png')"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getImage } from '@/utils/comm';

const props = defineProps({
    type: { type: String, default: 'onelink' },
});
</script>

<style scoped lang="less">
.doc {
    height: 800px;
    padding: 24px;
    overflow-y: auto;
    color: rgba(#000, 0.8);
    font-size: 14px;
    background-color: #fafafa;

    .url {
        padding: 8px 16px;
        color: #2f54eb;
        background-color: rgba(#a7bdf7, 0.2);
    }

    h1 {
        margin: 16px 0;
        color: rgba(#000, 0.85);
        font-weight: bold;
        font-size: 14px;

        // &:first-child {
        //     margin-top: 0;
        // }
    }

    h2 {
        margin: 6px 0;
        color: rgba(0, 0, 0, 0.8);
        font-size: 14px;
    }

    .image {
        margin: 16px 0;
    }
}
</style>
