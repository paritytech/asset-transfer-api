export const normalizeAmounts = (amounts: (string | number)[]): string[] => {
    return amounts.map((amt) => {
        if (typeof amt === 'string') {
            return amt
        }

        if (typeof amt === 'number') {
            return amt.toString()
        }

        // Should never hit this, this exists to make the typescript compiler happy.
        return amt
    })
}
