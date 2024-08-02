// import './index.less';
import { Image } from 'ant-design-vue';
import { getImage } from '@/utils/comm';
import i18n from '@/i18n'
const $t = i18n.global.t

const DingTalkRebot = () => {
    const groupSetting = getImage(
        '/notice/doc/config/dingTalk-rebot/01-group-setting.jpg',
    );
    const rebot = getImage('/notice/doc/config/dingTalk-rebot/02-rebot.jpg');
    const webhook = getImage(
        '/notice/doc/config/dingTalk-rebot/03-Webhook.jpg',
    );

    return (
        <div class={'doc'}>
            <h1>{$t('doc.DingTalkRebot.737445-0')}</h1>
            <div>
                {$t('doc.DingTalkRebot.737445-1')}
            </div>
            <h1>{$t('doc.DingTalkRebot.737445-2')}</h1>
            <div>
                <h2> 1、WebHook</h2>
                <div>
                    {$t('doc.DingTalkRebot.737445-3')}
                </div>
                <div>
                    {$t('doc.DingTalkRebot.737445-4')}
                </div>
                <div class={'image'}>
                    <Image width="100%" src={rebot} />
                </div>
                <h2>{$t('doc.DingTalkRebot.737445-5')}</h2>
                <div class={'image'}>
                    <Image width="100%" src={groupSetting} />
                </div>
                <h2>{$t('doc.DingTalkRebot.737445-6')}</h2>
                <div class={'image'}>
                    <Image width="100%" src={webhook} />
                </div>
            </div>
        </div>
    );
};
export default DingTalkRebot;
