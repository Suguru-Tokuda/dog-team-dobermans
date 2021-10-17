import utilService from './UtilService';
import * as moment from 'moment';

export default class SortService {
    static quickSort(array: any[], key: string, sortDescending: boolean) {
        const retVal = this.quickSortExecute(array, key, 0, array.length - 1, sortDescending);
        return retVal;
    }

    static quickSortExecute(array: any[], key: string, left: number, right: number, sortDescending: boolean) {
        if (left >= right)
            return array;

        const pivot = this.getValue(array, key, Math.floor((left + right) / 2));
        const index = this.partition(array, key, left, right, pivot, sortDescending);

        this.quickSortExecute(array, key, left, index - 1, sortDescending);
        this.quickSortExecute(array, key, index, right, sortDescending);
    }

    static getValue(array: any[], key: string, index: number) {
        let value = key ? utilService.accessValue(array[index], key) : array[index];
        const valueType = typeof value;

        switch (valueType) {
            case 'string':  
                // check if the string is date string
                const isDate = moment(value, moment.ISO_8601, true).isValid();

                if (isDate) {
                    const dateValue = new Date(value);
                    if (dateValue.toString() !== 'Invalid Date')
                        value = dateValue;
                } else {
                    value = value.toLowerCase();
                }
                break;
            case 'number':
                // check if the value is float
                if (isNaN(parseFloat(value)) === false) {
                    value = parseFloat(value);
                }
                break;
            case 'undefined':
                value = '';
                break;
            default:
                break;
        }

        return value;
    }

    static partition(array: any[], key: string, leftNumber: number, rightNumber: number, pivot: any, sortDescending: boolean): number {
        let left: number = leftNumber;
        let right: number = rightNumber;

        while (left <= right) {
            let leftVal: any = this.getValue(array, key, left);
            let rightVal: any = this.getValue(array, key, right);

            if (!sortDescending) {
                while (leftVal < pivot) {
                    left++;
                    leftVal = this.getValue(array, key, left);
                }

                while (rightVal > pivot) {
                    right--;
                    rightVal = this.getValue(array, key, right);
                }
            } else {
                while (leftVal > pivot) {
                    left++;
                    leftVal = this.getValue(array, key, left);
                }

                while (rightVal < pivot) {
                    right--;
                    rightVal = this.getValue(array, key, right);
                }
            }

            if (left <= right) {
                this.swap(array, left, right);
                left++;
                right--;
            }
        }

        return left;
    }

    static swap(array: any, left: number, right: number): void {
        const temp = array[left];
        array[left] = array[right];
        array[right] = temp;
    }
}