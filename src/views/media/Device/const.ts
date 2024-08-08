import i18n from '@/i18n'
const $t = i18n.global.t
export const PROVIDER_OPTIONS = [
    { label: 'GB/T28181', value: 'gb28181-2016' },
    { label: $t('Device.const.117442-0'), value: 'fixed-media' },
    { label: 'Onvif', value: 'onvif'},
    { label: $t('Device.const.117442-1'), value: 'media-plugin'}
]
export const streamMode = [
    { label: 'UDP', value: 'UDP' },
    { label: $t('Device.const.117442-2'), value: 'TCP_PASSIVE' },
]

export const providerType = {
    'gb28181-2016': 'GB/T28181',
    'fixed-media': $t('Device.const.117442-0'),
    'onvif': 'Onvif',
    'media-plugin': $t('Device.const.117442-1')
};