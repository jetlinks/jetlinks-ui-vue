// import './index.less';
import i18n from '@/i18n'
const $t = i18n.global.t

const AliyunSms = () => {
    return (
        <div class="doc">
            <div class="url">
                {$t('doc.AliyunSms.214689-0')}
                <a
                    href="https://dysms.console.aliyun.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://dysms.console.aliyun.com
                </a>
            </div>
            <h1>{$t('doc.AliyunSms.214689-1')}</h1>
            <div>
                {$t('doc.AliyunSms.214689-2')}
            </div>
            <h1>{$t('doc.AliyunSms.214689-3')}</h1>

            <div>
                <h2> {$t('doc.AliyunSms.214689-4')}</h2>
                <div> {$t('doc.AliyunSms.214689-5')}</div>
                <h2> {$t('doc.AliyunSms.214689-6')}</h2>
                <div> {$t('doc.AliyunSms.214689-7')}</div>
                <h2> {$t('doc.AliyunSms.214689-8')}</h2>
                <div>
                    {' '}
                    {$t('doc.AliyunSms.214689-9')}
                </div>
                <h2> {$t('doc.AliyunSms.214689-10')}</h2>
                <div> {$t('doc.AliyunSms.214689-11')}</div>
                <h2> {$t('doc.AliyunSms.214689-12')}</h2>
                <div>
                    {$t('doc.AliyunSms.214689-13')}
                </div>
            </div>
        </div>
    );
};
export default AliyunSms;
