import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as siteLogo from '../../assets/img/site_logo.PNG';

class Footer extends Component {
    render() {
        return (
            <footer className="main-footer">
                <div className="main-block">
                    <div className="container">
                        <div className="row">
                            <div className="info col-lg-4">
                                <div className="logo">
                                    <img src={siteLogo} style={{ width: "179px", filter: "invert(90%)" }} alt={siteLogo}></img>
                                </div>
                            </div>
                            <div className="site-links col-lg-2 col-md-6">
                                <h5 className="text-uppercase">Site Map</h5>
                                <ul className="list-unstyled">
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/about-dobermans">About Dobermans</Link></li>
                                    <li><Link to="/our-dogs">Our Dogs</Link></li>
                                    <li><Link to="/puppies">Puppies</Link></li>
                                    <li><Link to="/blog">Blog</Link></li>
                                    <li><Link to="/testimonials">Testimonials</Link></li>
                                    <li><Link to="/about-us">About Us</Link></li>
                                    <li><Link to="/contact">Contact</Link></li>
                                    {this.props.authenticated && (
                                        <React.Fragment>
                                            <li><Link to="/account">Account</Link></li>
                                            <li><Link to="/puppy-request">Request a Puppy</Link></li>
                                        </React.Fragment>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated,
    userChecked: state.userChecked,
    redirectURL: state.redirectURL
});

const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch({ type: 'SIGN_IN' }),
        setUser: (user) => dispatch({ type: 'SET_USER', user: user }),
        checkUser: () => dispatch({ type: 'USER_CHECKED' }),
        showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
        doneLoading: () => dispatch({ type: 'DONE_LOADING' }),
        resetRedirectURL: () => dispatch({ type: 'RESET_REDIRECT_URL' })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);