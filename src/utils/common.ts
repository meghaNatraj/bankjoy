//Contains common utility methods

export const getAverage = (numbers: number[]) => {
    let sum = numbers.reduce((a, b) => a + b, 0);
    return sum / numbers.length;
};
