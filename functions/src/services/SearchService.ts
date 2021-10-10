export default class SearchService {
    static binarySearch(arr: any[], targetValue: any, key: string): number {
        let target: any = targetValue;
        if (arr) {
            if (typeof target === 'string')
                target = target.toLowerCase();

            let left = 0;
            let right = arr.length - 1;

            while (left <= right) {
                const mid = Math.floor((left + right) / 2);
                let elementToCompare: any = null;

                if (key === null || key === undefined)
                    elementToCompare = arr[mid];
                else
                    elementToCompare = arr[mid][key];

                if (typeof elementToCompare === 'string')
                    elementToCompare = elementToCompare.toLowerCase();

                if (target === elementToCompare)
                    return mid;

                if (target < elementToCompare)
                    right = mid - 1;
                else
                    left = mid + 1;
            }
        }

        return -1;
    }

}