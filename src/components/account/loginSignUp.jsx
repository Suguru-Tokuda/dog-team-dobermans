import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Login from './login';
import SignUp from './signUp';

class LoginSignUp extends Component {
    state = {
        previousUrl: ''
    }

    constructor(props) {
        super(props);

        console.log(this.props);

        if (props.location.state && props.location.state.previousUrl)
            this.state.previousUrl = props.location.state.previousUrl;
    }

    renderHeader = () => {
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-1">
                            <h1>Account</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to={"/"}>Home</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    Account
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    render() {
        return (
            <React.Fragment>
                {this.renderHeader()}
                <section className="padding-small">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <Login {...this.props} urlToRedirect={this.state.previousUrl} />
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <SignUp {...this.props} urlToRedirect={this.state.previousUrl} />
                            </div>    
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}

export default LoginSignUp;