
import React, { Component } from 'react';
import SignUpForm from './signUpForm';
import * as siteLogo from '../../assets/img/site_logo.PNG';

class SignUp extends Component {
    state = {
        previousUrl: ''
    }

    constructor(props) {
        super(props);

        if (props.location.state && props.location.state.previousUrl)
            this.state.previousUrl = props.location.state.previousUrl;
    }

    render() {
        return (
            <React.Fragment>
                <section className="padding-small mt-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <img src={siteLogo} style={{ width: '100%' }} alt={siteLogo}></img>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <SignUpForm {...this.props} urlToRedirect={this.state.previousUrl} />
                            </div>    
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}

export default SignUp;