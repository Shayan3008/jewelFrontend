export const rateChange = (rate) => ({
    type: actionNames.changeInRate,
    rate: rate
});


export const actionNames = {
    changeInRate: 'RATE_CHANGE'
}