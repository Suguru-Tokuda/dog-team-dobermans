import React, { Component } from 'react';
import Pagination from '../common/pagination';
import queryString from 'query-string';
import moment from 'moment';

class TestimonialsTable extends Component {
    state = {
        tableData: [],
        filteredData: [],
        displayedData: [],
        paginationInfo: {
            currentPage: 1,
            startIndex: 0,
            endIndex: 0,
            maxPages: 5,
            pageSize: 5,
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
        this.state.tableData = props.testimonials;
        this.state.filteredData = JSON.parse(JSON.stringify(props.testimonials));
        this.state.paginationInfo.totalItems = props.testimonials.length;
    }

    componentDidUpdate(props) {
        const { tableData, paginationInfo, updateDisplayedData } = this.state;
        if (JSON.stringify(props.testimonials) !== JSON.stringify(tableData)) {
            paginationInfo.totalItems = props.tableData.length;
            this.setState({
                tableData: props.testimonials,
                filteredData: JSON.parse(JSON.stringify(props.testimonials)),
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

    getTestimonials() {
        const { displayedData } = this.state;
        if (displayedData.length > 0) {
            return displayedData.map((testimonial, i) => {
                return (
                    <div className="row review" key={`testimonial-${i}`}>
                        <div className="col-3 text-center">
                            {typeof testimonial.picture !== 'undefined' && testimonial.picture !== null (
                                <img src={testimonial.picture.url} alt={testimonial.picture.reference} className="review-image" />
                            )}
                            <span>{moment(testimonial.created).format('MMM YYYY').toUpperCase()}</span>
                        </div>
                        <div className="col-9 review-text">
                            <h6>{`${testimonial.firstName} & ${testimonial.dogName}`}</h6>
                            <p className="text-muted text-small">{testimonial.message}</p>
                        </div>
                    </div>
                )
            });
        } else {
            return null;
        }
    }

    render() {
        return (
            <section className="product-description">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="block">
                            <div className="block-header">
                                <h6>Submitted Testimonials</h6>
                            </div>
                        </div>
                        {this.getTestimonials()}
                        {this.getPagination()}
                    </div>
                </div>
            </section>
        );
    }

}

export default TestimonialsTable;