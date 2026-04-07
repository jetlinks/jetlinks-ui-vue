import './index.less';
import i18n from '@jetlinks-web-core/locales/index'
const $t = i18n.global.t
const AliyunSms = () => {
    return (
        <div class="doc">
            <div class="url">
                {$t('doc.AliyunSms.6401010-0')}
                <a
                    href="https://dysms.console.aliyun.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://dysms.console.aliyun.com
                </a>
            </div>
            <h1>{$t('doc.AliyunSms.6401010-1')}</h1>
            <div>
                {$t('doc.AliyunSms.6401010-2')}
                {$t('doc.AliyunSms.6401010-3')}
            </div>
            <h1>{$t('doc.AliyunSms.6401010-4')}</h1>

            <div>
                <h2> {$t('doc.AliyunSms.6401010-5')}</h2>
                <div> {$t('doc.AliyunSms.6401010-6')}</div>
                <h2> {$t('doc.AliyunSms.6401010-7')}</h2>
                <div> {$t('doc.AliyunSms.6401010-8')}</div>
                <h2> {$t('doc.AliyunSms.6401010-9')}</h2>
                <div>
                    {' '}
                    {$t('doc.AliyunSms.6401010-10')}
                </div>
                <h2> {$t('doc.AliyunSms.6401010-11')}</h2>
                <div> {$t('doc.AliyunSms.6401010-12')}</div>
                <h2> {$t('doc.AliyunSms.6401010-13')}</h2>
                <div>
                    {$t('doc.AliyunSms.6401010-14')}
                </div>
            </div>
        </div>
    );
};
export default AliyunSms;
