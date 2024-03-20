export const PROVIDER_OPTIONS = [
    { label: 'GB/T28181', value: 'gb28181-2016' },
    { label: '固定地址', value: 'fixed-media' },
    { label: 'Onvif', value: 'onvif'}
]
export const streamMode = [
    { label: 'UDP', value: 'UDP' },
    { label: 'TCP被动', value: 'TCP_PASSIVE' },
]

export const providerType = {
    'gb28181-2016': 'GB/T28181',
    'fixed-media': '固定地址',
    'onvif': 'Onvif'
};