import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../common/pagination';
import queryString from 'query-string';
import moment from 'moment';

class BlogsTable extends Component {
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
        this.state.tableData = props.blogs;
        this.state.filteredData = JSON.parse(JSON.stringify(props.blogs));
        this.state.paginationInfo.totalItems = props.blogs.length;
    }

    componentDidUpdate(props) {
        const { tableData, paginationInfo, updateDisplayedData } = this.state;
        if (JSON.stringify(props.blogs) !== JSON.stringify(tableData)) {
            paginationInfo.totalItems = props.tableData.length;
            this.setState({
                tableData: props.blogs,
                filteredData: JSON.parse(JSON.stringify(props.blogs)),
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
            const items = displayedData.map((blog, i) => {
                return (
                    <div key={`blog-${i}`} className="col-lg-6">
                        <div className="post post-gray d-flex align-items-center flex-md-row flex-column">
                            <div className="thumbnail d-flex-align-items-center justify-content-center">
                                <img src={blog.thumbnail.url} alt={blog.thumbnail.url} />
                            </div>
                            <div className="info">
                                <h4 className="h5">{blog.title}</h4>
                                <span className="date">
                                    <i className="fa fa-clock-o"></i>
                                    {moment(blog.created).format('MMM Do YYYY')}
                                </span>
                                <p>{blog.message}</p>
                                <Link className="read-more" to={`/blog/${blog.blogID}`}>
                                    Read More
                                    <i className="fa fa-long-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                );
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
            <section className="blog">
                <div className="container">
                    {this.getHeader()}
                    {this.getItems()}
                    {this.getPagination()}
                </div>
            </section>
        )
    }
}

export default BlogsTable;