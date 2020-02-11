import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TestimonialList from './testimonialList';
import TestimonialForm from './testimonialForm';
import $ from 'jquery';

class Testimonials extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    
    getHeader() {
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-1">
                            <h1>Testimonials</h1>
                            <p className="lead text-muted">Testimonials from puppy owners are below. For current owners who would like to submit their own testimonial, please <a style={{color: 'purple', cursor: 'pointer'}} onClick={this.handleScrollToTestimonialForm}>click here.</a></p>
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

    handleScrollToTestimonialForm = () => {
        $(document).ready(() => {
            $('html, body').animate({
                scrollTop: $('#testimonialForm').offset().top
            }, 1000)
        });
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