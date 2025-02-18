<template>
    <div class="does-container">
        <div v-show="props.type === 'internal-standalone'">
            <h1>{{ $t('components.Does.860107-0') }}</h1>
            <div>
              {{ $t('components.Does.860107-1') }}
            </div>
            <div>
              {{ $t('components.Does.860107-2') }}
            </div>
            <div class="image">
                <a-image width="100%" :src="img1" />
            </div>

            <h1>{{ $t('components.Does.860107-3') }}</h1>
            <div>{{ $t('components.Does.860107-4') }}</div>
            <div>
              {{ $t('components.Does.860107-5') }}
            </div>
            <div>{{ $t('components.Does.860107-6') }}</div>
            <div>
              {{ $t('components.Does.860107-7') }}
            </div>
            <div>{{ $t('components.Does.860107-8') }}</div>
            <div>
              {{ $t('components.Does.860107-9') }}
            </div>
            <div>
              {{ $t('components.Does.860107-10') }}
            </div>
            <div>
              {{ $t('components.Does.860107-11') }}
            </div>
            <div>{{ $t('components.Does.860107-12') }}</div>
            <div>{{ $t('components.Does.860107-13') }}</div>
        </div>
        <div v-show="props.type === 'internal-integrated'">
            <h1>{{ $t('components.Does.860107-0') }}</h1>
            <div>
              {{ $t('components.Does.860107-14') }}
            </div>
            <div>{{ $t('components.Does.860107-15') }}</div>
            <div class="image">
                <a-image width="100%" :src="img2" />
            </div>
            <h1>{{ $t('components.Does.860107-3') }}</h1>
            <div>{{ $t('components.Does.860107-4') }}</div>
            <div>
              {{ $t('components.Does.860107-16') }}
            </div>
            <div>{{ $t('components.Does.860107-6') }}</div>
            <div>
              {{ $t('components.Does.860107-17') }}
            </div>
        </div>
        <div v-show="props.type === 'dingtalk-ent-app'">
            <div class="url">
                {{ $t('components.Does.860107-51') }}
                <a
                    href="https://open-dev.dingtalk.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://open-dev.dingtalk.com
                </a>
            </div>
            <h1>{{ $t('components.Does.860107-0') }}</h1>
            <div>{{ $t('components.Does.860107-18') }}</div>
            <div class="image">
                <a-image width="100%" :src="img4" />
            </div>
        </div>
        <div v-show="props.type === 'wechat-webapp'">
            <div class="url">
                {{ $t('components.Does.860107-53') }}
                <a
                    href="https://open.weixin.qq.com/cgi-bin/frame?t=home/web_tmpl&lang=zh_CN"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://open.weixin.qq.com/cgi-bin/frame?t=home/web_tmpl&lang=zh_CN
                </a>
            </div>
            <h1>{{ $t('components.Does.860107-0') }}</h1>
            <div>{{ $t('components.Does.860107-19') }}</div>
            <div class="image">
                <a-image width="100%" :src="img3" />
            </div>
        </div>
        <div v-show="props.type === 'third-party'">
            <h1>{{ $t('components.Does.860107-0') }}</h1>
            <div>
              {{ $t('components.Does.860107-20') }}
            </div>
            <div class="image">
                <a-image width="100%" :src="img5" />
            </div>
            <h1>{{ $t('components.Does.860107-3') }}</h1>
            <div>{{ $t('components.Does.860107-4') }}</div>
            <div>
              {{ $t('components.Does.860107-21') }}
            </div>
            <div>{{ $t('components.Does.860107-6') }}</div>
            <div>
              {{ $t('components.Does.860107-22') }}
            </div>
            <div>{{ $t('components.Does.860107-8') }}</div>
            <div>
              {{ $t('components.Does.860107-23') }}
            </div>
            <div>
              {{ $t('components.Does.860107-24') }}
            </div>
            <div>
              {{ $t('components.Does.860107-25') }}
            </div>
            <div>{{ $t('components.Does.860107-12') }}</div>
            <div>{{ $t('components.Does.860107-26') }}</div>
        </div>
        <div v-show="props.type === 'wechat-miniapp'">
            <div class="url">
                {{ $t('components.Does.860107-64') }}
                <a
                    href="https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html
                </a>
            </div>
            <h1>{{ $t('components.Does.860107-0') }}</h1>
          <div>{{ $t('components.Does.860107-27') }}</div>
            <div class="image">
                <a-image width="100%" :src="img6" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { applyType } from '../typing';
import {systemImg} from "@/assets";
const props = defineProps<{
    type: applyType;
}>();

const img1 = systemImg.apply1;
const img2 = systemImg.apply2;
const img3 = systemImg.apply3;
const img4 = systemImg.apply4;
const img5 = systemImg.apply5;
const img6 = systemImg.apply6;
</script>

<style lang="less" scoped>
.does-container {
    padding: 24px;
    overflow-y: auto;
    height: 100%;
    color: rgba(#000, 0.8);
    font-size: 14px;
    background-color: #fafafa;

    .url {
        padding: 8px 16px;
        color: #2f54eb;
        background-color: rgba(#a7bdf7, 0.2);
        word-wrap: break-word;
    }

    h1 {
        margin: 16px 0;
        color: rgba(#000, 0.85);
        font-weight: bold;
        font-size: 14px;

        &:first-child {
            margin-top: 0;
        }
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
