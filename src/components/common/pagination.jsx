import React, { Component } from 'react';
import PaginationService from '../../services/paginationService';

class Pagination extends Component {
    state = {
        totalItems: 0,
        currentPage: this.props.currentPage,
        maxPages: this.props.maxPages,
        pageSize: this.props.pageSize,
        paginationInfo: {
            totalItems: 0,
            currentPage: 0,
            pageSize: 0,
            totalPages: 0,
            endPage: 0,
            startIndex: 0,
            endIndex: 0,
            pages: 0
        }
    };

    constructor(props) {
        super(props);
        // calculate total pages
        this.state.totalPages = Math.ceil(this.state.totalItems / this.state.pageSize);
        this.state.totalItems = props.totalItems;
        const paginationInfo = PaginationService.getPaginationData(this.state.totalItems, props.currentPage, this.state.maxPages, this.state.pageSize);
        this.state.paginationInfo = paginationInfo;
        props.onPageChange(this.state.currentPage, paginationInfo.startIndex, paginationInfo.endIndex);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.pageSize !== prevState.pageSize || nextProps.totalItems !== prevState.totalItems) {
            const state = prevState;
            const paginationInfo = PaginationService.getPaginationData(nextProps.totalItems, 1, prevState.maxPages, nextProps.pageSize);
            state.paginationInfo = paginationInfo;
            if (nextProps.pageSize !== prevState.pageSize) {
                state.pageSize = nextProps.pageSize;
            }
            if (nextProps.totalItems !== prevState.totalItems) {
                state.totalItems = nextProps.totalItems;
            }
            nextProps.onPageChange(1, paginationInfo.startIndex, paginationInfo.endIndex);
            return state;
        } else if (prevState.currentPage !== nextProps.currentPage) {
            const totalItems = prevState.paginationInfo.totalItems;
            const paginationInfo = PaginationService.getPaginationData(totalItems, nextProps.currentPage, prevState.maxPages, prevState.pageSize);
            const state = prevState;
            state.currentPage = nextProps.currentPage;
            state.paginationInfo = paginationInfo;
            nextProps.onPageChange(nextProps.currentPage, paginationInfo.startIndex, paginationInfo.endIndex);
        } else {
            return null;
        }
    }

    handlePageChange = (clickedPage) => {
        if (clickedPage > 0 && clickedPage <= this.state.paginationInfo.totalPages) {
            if (clickedPage !== this.state.paginationInfo.currentPage) {
                const paginationInfo = PaginationService.getPaginationData(this.state.totalItems, clickedPage, this.state.maxPages, this.state.pageSize);
                this.setState({
                    currentPage: clickedPage,
                    paginationInfo: paginationInfo
                });
                this.props.onPageChange(clickedPage, paginationInfo.startIndex, paginationInfo.endIndex);
            }
        }
    }

    getPageItemClass = (page) => {
        return (this.state.currentPage === page ? ' active' : ' pointer');
    }

    getFirstBtnClass = () => {
        return (this.state.currentPage === 1 ? ' disabled' : ' pointer');
    }

    getLastBtnClass = () => {
        return (this.state.currentPage === this.state.paginationInfo.totalPages ? ' disabled' : ' pointer');
    }

    getPaginationStyle() {
        return {
            justifyContent: 'center'
        };
    }

    getPagination = () => {
        if (this.state.totalItems > 0) {
            const paginationItems = this.state.paginationInfo.pages.map(page => 
                <li key={page} className={'page-item' + this.getPageItemClass(page)} onClick={() => this.handlePageChange(page)}>
                    <button className="page-link">{page}</button>
                </li>
            );
            return (
                <nav aria-label="pagination">
                    <ul className="pagination pagination-sm justify-content-center">
                        <li className={"page-item" + this.getFirstBtnClass()} onClick={() => this.handlePageChange(1)}>
                            <button className="page-link" aria-label="First">First</button>
                        </li>
                        <li className={'page-item' + this.getFirstBtnClass()} onClick={() => this.handlePageChange(this.state.currentPage - 1)}>
                            <button className="page-link">
                                <span aria-hidden="true">«</span>
                                <span className="sr-only">Previous</span>
                            </button>
                        </li>
                        {paginationItems}
                        <li className={'page-item' + this.getLastBtnClass()} onClick={() => this.handlePageChange(this.state.currentPage + 1)}>
                            <button className="page-link">
                                <span aria-hidden="true">»</span>
                                <span className="sr-only">Next</span>
                            </button>
                        </li>
                        <li className={"page-item" + this.getLastBtnClass()} onClick={() => this.handlePageChange(this.state.paginationInfo.totalPages)}>
                            <button className="page-link">Last</button>
                        </li>
                    </ul>
                </nav>
            );
        } else {
            return null;
        }
    }

    render() {
        return (this.getPagination());
    }

}

export default Pagination;