import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../common/pagination';

class ParentsTable extends Component {
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
        this.state.tableData = props.parents;
        this.state.filteredData = JSON.parse(JSON.stringify(props.parents));
        this.state.paginationInfo.totalItems = props.parents.length;
    }

    componentDidUpdate(props) {
        const { tableData, paginationInfo, updateDisplayedData } = this.state;
        if (JSON.stringify(props.parents) !== JSON.stringify(tableData)) {
            paginationInfo.totalItems = props.tableData.length;
            this.setState({
                tableData: props.parents,
                filteredData: JSON.parse(JSON.stringify(props.parents)),
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
        this.setState({ paginationInfo, displayedData });
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
            const items = displayedData.map((parent, i) => {
                return (
                    <div key={`parent-${i}`} className="item col-xl-4 col-md-6">
                        <div className="product is-gray">
                            <div className="image d-flex align-items-center justify-content-center">
                                <img src={parent.pictures[0].url} alt={parent.pictures[0].reference} className="img-fluid" />
                                <div className="hover-overlay d-flex align-items-center justify-content-center">
                                    <Link className="visit-product active" to={`/our-dogs/${parent.parentID}`}><i className="icon-search"></i>View</Link>
                                </div>
                            </div>
                            <div className="title">
                                <Link to={`/our-dogs/${parent.parentID}`}>
                                    <h3 className="h6 text-uppercase no-margin-bottom">{parent.name}</h3>
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
                {this.getItems()}
                {this.getPagination()}
            </div>
        )
    }
}

export default ParentsTable;