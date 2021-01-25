import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../../services/firebaseService';
import firebaseCustomActions from '../../services/firebaseCustomActions';
import { provider } from '../../services/firebaseService';
import userService from '../../services/userService';
import utilService from '../../services/utilService';
import validationService from '../../services/validationService';
import toastr from 'toastr';

class SignUpForm extends Component {

    state = {
        email: '',
        password: ''
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.setState({
            email: '',
            password: '' 
        });
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
        let isValidPassword = validationService.validPassword(password, 8);
        let isValidEmail = validationService.validateEmail(email);

        if (email.length > 0 && isValidPassword && isValidEmail) {
            try {
                const res = await firebase.auth().createUserWithEmailAndPassword(email.trim().toLowerCase(), password);
                const currentUser = res.user;

                const createUserData = {
                    userID: currentUser.uid,
                    email: email.trim().toLowerCase(),
                    userType: res.user.providerData[0].providerId,
                    statusID: 1,
                    createDate: new Date().toISOString(),
                };

                await userService.createUser(createUserData);

                if (currentUser.sendEmailVerification) {
                    const options = firebaseCustomActions.getCustomActionParameters();

                    await currentUser.sendEmailVerification(options);
                    toastr.success('Verification email has been sent. Please check your email and click the link to continue.', 'Registration Success', { timeOut: 10000 });
                }

                this.setState({
                    email: '',
                    password: ''
                });

                const userData = createUserData;
                userData.currentUser = currentUser;
    
                this.props.setUser(userData);
                this.props.login();

                this.props.onRegistrationCompleted('/email-verification');
            } catch (err) {
                if (err.message) {
                    toastr.error(err.message);
                } else {
                    toastr.error('There was an error in creating an account.');
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
        const specialCharacterRegex = /[!@#$?\-]/g;

        if (specialCharacterRegex.test(password))
            return 'text-success'
        else
            return '';
    }

    handleFaceBookSignIn = async () => {
        const isDesktop = utilService.isMobile();
        this.props.turnOnLoginStatusCheck();

        try {
            let userInfo;
            if (isDesktop === false) {
                userInfo = await firebase.auth().signInWithPopup(provider);
            } else {
                userInfo = await firebase.auth().signInWithRedirect(provider);
            }

            const { user, additionalUserInfo } = userInfo;

            const createUserData = {
                userID: user.uid,
                firstName: additionalUserInfo.profile.first_name,
                lastName: additionalUserInfo.profile.last_name,
                email: user.email,
                userType: user.providerData[0].providerId,
                createDate: new Date().toISOString(),
                statusID: 1
            };

            await userService.createUser(createUserData);

            if (!userInfo.user.emailVerified) {
                const options = firebaseCustomActions.getCustomActionParameters();

                await userInfo.user.sendEmailVerification(options);
                toastr.success('Verification email has been sent. Please check your email and click the link to continue.', 'Registration Success', { timeOut: 10000 });
            }

            const userData = createUserData;
            userData.currentUser = user;

            this.props.setUser(userData);
            this.props.login();

            // check if there was a previousURL from props.
            if (this.props.urlToRedirect && userInfo.emailVerified) {
                this.props.onRegistrationCompleted(this.props.urlToRedirect);
            } else {
                // redirect to the main page
                this.props.onRegistrationCompleted('/email-verification');
            }
        } catch (err) {
            if (err.message) {
                toastr.error(err.message);
            } else {
                toastr.error('There was an error with Facebook sign up. Please try again.');
            }
            
            this.props.turnOnLoginStatusCheck();
        }
    }

    render() {
        const { email, password } = this.state;

        return (
            <React.Fragment>
                <div className="block">
                    <div className="block-body">
                        <form>
                            <div className="form-group">
                                With a Dog Team Doberman registration, you can directly communicate with the breeder.
                            </div>
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
                                    <li className={this.getUpperCaseLowerCaseLettersClass()}>Must have at least one uppercase and one lowercase character.</li>
                                    <li className={this.getSpecialCharacterClass()}>Must have at least one special character: ! @ # $ ? -</li>
                                </ul>
                            </div>
                            <div className="from-group text-center">
                                <div className="row">
                                    <div className="col-12">
                                        <button type="button" 
                                                className="btn btn-primary" 
                                                onClick={this.handleRegularSignUp}
                                                style={{ width: '100%' }}
                                        >
                                            <i className="fas fa-user-alt"></i>
                                            Sign Up
                                        </button>                                        
                                    </div>
                                    <div className="col-12">
                                        OR
                                    </div>
                                    <div className="col-12">
                                        <button type="button" 
                                                className="btn btn-facebook"
                                                onClick={this.handleFaceBookSignIn}
                                                style={{ width: '100%' }}
                                        >
                                            <i className="fab fa-facebook-f"></i>
                                            Sign up with Facebook
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated,
    userChecked: state.userChecked,
    redirectURL: state.redirectURL,
    loginStatusCheck: state.loginStatusCheck
});

const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch({ type: 'SIGN_IN' }),
        setUser: (user) => dispatch({ type: 'SET_USER', user: user }),
        checkUser: () => dispatch({ type: 'USER_CHECKED' }),
        showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
        doneLoading: () => dispatch({ type: 'DONE_LOADING' }),
        resetRedirectURL: () => dispatch({ type: 'RESET_REDIRECT_URL' }),
        turnOnLoginStatusCheck: () => dispatch({ type: 'TURN_ON_LOGIN_CHECK' }),
        turnOffLoginStatusCheck: () => dispatch({ type: 'TURN_OFF_LOGIN_CHECK' })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);