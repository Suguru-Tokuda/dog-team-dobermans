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

    static getInsertIndex(arr: any[], targetValue: any, key: string): number {
        let left: number = 0;

        if (arr !== undefined) {
            let target = targetValue;
            if (typeof target === 'string')
                target = target.toLowerCase();

            let right: number = arr.length - 1;

            while (left <= right) {
                const mid = Math.floor((left + right) / 2);
                let elementToCompare: any = null;

                if (!key)
                    elementToCompare = arr[mid];
                else
                    elementToCompare = arr[mid][key];

                if (typeof elementToCompare === 'string')
                    elementToCompare = elementToCompare.toLowerCase();

                if (target < elementToCompare)
                    right = mid - 1;
                else if (targetValue > elementToCompare)
                    left = mid + 1;
                else
                    return mid;
            }
        } else {
            left = -1;
        }

        return left;
    }

}