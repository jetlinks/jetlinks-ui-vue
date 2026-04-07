import './index.less';
import { Image } from 'ant-design-vue';
import { configImages } from '../../../../assets/notice/index';
import i18n from '@jetlinks-web-core/locales/index'
const $t = i18n.global.t
const DingTalk = () => {
    const appKey = configImages.AppKey
    const appSecret = configImages.AppSecret

    return (
        <div class={'doc'}>
            <div class={'url'}>
                {$t('doc.DingTalk.707709-0')}
                <a
                    href="https://open-dev.dingtalk.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://open-dev.dingtalk.com
                </a>
            </div>
            <h1>{$t('doc.DingTalk.707709-1')}</h1>
            <div>
                {$t('doc.DingTalk.707709-2')}
            </div>
            <h1>{$t('doc.DingTalk.707709-3')}</h1>
            <div>
                <h2>1、AppKey</h2>
                <div>
                    {$t('doc.DingTalk.707709-4')}
                </div>
                <div>{$t('doc.DingTalk.707709-5')}</div>
                <div class={'image'}>
                    <Image width="100%" src={appKey} />
                </div>
            </div>
            <h2>2、AppSecret</h2>
            <div>
                <div>{$t('doc.DingTalk.707709-6')}</div>
                <div>{$t('doc.DingTalk.707709-5')}</div>
                <div class={'image'}>
                    <Image width="100%" src={appSecret} />
                </div>
            </div>
        </div>
    );
};
export default DingTalk;
