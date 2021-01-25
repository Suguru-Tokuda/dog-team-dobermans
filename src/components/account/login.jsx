import React, { Component } from 'react';
import LoginForm from './loginForm';
import * as siteLogo from '../../assets/img/site_logo.PNG';

class Login extends Component {
    state = {
        previousUrl: '',
        alertMessage: ''
    }

    constructor(props) {
        super(props);

        if (props.location && props.location.state && props.location.state.message) {
            this.state.alertMessage = props.location.state.message;
        }

        if (props.location.state && props.location.state.previousUrl)
            this.state.previousUrl = props.location.state.previousUrl;
    }

    render() {
        return (
            <React.Fragment>
                <section className="padding-small mt-5">
                    <div className="container">
                        {this.state.alertMessage && (
                            <div className="alert alert-warning" role="alert">
                                { this.state.alertMessage }
                            </div>
                        )}
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <img src={siteLogo} style={{ width: '100%' }} alt={siteLogo}></img>
                                <p style={{ marginTop: '5px' }}>Homeland Security Family Friend</p>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 mt-xs-2">
                                <LoginForm {...this.props} urlToRedirect={this.state.previousUrl} />
                            </div>    
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}

export default Login;