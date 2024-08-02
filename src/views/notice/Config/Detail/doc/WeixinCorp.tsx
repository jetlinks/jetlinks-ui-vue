// import './index.less';
import { Image } from 'ant-design-vue';
import { getImage } from '@/utils/comm';
import i18n from '@/i18n'
const $t = i18n.global.t
const WeixinCorp = () => {
    const corpId = getImage(
        '/notice/doc/config/weixin-corp/01-corpId.jpg',
    );
    const corpSecret = getImage(
        '/notice/doc/config/weixin-corp/02-corpSecret.jpg',
    );
    return (
        <div class={'doc'}>
            <div class={'url'}>
                {$t('doc.WeixinCorp.7374411-0')}
                <a
                    href="https://work.weixin.qq.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://work.weixin.qq.com
                </a>
            </div>
            <h1>{$t('doc.WeixinCorp.7374411-1')}</h1>
            <div>
                {$t('doc.WeixinCorp.7374411-2')}
            </div>
            <h1>{$t('doc.WeixinCorp.7374411-3')}</h1>
            <div>
                <h2>1、corpId</h2>
                <div>{$t('doc.WeixinCorp.7374411-4')}</div>
                <div>{$t('doc.WeixinCorp.7374411-5')}</div>
                <div class={'image'}>
                    <Image width="100%" src={corpId} />
                </div>
            </div>

            <h2>2、corpSecret</h2>
            <div>
                <div>{$t('doc.WeixinCorp.7374411-6')}</div>
                <div>
                    {$t('doc.WeixinCorp.7374411-7')}
                </div>
                <div class={'image'}>
                    <Image width="100%" src={corpSecret} />
                </div>
            </div>
        </div>
    );
};
export default WeixinCorp;
