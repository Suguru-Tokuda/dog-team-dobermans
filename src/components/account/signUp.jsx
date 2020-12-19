import React, { Component } from 'react';
import firebase from 'firebase/app';
import { provider } from '../../services/firebaseService';
import { Redirect } from 'react-router-dom';

class BreefSignUp extends Component {

    state = {
        email: '',
        password: ''
    };

    constructor(props) {
        super(props);
    }

    handleEmailChanged = (e) => {
        this.setState({
            email: e.target.value
        });
    }

    handlePasswordChanged = (e) => {
        this.setState({
            password: e.target.value
        });
    }

    handleRegularSignUp = async () => {
        const { email, password } = this.state;

        if (email && email.length > 0 && password && password.length) {
            try {
                const res = await firebase.auth().createUserWithEmailAndPassword(email, password);

                const currentUser = firebase.auth().currentUser;

                if (currentUser.sendEmailVerification) {
                    currentUser.sendEmailVerification()
                        .then(res => {
                            console.log(res);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    handleFaceBookSignIn = async () => {
        // TODO: check the device type
        const isDesktop = true;

        if (isDesktop === true) {
            try {
                const userInfo = await firebase.auth().signInWithPopup(provider);

                if (userInfo.additionalUserInfo.isNewUser === true) {

                } else {
                    // check if there was a previousURL from props.
                    if (this.props.urlToRedirect) {
                        return <Redirect to={this.props.urlToRedirect} />;
                    } else {
                        // redirect to the main page
                        return <Redirect to="/" />;
                    }
                }

            } catch (err) {
                console.log(err);
            }
        }
    }

    render() {
        const { email, password } = this.state;

        return (
            <React.Fragment>
                <div className="block">
                    <div className="block-header">
                        <h5>New Account</h5>
                    </div>
                    <div className="block-body">
                        <p className="leader">Not a Doberman Member yet?</p>
                        <form>
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input 
                                    id="email" 
                                    type="email" 
                                    className="form-control" 
                                    value={email}
                                    onChange={this.handleEmailChanged}
                                    autoComplete="off"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input 
                                    id="password" 
                                    type="password" 
                                    className="form-control" 
                                    value={password}
                                    onChange={this.handlePasswordChanged}
                                    autoComplete="off"
                                />
                            </div>
                            <div className="from-group text-center">
                                <button type="button" className="btn btn-primary" onClick={this.handleRegularSignUp}>
                                    <i className="fas fa-user-alt"></i>
                                    Sign Up
                                    </button>
                                <span className="ml-2 mr-2">or</span>
                                <button 
                                    type="button" 
                                    className="btn btn-facebook"
                                    onClick={this.handleFaceBookSignIn}
                                >
                                    <i className="fab fa-facebook-f"></i>
                                    Sign up with Facebook</button>
                            </div>
                        </form>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default BreefSignUp;