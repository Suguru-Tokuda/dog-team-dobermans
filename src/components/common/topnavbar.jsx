import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import * as siteLogo from '../../assets/img/site_logo.PNG';
import ReactTooltip from 'react-tooltip';
import firebase from '../../services/firebaseService';

class Topnavbar extends Component {
    constructor(props) {
        super(props);
    }

    handleLogoutClicked = () => {
        this.props.showLoading({ reset: true, count: 1 });

        firebase.auth().signOut()
            .then(() => {
                this.props.logout();
                this.props.resetUser();
                this.props.resetRedirectURL();
            })
            .catch(() => {
                
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
            });
    }
    
    render() {
        return(
            <header className="header">
                <nav className="navbar navbar-expand-lg fixed-top">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/" style={{width: "179px"}}>
                            <img src={siteLogo} style={{ width: "100%", filter: "invert(90%)" }} alt={siteLogo}></img>
                        </Link>
                        <button type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation" className="navbar-toggler navbar-toggler-right"><i className="fa fa-bars"></i></button>
                        <div id="navbarCollapse" className="collapse navbar-collapse">
                            <ul className="navbar-nav mx-auto">
                                <li className="nav-item">
                                    <NavLink exact className="nav-link" activeClassName="active" to="/">Home</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" activeClassName="active" to="/about-dobermans">About Dobermans</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" activeClassName="active" to="/our-dogs">Our Dogs</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" activeClassName="active" to="/puppies">Puppies</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" activeClassName="active" to="/blog">Blog</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" activeClassName="active" to="/testimonials">Testimonials</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" activeClassName="active" to="/about-us">About us</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" activeClassName="active" to="/contact">Contact</NavLink>
                                </li>
                                {(this.props.authenticated === true) && (
                                    <li className="nav-item">
                                        <NavLink className="nav-link" activeClassName="active" to="/puppy-request">Request a Puppy</NavLink>
                                    </li>
                                )}
                                <li className="nav-item visible-xs">
                                    <NavLink className="nav-link" activeClassName="active" to="/puppy-requests">
                                        Puppy Requests
                                    </NavLink>
                                </li>
                                <li className="nav-item visible-xs">
                                    <NavLink className="nav-link" activeClassName="active" to="/sign-up">
                                        Sign Up
                                    </NavLink>
                                </li>
                                <li className="nav-item visible-xs">
                                    {(!this.props.authenticated) && (
                                        <NavLink className="nav-link" activeClassName="active" to="/login">
                                            Login
                                        </NavLink>
                                    )}
                                    {(this.props.authenticated) && (
                                        <a onClick={this.handleLogoutClicked} style={{ color: 'white', cursor: 'pointer' }}>
                                            LOG OUT
                                        </a>
                                    )}
                                    <NavLink className="nav-link" activeClassName="active" to="/puppy-request"></NavLink>
                                </li>
                            </ul>
                        </div>
                        <div className="right-col d-flex align-items-lg-center flex-column flex-lg-row hidden-xs">
                            {(this.props.authenticated === true) && (
                                <div className="user">
                                    <Link id="account" to="/puppy-requests">
                                        <i className="far fa-list-alt" style={{ fontSize: '25px', color: 'white'}} data-tip="Your Puppy Requests"></i>
                                        <ReactTooltip />
                                    </Link>
                                </div>
                            )}
                            {(this.props.authenticated === true) && (
                                <div className="user ml-3">
                                    <Link id="account" to="/account" style={{ color: 'white' }}>
                                        <i className="fa fa-user" style={{ fontSize: '25px', color: 'white'}} data-tip="Account"></i>
                                        <ReactTooltip />
                                    </Link>
                                </div>
                            )}
                            {(!this.props.authenticated) && (
                                <div className="user ml-3">
                                    <Link id="sign-up" to="/sign-up" style={{ color: 'white' }}>
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                            <div className="ml-3">
                                {(this.props.authenticated === false) && (
                                    <Link style={{ color: 'white' }} to="/login">Login</Link>
                                )}
                                {(this.props.authenticated === true) && (
                                    <a onClick={this.handleLogoutClicked} style={{ color: 'white', cursor: 'pointer' }}>Logout</a>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}

const mapStateToProps = state => ({
    authenticated: state.authenticated
});

const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch({ type: 'SIGN_IN' }),
        logout: () => dispatch({ type: 'SIGN_OUT' }),
        resetUser: () => dispatch({ type: 'RESET_USER' }),
        showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
        doneLoading: () => dispatch({ type: 'DONE_LOADING' }),
        resetRedirectURL: () => dispatch({ type: 'RESET_REDIRECT_URL' })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Topnavbar);