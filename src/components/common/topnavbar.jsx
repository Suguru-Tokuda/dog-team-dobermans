import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import * as siteLogo from '../../assets/img/site_logo.PNG';
import ReactTooltip from 'react-tooltip';

class Topnavbar extends Component {

    constructor(props) {
        super(props);
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
                                    <NavLink className="nav-link" activeClassName="active" to="/contact">Contact / Request a Puppy</NavLink>
                                </li>
                            </ul>
                        </div>
                        <div className="right-col d-flex align-items-lg-center flex-column flex-lg-row">
                            <div className="user">
                                <a id="account" href="/puppy-requests">
                                    <i className="fab fa-facebook-messenger" style={{ fontSize: '25px', color: 'white'}} data-tip="Your Puppy Requests"></i>
                                    <ReactTooltip />
                                </a>
                            </div>
                            <div className="user ml-3">
                                <a id="account" href="/account" style={{ color: 'white' }}>
                                    <i className="fa fa-user" style={{ fontSize: '25px', color: 'white'}} data-tip="Account"></i>
                                    <ReactTooltip />
                                </a>
                            </div>
                            <div className="ml-3">
                                {(this.props.authenticated === false) && (
                                    <Link style={{ color: 'white' }} to="/account/login">Login</Link>
                                )}
                                {(this.props.authenticated === true) && (
                                    <a onClick={this.props.logout} style={{ color: 'white' }}>Logout</a>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}

const mapLoginStateToProps = state => ({
    authenticated: state.login
});

const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch({ type: 'SIGN_IN' }),
        logout: () => dispatch({ type: 'SIGN_OUT' })
    };
}

export default connect(mapLoginStateToProps, mapDispatchToProps)(Topnavbar);