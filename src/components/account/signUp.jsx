import React, { Component } from 'react';
import firebase from 'firebase/app';
import { provider } from '../../services/firebaseService';
import { Redirect } from 'react-router-dom';
import userService from '../../services/userService';
import toastr from 'toastr';

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
                const res = await firebase.auth().createUserWithEmailAndPassword(email.trim().toLowerCase(), password);
                const currentUser = res.user;

                const createUserData = {
                    userID: currentUser.uid,
                    email: email.trim().toLowerCase(),
                    statusID: 1
                };

                await userService.createUser(createUserData);

                if (currentUser.sendEmailVerification) {
                    await currentUser.sendEmailVerification();
                    toastr.success('Verification email has been sent. Please check your email and click the link to continue.');
                }
            } catch (err) {
                if (err.message) {
                    toastr.error(err.message);
                } else {
                    toastr.error('Theere was an error in creating an account.');
                }
            }
        }
    }

    handleFaceBookSignIn = async () => {
        // TODO: check the device type
        const isDesktop = true;

        if (isDesktop === true) {
            try {
                const userInfo = await firebase.auth().signInWithPopup(provider);
                
                if (!userInfo.user.emailVerified) {
                    await userInfo.user.sendEmailVerification();
                    toastr.success('Verification email has been sent. Please check your email and click the link to continue.');
                }

                // check if there was a previousURL from props.
                if (this.props.urlToRedirect) {
                    return <Redirect to={this.props.urlToRedirect} />;
                } else {
                    // redirect to the main page
                    return <Redirect to="/" />;
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