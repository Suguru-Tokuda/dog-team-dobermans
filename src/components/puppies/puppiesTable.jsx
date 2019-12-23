import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../common/pagination';
import queryString from 'query-string';

class PuppiesTable extends Component {
    state = {
        tableData: [],
        filteredData: [],
        displayedData: [],
        paginationInfo: {
            currentPage: 1,
            startIndex: 0,
            endIndex: 0,
            maxPages: 5,
            pageSize: 25,
            totalItems: 0
        },
        gridSearch: '',
        pageSizes: [10, 25, 50],
        updateDisplayedData: false
    };

    constructor(props) {
        super(props);
        if (props.location.search !== undefined) {
            const params = queryString.parse(props.location.search);
            if (!isNaN(params.page)) {
                this.state.paginationInfo.currentPage = parseInt(params.page);
            }
        }
        this.state.tableData = props.puppies;
        this.state.filteredData = JSON.parse(JSON.stringify(props.puppies));
        this.state.paginationInfo.totalItems = props.puppies.length;
    }

    componentDidUpdate(props) {
        const { tableData, paginationInfo, updateDisplayedData } = this.state;
        if (JSON.stringify(props.puppies) !== JSON.stringify(tableData)) {
            paginationInfo.totalItems = props.tableData.length;
            this.setState({
                tableData: props.puppies,
                filteredData: JSON.parse(JSON.stringify(props.puppies)),
                paginationInfo: paginationInfo,
                updateDisplayedData: true
            });
        }
        if (updateDisplayedData === true) {
            this.setState({ updateDisplayedData: false });
            this.updateDisplayedData(paginationInfo.currentPage, paginationInfo.startIndex, paginationInfo.endIndex);
        }
    }

    updateDisplayedData = (currentPage, startIndex, endIndex) => {
        let displayedData;
        if (startIndex !== endIndex) {
            displayedData = this.state.filteredData.slice(startIndex, endIndex + 1);
        } else {
            displayedData = this.state.filteredData.slice(startIndex, startIndex + 1);
        }
        const { paginationInfo } = this.state;
        paginationInfo.currentPage = currentPage;
        paginationInfo.startIndex = startIndex;
        paginationInfo.endIndex = endIndex;
        this.updateURL(currentPage);
        this.setState({ paginationInfo, displayedData });
    }

    updateURL(currentPage) {
        const pathname = this.props.location.pathname;
        const url = `${pathname}?page=${currentPage}`;
        this.props.history.push(url);
    }

    getHeader() {
        const { paginationInfo } = this.state;
        return (
            <header className="d-flex justify-content-between align-items-start">
                <span className="visible-items">
                    {`Showing `}
                    <strong>{`${paginationInfo.startIndex + 1}-${paginationInfo.endIndex + 1}`}</strong>
                    {` of `}
                    <strong>{`${paginationInfo.totalItems}`}</strong>
                </span>
            </header>
        );
    }

    getPagination() {
        const { tableData, paginationInfo } = this.state;
        if (tableData.length > 0) {
            return <Pagination
                    onPageChange={this.updateDisplayedData.bind(this)}
                    currentPage={paginationInfo.currentPage}
                    totalItems={paginationInfo.totalItems}
                    maxPages={paginationInfo.maxPages}
                    pageSize={paginationInfo.pageSize}
                    />;
        }
    }

    getItems() {
        const { displayedData } = this.state;
        if (displayedData.length > 0) {
            const items = displayedData.map((puppy, i) => {
                return (
                    <div key={`puppy-${i}`} className="item col-xl-4 col-md-6">
                        <div className="product is-gray">
                            <div className="image d-flex align-items-center justify-content-center">
                                {puppy.sold === true && ( 
                                    <div className="ribbon ribbon-danger text-uppercase">Sold</div>
                                )}
                                <img src={puppy.pictures[0].url} alt={puppy.pictures[0].reference} className="img-fluid" />
                                <div className="hover-overlay d-flex align-items-center justify-content-center">
                                    <Link className="visit-product active" to={`/puppies/${puppy.puppyID}`}><i className="icon-search"></i>View</Link>
                                </div>
                            </div>
                            <div className="title">
                                <Link to={`/puppies/${puppy.puppyID}`}>
                                    <h3 className="h6 text-uppercase no-margin-bottom">{puppy.name}</h3>
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            });
            return (
                <div className="row">
                    {items}
                </div>
            )
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className="products-grid col-xl-9 col-lg-8 sidebar-left">
                {this.getHeader()}
                {this.getItems()}
                {this.getPagination()}
            </div>
        )
    }
}

export default PuppiesTable;