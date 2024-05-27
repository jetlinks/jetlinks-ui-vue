const data = [
    {
        cardId: '1234567890abcdef',
        iccId: '0987654321fedcba',
        factoryNumber: 'QYCD25-QCG',
        platformConfigName: '移动OneLink',
        operatorName: '移动',
        cardType: 'year',
        totalFlow: 10000,
        usedFlow: 5000,
        residualFlow: 5000,
        activationDate: 1642374000, // Unix timestamp for Jan 1, 2022
        updateTime: 1642374000, // Same as activation date for this example
        cardStateType: {
            label: '激活',
            value: 'activated',
        },
    },
];

export const handleQuery = () => {
    return new Promise((resolve, reject) => {
        resolve({
            message: 'success',
            result: {
                pageIndex: 0,
                pageSize: 12,
                total: 1,
                data,
            },
            status: 200,
            timestamp: 1716791494975,
        });
    });
};
