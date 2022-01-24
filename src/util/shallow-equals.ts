export const shallowEquals = (one: any[], two: any[]): boolean => {
    if (one.length !== two.length) return false;

    for (let i = 0; i < one.length; i++) {
        if (one[i] !== two[i]) return false;
    }

    return true;
};
