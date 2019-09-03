export default class PaginationService {
    static getPaginationData(totalItems, currentPage, maxPages, pageSize) {
        const totalPages = Math.ceil(totalItems / pageSize);
        let startPage, endPage;
        if (totalPages <= maxPages) {
            // less than maxPages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than maxPages so callculate start and end pages
            let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
            let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
            if (currentPage <= maxPagesBeforeCurrentPage) {
                startPage = 1;
                endPage = maxPages;
            } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
                startPage = totalPages - maxPages + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - maxPagesBeforeCurrentPage;
                endPage = currentPage + maxPagesAfterCurrentPage;
            }
        }

        // calculate start and end item indexes
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
        // create an array of pages to report
        const pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

        const retVal = {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
        return retVal;
    }
}