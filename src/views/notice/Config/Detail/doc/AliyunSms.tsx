// import './index.less';
import { Image } from 'jetlinks-ui-components';
import { getImage } from '@/utils/comm';
import i18n from '@/i18n'
const $t = i18n.global.t

const AliyunSms = () => {
    const accessKey = getImage(
        '/notice/doc/config/aliyun-sms-voice/AccesskeyIDSecret.jpg',
    );
    return (
        <div class={'doc'}>
            <div class={'url'}>
                {$t('doc.AliyunSms.737449-0')}
                <a
                    href="https://home.console.aliyun.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://home.console.aliyun.com
                </a>
            </div>
            <h1>{$t('doc.AliyunSms.737449-1')}</h1>
            <div>
                {$t('doc.AliyunSms.737449-2')}
            </div>
            <h1>{$t('doc.AliyunSms.737449-3')}</h1>
            <div>
                <h2>1、RegionID</h2>
                <div>
                    {$t('doc.AliyunSms.737449-4')}
                </div>
                <div>
                    {$t('doc.AliyunSms.737449-5')}
                </div>
            </div>
            <h2>2、AccesskeyID/Secret</h2>
            <div>
                <div>{$t('doc.AliyunSms.737449-6')}</div>
                <div>
                    {$t('doc.AliyunSms.737449-7')}
                </div>
                <div class={'image'}>
                    <Image width="100%" src={accessKey} />
                </div>
            </div>
        </div>
    );
};
export default AliyunSms;
