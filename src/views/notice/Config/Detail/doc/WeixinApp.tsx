// import './index.less';
import { Image } from 'ant-design-vue';
import { getImage } from '@/utils/comm';
import i18n from '@/i18n'
const $t = i18n.global.t
const WeixinApp = () => {
    const appId = getImage('/notice/doc/config/weixin-official/01-AppID.jpg');
    const appSecret = getImage(
        '/notice/doc/config/weixin-official/02-AppSecret.jpg',
    );

    return (
        <div class={'doc'}>
            <div class={'url'}>
                {$t('doc.WeixinApp.7374412-0')}
                <a
                    href="https://mp.weixin.qq.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://mp.weixin.qq.com/
                </a>
            </div>
            <h1>{$t('doc.WeixinApp.7374412-1')}</h1>
            <div>
                {$t('doc.WeixinApp.7374412-2')}
            </div>
            <h1>{$t('doc.WeixinApp.7374412-3')}</h1>
            <div>
                <h2>1、AppID</h2>
                <div>{$t('doc.WeixinApp.7374412-4')}</div>
                <div>
                    {$t('doc.WeixinApp.7374412-5')}
                </div>
                <div class={'image'}>
                    <Image width="100%" src={appId} />
                </div>
            </div>
            <h2>2、AppSecret</h2>
            <div>
                <div>{$t('doc.WeixinApp.7374412-6')}</div>
                <div>
                    {$t('doc.WeixinApp.7374412-5')}
                </div>
                <div class={'image'}>
                    <Image width="100%" src={appSecret} />
                </div>
            </div>
        </div>
    );
};
export default WeixinApp;
