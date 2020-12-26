import React, { Component } from 'react';
import { connect } from 'react-redux';
import TestimonialsTable from './testimonialsTable';
import TestimonialService from '../../services/testimonialService';
import toastr from 'toastr';

class TestimonialsList extends Component {
    state = {
        testimonials: []
    };

    componentDidMount() {
        this.props.showLoading({ reset: true, count: 1 });
        TestimonialService.getTestimonials()
            .then(res => {
                this.setState({ testimonials: res.data });
            })
            .catch(err => {
                console.log(err);
                toastr.error('There was an error in loading testionials data');
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
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

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated,
    loadCount: state.loadCount,
    userChecked: state.userChecked,
    redirectURL: state.redirectURL
  });
  
  const mapDispatchToProps = dispatch => {
    return {
      login: () => dispatch({ type: 'SIGN_IN' }),
      logout: () => dispatch({ type: 'SIGN_OUT' }),
      checkUser: () => dispatch({ type: 'USER_CHECKED' }),
      setUser: (user) => dispatch({ type: 'SET_USER', user: user }),
      getUser: () => dispatch({ type: 'GET_USER' }),
      showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
      doneLoading: () => dispatch({ type: 'DONE_LOADING' }),
      resetRedirectURL: () => dispatch({ type: 'RESET_REDIRECT_URL' })
    };
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(TestimonialsList);