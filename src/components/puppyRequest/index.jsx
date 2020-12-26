import React, { Component } from 'react';
import PuppyRequestForm from './puppyRequeestForm';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class PuppyRequest extends Component {
    constructor(props) {
        super(props);
    }

    getHeader() {
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-1">
                            <h1>Puppy Request</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    Puppy Request
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    getLoginButton() {
        return (
            <section>
                <div className="container">
                    <header className="mb-5">
                        <h2 className="heading-line">Please login to create a puppy request.</h2>
                    </header>
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <Link className="btn btn-primary" 
                                  to={{
                                    pathname: '/login',
                                    state: {
                                        previousUrl: '/puppy-request'
                                    }
                                    }} 
                            >
                                Login
                            </Link>
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
                {(this.props.userChecked === true && this.props.authenticated === true) && (
                    <PuppyRequestForm {...this.props} />
                )} 
                {(this.props.userChecked === true && this.props.authenticated === false) && (
                    this.getLoginButton()
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    authenticated: state.authenticated,
    user: state.user,
    userChecked: state.userChecked
});

export default connect(mapStateToProps)(PuppyRequest);