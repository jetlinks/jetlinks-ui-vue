// import './index.less';
import { Image } from 'jetlinks-ui-components';
import { getImage } from '@/utils/comm';
import i18n from '@/i18n'
const $t = i18n.global.t

const DingTalk = () => {
    const appKey = getImage(
        '/notice/doc/config/dingTalk-message/01-AppKey.jpg',
    );
    const appSecret = getImage(
        '/notice/doc/config/dingTalk-message/02-AppSecret.jpg',
    );

    return (
        <div class={'doc'}>
            <div class={'url'}>
                {$t('doc.DingTalk.737446-0')}
                <a
                    href="https://open-dev.dingtalk.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://open-dev.dingtalk.com
                </a>
            </div>
            <h1>{$t('doc.DingTalk.737446-1')}</h1>
            <div>
                {$t('doc.DingTalk.737446-2')}
            </div>
            <h1>{$t('doc.DingTalk.737446-3')}</h1>
            <div>
                <h2>1、AppKey</h2>
                <div>
                    {$t('doc.DingTalk.737446-4')}
                </div>
                <div>{$t('doc.DingTalk.737446-5')}</div>
                <div class={'image'}>
                    <Image width="100%" src={appKey} />
                </div>
            </div>
            <h2>2、AppSecret</h2>
            <div>
                <div>{$t('doc.DingTalk.737446-6')}</div>
                <div>{$t('doc.DingTalk.737446-5')}</div>
                <div class={'image'}>
                    <Image width="100%" src={appSecret} />
                </div>
            </div>
        </div>
    );
};
export default DingTalk;
