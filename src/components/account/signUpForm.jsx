import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from '../../services/firebaseService';
import { provider } from '../../services/firebaseService';
import { Redirect } from 'react-router-dom';
import userService from '../../services/userService';
import utilService from '../../services/utilService';
import validationService from '../../services/validationService';
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
        let isValidPassowrd = validationService.validPassword(password, 8);
        let isValidEmail = validationService.validateEmail(email);

        if (email.length > 0 && isValidPassowrd && isValidEmail) {
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

    getEightCharacterLongClass() {
        const { password } = this.state;

        if (password.length >= 8) {
            return 'text-success';
        } else {
            return '';
        }
    }

    getUpperCaseLowerCaseLettersClass() {
        const { password } = this.state;
        const upperCaseRegex = /[A-Z]/g;
        const lowerCaseRegex = /[a-z]/g;

        if (upperCaseRegex.test(password) && lowerCaseRegex.test(password))
            return 'text-success';
        else
            return '';
    }

    getSpecialCharacterClass() {
        const { password } = this.state;
        const specialCharacterRegex = /[!@#?\]\-]/g;

        if (specialCharacterRegex.test(password))
            return 'text-success'
        else
            return '';
    }

    handleFaceBookSignIn = async () => {
        const isDesktop = utilService.isMobile();

        if (isDesktop === false) {
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
                        <h5>Create a New Account</h5>
                    </div>
                    <div className="block-body">
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
                                <p>Password rules:</p>
                                <ul style={{ color: 'gray' }}>
                                    <li className={this.getEightCharacterLongClass()}>At least 8 characters.</li>
                                    <li className={this.getUpperCaseLowerCaseLettersClass()}>A mixture of both uppercase and lowercase letters.</li>
                                    <li className={this.getSpecialCharacterClass()}>Inclusion of at least one special character, e.g., ! @ # ? ] -</li>
                                </ul>
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
                            <div className="form-group mt-3">
                                <p>Already a member? Click <Link to="/login">here</Link> to log in.</p>
                            </div>
                        </form>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default BreefSignUp;