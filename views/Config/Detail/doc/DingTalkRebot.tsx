import './index.less';
import { Image } from 'ant-design-vue';
import { configImages } from '../../../../assets/notice/index';
import i18n from '@jetlinks-web-core/locales/index'
const $t = i18n.global.t
const DingTalkRebot = () => {
    const groupSetting = configImages.groupSetting
    const rebot = configImages.rebot;
    const webhook = configImages.Webhook;

    return (
        <div class={'doc'}>
            <h1>{$t('doc.DingTalkRebot.707708-0')}</h1>
            <div>
                {$t('doc.DingTalkRebot.707708-1')}
            </div>
            <h1>{$t('doc.DingTalkRebot.707708-2')}</h1>
            <div>
                <h2> 1、WebHook</h2>
                <div>
                    {$t('doc.DingTalkRebot.707708-3')}
                </div>
                <div>
                    {$t('doc.DingTalkRebot.707708-4')}
                </div>
                <div class={'image'}>
                    <Image width="100%" src={rebot} />
                </div>
                <h2>{$t('doc.DingTalkRebot.707708-5')}</h2>
                <div class={'image'}>
                    <Image width="100%" src={groupSetting} />
                </div>
                <h2>{$t('doc.DingTalkRebot.707708-6')}</h2>
                <div class={'image'}>
                    <Image width="100%" src={webhook} />
                </div>
            </div>
        </div>
    );
};
export default DingTalkRebot;
