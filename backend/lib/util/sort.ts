export const sortByStringDesc = (a: string, b: string) => {
    return a < b ? 1 : a > b ? -1 : 0
}

export const sortByStringAsc = (a: string, b: string) => {
    return a < b ? -1 : a > b ? 1 : 0
}