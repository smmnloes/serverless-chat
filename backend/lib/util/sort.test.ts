import {sortByStringDesc} from "./sort";

describe('Test the sorting function', () => {
    it('Should sort strings descendingly', () => {
        const toSort = ['b', 'd', 'c', 'a']
        expect(toSort.sort(sortByStringDesc)).toEqual(['d', 'c', 'b', 'a'])
    })
})