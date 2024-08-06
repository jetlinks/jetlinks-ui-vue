<template>
    <div class="does-container">
        <div v-show="props.type === 'internal-standalone'">
            <h1>{{ $t('components.Does.710354-0') }}</h1>
            <div>
                {{ $t('components.Does.710354-1') }}
            </div>
            <div>
                {{ $t('components.Does.710354-2') }}
            </div>
            <div class="image">
                <j-image width="100%" :src="img1" />
            </div>

            <h1>{{ $t('components.Does.710354-3') }}</h1>
            <div>{{ $t('components.Does.710354-4') }}</div>
            <div>
                {{ $t('components.Does.710354-5') }}
            </div>
            <div>{{ $t('components.Does.710354-6') }}</div>
            <div>
              <span>{{ $t('components.Does.710354-7') }}</span>
            </div>
            <div>{{ $t('components.Does.710354-8') }}</div>
            <div>
                <span>{{ $t('components.Does.710354-9') }}</span>
            </div>
            <div>
                {{ $t('components.Does.710354-10') }}
            </div>
            <div>
                {{ $t('components.Does.710354-11') }}
            </div>
            <div>{{ $t('components.Does.710354-12') }}</div>
            <div>{{ $t('components.Does.710354-13') }}</div>
        </div>
        <div v-show="props.type === 'internal-integrated'">
            <h1>{{ $t('components.Does.710354-0') }}</h1>
            <div>
                {{ $t('components.Does.710354-14') }}
            </div>
            <div>{{ $t('components.Does.710354-15') }}</div>
            <div class="image">
                <j-image width="100%" :src="img2" />
            </div>
            <h1>{{ $t('components.Does.710354-3') }}</h1>
            <div>{{ $t('components.Does.710354-4') }}</div>
            <div>
                {{ $t('components.Does.710354-16') }}
            </div>
            <div>{{ $t('components.Does.710354-6') }}</div>
            <div>
               {{ $t('components.Does.710354-17') }}
            </div>
        </div>
        <div v-show="props.type === 'dingtalk-ent-app'">
            <div class="url">
                {{ $t('components.Does.710354-18') }}
                <a
                    href="https://open-dev.dingtalk.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://open-dev.dingtalk.com
                </a>
            </div>
            <h1>{{ $t('components.Does.710354-0') }}</h1>
            <div>{{ $t('components.Does.710354-19') }}</div>
            <div class="image">
                <j-image width="100%" :src="img4" />
            </div>
        </div>
        <div v-show="props.type === 'wechat-webapp'">
            <div class="url">
                {{ $t('components.Does.710354-20') }}
                <a
                    href="https://open.weixin.qq.com/cgi-bin/frame?t=home/web_tmpl&lang=zh_CN"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://open.weixin.qq.com/cgi-bin/frame?t=home/web_tmpl&lang=zh_CN
                </a>
            </div>
            <h1>{{ $t('components.Does.710354-0') }}</h1>
            <div>{{ $t('components.Does.710354-21') }}</div>
            <div class="image">
                <j-image width="100%" :src="img3" />
            </div>
        </div>
        <div v-show="props.type === 'third-party'">
            <h1>{{ $t('components.Does.710354-22') }}</h1>
            <div>
                {{ $t('components.Does.710354-23') }}
            </div>
            <div class="image">
                <j-image width="100%" :src="img5" />
            </div>
            <h1>{{ $t('components.Does.710354-3') }}</h1>
            <div>{{ $t('components.Does.710354-4') }}</div>
            <div>
                {{ $t('components.Does.710354-24') }}
            </div>
            <div>{{ $t('components.Does.710354-6') }}</div>
            <div>
                <span>{{ $t('components.Does.710354-25') }}</span>。
            </div>
            <div>{{ $t('components.Does.710354-8') }}</div>
            <div>
                <span>{{ $t('components.Does.710354-26') }}</span>。
            </div>
            <div>
              <span>{{ $t('components.Does.710354-10') }}</span>
            </div>
            <div>
              <span>{{ $t('components.Does.710354-27') }}</span>。
            </div>
            <div>{{ $t('components.Does.710354-12') }}</div>
            <div>{{ $t('components.Does.710354-13') }}</div>
        </div>
        <div v-show="props.type === 'wechat-miniapp'">
            <div class="url">
                {{ $t('components.Does.710354-28') }}
                <a
                    href="https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html
                </a>
            </div>
            <h1>{{ $t('components.Does.710354-0') }}</h1>
            <div>{{ $t('components.Does.710354-29') }}</div>
            <div class="image">
                <j-image width="100%" :src="img6" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getImage } from '@/utils/comm';
import type { applyType } from '../typing';
const props = defineProps<{
    type: applyType;
}>();

const img1 = getImage('/apply/1.png');
const img2 = getImage('/apply/2.png');
const img3 = getImage('/apply/3.png');
const img4 = getImage('/apply/4.png');
const img5 = getImage('/apply/5.png');
const img6 = getImage('/apply/6.png');
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
