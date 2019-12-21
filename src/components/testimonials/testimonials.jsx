import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TestimonialList from './testimonialList';
import TestimonialForm from './testimonialForm';

class Testimonials extends Component {
    constructor(props) {
        super(props);
    }

    getHeader() {
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-1">
                            <h1>Testimonials</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    Testimonials
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.getHeader()}
                <div className="container">
                    <TestimonialList {...this.props} />
                    <TestimonialForm {...this.props} />
                </div>
            </React.Fragment>
        )
    }
}

export default Testimonials;