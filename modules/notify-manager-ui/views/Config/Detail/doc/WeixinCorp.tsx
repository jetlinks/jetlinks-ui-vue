import './index.less';
import { Image } from 'ant-design-vue';
import { configImages } from '../../../../assets/notice/index';
import i18n from '@jetlinks-web-core/locales/index'
const $t = i18n.global.t
const WeixinCorp = () => {
    const corpId = configImages.corpId;
    const corpSecret = configImages.corpSecret;
    return (
        <div class={'doc'}>
            <div class={'url'}>
                {$t('doc.WeixinCorp.707692-0')}
                <a
                    href="https://work.weixin.qq.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://work.weixin.qq.com
                </a>
            </div>
            <h1>{$t('doc.WeixinCorp.707692-1')}</h1>
            <div>
                {$t('doc.WeixinCorp.707692-2')}
            </div>
            <h1>{$t('doc.WeixinCorp.707692-3')}</h1>
            <div>
                <h2>1、corpId</h2>
                <div>{$t('doc.WeixinCorp.707692-4')}</div>
                <div>{$t('doc.WeixinCorp.707692-5')}</div>
                <div class={'image'}>
                    <Image width="100%" src={corpId} />
                </div>
            </div>

            <h2>2、corpSecret</h2>
            <div>
                <div>{$t('doc.WeixinCorp.707692-6')}</div>
                <div>
                    {$t('doc.WeixinCorp.707692-7')}
                </div>
                <div class={'image'}>
                    <Image width="100%" src={corpSecret} />
                </div>
            </div>
        </div>
    );
};
export default WeixinCorp;
