<template>
    <div v-if="type === 'onelink'" class="doc">
        <div class="url">
            {{ $t('doc.index.387411-0') }}
            <a
                style="word-break: break-all"
                href="https://api.iot.10086.cn/api/index.html#/login"
                target="_blank"
                rel="noreferrer"
            >
                https://api.iot.10086.cn/api/index.html#/login
            </a>
        </div>
        <h1>{{ $t('doc.index.387411-1') }}</h1>
        <p>
            {{ $t('doc.index.387411-2') }}
        </p>
        <h1>{{ $t('doc.index.387411-3') }}</h1>
        <h2>1、APP ID</h2>
        <p>
            {{ $t('doc.index.387411-4') }}
            <br />
            {{ $t('doc.index.387411-5') }}
        </p>
        <div class="image">
            <j-image
                width="100%"
                :src="getImage('/iot-card/onelink-appid.png')"
            />
        </div>
        <h2>2、Password</h2>
        <p>
            {{ $t('doc.index.387411-6') }}
            <br />
            {{ $t('doc.index.387411-5') }}
        </p>
        <div class="image">
            <j-image
                width="100%"
                :src="getImage('/iot-card/onelink-pass.png')"
            />
        </div>
        <h2>{{ $t('doc.index.387411-7') }}</h2>
        <p>
            https://api.iot.10086.cn/v5/ec/get/token
            <br />
            {{ $t('doc.index.387411-8') }}
            <br />
            {{ $t('doc.index.387411-9') }}
        </p>
    </div>

    <div v-if="type === 'ctwing'" class="doc">
        <div class="url">
            {{ $t('doc.index.387411-10') }}
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
            <h1>{{ $t('doc.index.387411-1') }}</h1>
            <p>
                {{ $t('doc.index.387411-2') }}
            </p>
            <h1>{{ $t('doc.index.387411-3') }}</h1>
            <h2>{{ $t('doc.index.387411-11') }}</h2>
            <p>
                {{ $t('doc.index.387411-12') }}
                <br />
                {{ $t('doc.index.387411-13') }}
            </p>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/iot-card/ctwing-id.png')"
                />
            </div>

            <h2>{{ $t('doc.index.387411-14') }}</h2>
            <p>
                {{ $t('doc.index.387411-15') }}
                <br />
                {{ $t('doc.index.387411-13') }}
            </p>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/iot-card/ctwing-pass.png')"
                />
            </div>

            <h2>3、secretKey</h2>
            <p>
                {{ $t('doc.index.387411-16') }}
                <br />
                {{ $t('doc.index.387411-13') }}
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
            {{ $t('doc.index.387411-17') }}
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
            <h1>{{ $t('doc.index.387411-1') }}</h1>
            <p>
                {{ $t('doc.index.387411-2') }}
            </p>
            <h1>{{ $t('doc.index.387411-3') }}</h1>
            <h2>1、APP ID</h2>
            <p>
                {{ $t('doc.index.387411-18') }}
                <br />
                {{ $t('doc.index.387411-19') }}
            </p>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/iot-card/unicom-id.png')"
                />
            </div>

            <h2>2、App Secret</h2>
            <p>
                {{ $t('doc.index.387411-20') }}
                <br />
                {{ $t('doc.index.387411-19') }}
            </p>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/iot-card/unicom-secret.png')"
                />
            </div>

            <h2>{{ $t('doc.index.387411-21') }}</h2>
            <p>
                {{ $t('doc.index.387411-22') }}
                <br />
                {{ $t('doc.index.387411-19') }}
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
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

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
