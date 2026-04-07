import './index.less';
import { Image } from 'ant-design-vue';
import { configImages } from '../../../../assets/notice/index';
import i18n from '@jetlinks-web-core/locales/index'
const $t = i18n.global.t
const WeixinApp = () => {
    const appId = configImages.AppID;
    const appSecret = configImages.weixinAppSecret;

    return (
        <div class={'doc'}>
            <div class={'url'}>
                {$t('doc.WeixinApp.707693-0')}
                <a
                    href="https://mp.weixin.qq.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://mp.weixin.qq.com/
                </a>
            </div>
            <h1>{$t('doc.WeixinApp.707693-1')}</h1>
            <div>
                {$t('doc.WeixinApp.707693-2')}
            </div>
            <h1>{$t('doc.WeixinApp.707693-3')}</h1>
            <div>
                <h2>1、AppID</h2>
                <div>{$t('doc.WeixinApp.707693-4')}</div>
                <div>
                    {$t('doc.WeixinApp.707693-5')}
                </div>
                <div class={'image'}>
                    <Image width="100%" src={appId} />
                </div>
            </div>
            <h2>2、AppSecret</h2>
            <div>
                <div>{$t('doc.WeixinApp.707693-6')}</div>
                <div>
                    {$t('doc.WeixinApp.707693-5')}
                </div>
                <div class={'image'}>
                    <Image width="100%" src={appSecret} />
                </div>
            </div>
        </div>
    );
};
export default WeixinApp;
