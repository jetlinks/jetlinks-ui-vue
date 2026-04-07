import './index.less';
import { Image } from 'ant-design-vue';
import { configImages } from '../../../../assets/notice/index';
import i18n from '@jetlinks-web-core/locales/index'
const $t = i18n.global.t
const AliyunSms = () => {
    const accessKey = configImages.AccesskeyIDSecret
    return (
        <div class={'doc'}>
            <div class={'url'}>
                {$t('doc.AliyunSms.7077011-0')}
                <a
                    href="https://home.console.aliyun.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://home.console.aliyun.com
                </a>
            </div>
            <h1>{$t('doc.AliyunSms.7077011-1')}</h1>
            <div>
                {$t('doc.AliyunSms.7077011-2')}
            </div>
            <h1>{$t('doc.AliyunSms.7077011-3')}</h1>
            <div>
                <h2>1、RegionID</h2>
                <div>
                    {$t('doc.AliyunSms.7077011-4')}
                </div>
                <div>
                    {$t('doc.AliyunSms.7077011-5')}
                </div>
            </div>
            <h2>2、AccesskeyID/Secret</h2>
            <div>
                <div>{$t('doc.AliyunSms.7077011-6')}</div>
                <div>
                    {$t('doc.AliyunSms.7077011-7')}
                </div>
                <div class={'image'}>
                    <Image width="100%" src={accessKey} />
                </div>
            </div>
        </div>
    );
};
export default AliyunSms;
