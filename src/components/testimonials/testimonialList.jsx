import React, { Component } from 'react';
import TestimonialsTable from './testimonialsTable';
import TestimonialService from '../../services/testimonialService';
import toastr from 'toastr';

class TestimonialsList extends Component {
    state = {
        testimonials: []
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        TestimonialService.getTestimonials()
            .then(res => {
                this.setState({ testimonials: res.data });
            })
            .catch(err => {
                console.log(err);
                toastr.error('There was an error in loading testionials data');
            });
    }

    getTestimonialList() {
        const { testimonials } = this.state;
        if (testimonials.length > 0) {
            return <TestimonialsTable {...this.props} testimonials={testimonials} />;
        } else {
            return <div style={{marginTop: "500px"}}></div>;
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.getTestimonialList()}
            </React.Fragment>
        );
    }
}

export default TestimonialsList;