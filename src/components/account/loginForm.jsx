import React, { Component } from 'react';
import SignUpModal from './signUpModal';
import firebase from '../../services/firebaseService';
import firebaseCustomActions from'../../services/firebaseCustomActions';
import { provider } from '../../services/firebaseService';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import userService from '../../services/userService';
import utilService from '../../services/utilService';
import toastr from 'toastr';
import $ from 'jquery';

class LoginForm extends Component {
    state = {
        email: '',
        password: '',
        showForm: false,
        hasRedirected: false
    };

    constructor(props) {
        super(props);

        firebase.auth().onAuthStateChanged(async (user) => {
            if (user && this.props.loginStatusCheck) {                
              this.props.showLoading({reset: false, count: 1 });
      
              try {
                const res = await userService.getUser(user.uid);
                const userData = res.data;
          
                const { buyerID, firstName, lastName, phone, email, city, state, statusID, registrationCompleted } = userData;
                const { emailVerified } = user;

                if (user.providerData[0].providerId === 'password') {
                    if (user.email.toLowerCase() !== email.toLowerCase()) {
                        const userUpdateData = {
                            userID: user.uid,
                            email: user.email.toLowerCase()
                        };
    
                        await userService.editUser(userUpdateData);
                    }
                }

                let currentUser;

                if (this.props.user) {
                    const sessionUser = this.props.user;

                    sessionUser.userID = buyerID;
                    sessionUser.firstName = firstName;
                    sessionUser.lastName = lastName;
                    sessionUser.email = user.email;
                    sessionUser.phone = phone;
                    sessionUser.city = city;
                    sessionUser.state = state;
                    sessionUser.statusID = statusID;
                    sessionUser.currentUser = user;
                    sessionUser.emailVerified = emailVerified;
                    sessionUser.registrationCompleted = registrationCompleted;

                    currentUser = sessionUser;
                } else {
                    currentUser = {
                        userID: buyerID,
                        firstName: firstName,
                        lastName: lastName,
                        email: user.email,
                        phone: phone,
                        city: city,
                        state: state,
                        statusID: statusID,
                        currentUser: user,
                        emailVerified: emailVerified,
                        registrationCompleted: registrationCompleted
                    };
                }
                
                this.props.setUser(currentUser);
                this.props.checkUser();          
                this.props.login();

                if (this.props.redirectURL && !currentUser.recentAuthenticationRequired) {
                  this.props.history.push(this.props.redirectURL);
                  this.props.resetRedirectURL();
                } else if (this.props.urlToRedirect && !currentUser.recentAuthenticationRequired) {
                    this.props.history.push(this.props.urlToRedirect);
                    this.props.resetRedirectURL();  
                }
      
              } catch (err) {
                console.log(err);
              } finally {
                this.props.doneLoading();
              }
            }
          });
    }

    componentDidMount() {
        const { authenticated } = this.props;

        if (authenticated) {
            if (this.props.urlToRedirect || this.props.redirectURL) {
                if (this.props.urlToRedirect && !this.state.hasRedirected) {
                    this.props.history.push(this.props.urlToRedirect);
                    this.props.resetRedirectURL();

                    if (!this.state.hasRedirected)
                        this.setState({ hasRedirected: true });
                    return;
                }

                if (this.props.resetRedirectURL && !this.state.hasRedirected) {
                    this.props.history.push(this.props.resetRedirectURL);
                    this.props.resetRedirectURL();

                    if (!this.state.hasRedirected)
                        this.setState({ hasRedirected: true });
                    return;
                }
            }
        }

        if (!this.state.showForm)
            this.setState({ showForm: true });
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

    handleLoginBtnClicked = () => {
        const { email, password } = this.state;

        if (email && password) {
            this.props.turnOnLoginStatusCheck();
            this.props.showLoading({ reset: false, count: 1});

            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(async res => {
                    await this.populateUser(res.user);
                    this.props.login();

                    console.log(this.props.urlToRedirect);

                    if (this.props.urlToRedirect) {
                        this.props.history.push(this.props.urlToRedirect);
                    } else {
                        // redirect to the main page
                        this.props.history.push('/');
                    }
                })
                .catch(err => {
                    if (err.message) {
                        toastr.error(err.message);
                    } else {
                        toastr.error('There was an error in login in.');
                    }
                })
                .finally(() => {
                    this.props.doneLoading();
                });
        }
    }

    handleFacebookSignIn = async () => {
        const isDesktop = utilService.isMobile();
        this.props.turnOnLoginStatusCheck();
        try {
            let userInfo;
            let userData;

            if (isDesktop === false) {
                userInfo = await firebase.auth().signInWithPopup(provider);
            } else {
                userInfo = await firebase.auth().signInWithRedirect(provider);
            }

            try {
                const userRes = await userService.getUser(userInfo.user.uid);
                userData = userRes.data;
            } catch {

            }

            // check if user exists
            if (userData) {
                const { buyerID, firstName, lastName, phone, email, city, state, statusID, registrationCompleted } = userData;

                this.props.setUser({
                    userID: buyerID,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone,
                    city: city,
                    state: state,
                    statusID: statusID,
                    currentUser: userInfo,
                    emailVerified: userInfo.emailVerified,
                    registrationCompleted: registrationCompleted,
                    recentAuthenticationRequired: false
                });

                this.props.login();

                if (this.props.urlToRedirect) {
                    this.props.history.push(this.props.urlToRedirect);
                } else {
                    // redirect to the main page
                    this.props.history.push('/');
                }
            } else {
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

                const options = firebaseCustomActions.getCustomActionParameters();

                await userInfo.user.sendEmailVerification(options);
                toastr.success('Verification email has been sent. Please check your email and click the link to continue.');

                const userData = createUserData;
                userData.currentUser = user;
    
                this.props.setUser(userData);
                this.props.login();      

                this.props.history.push('/');
            }
        } catch (err) {
            toastr.error(err);
            console.log(err);
        } finally {
            this.props.doneLoading();
        }
    }

    populateUser(user) {
        const { uid } = user;

        return new Promise((resolve, reject) => {
            userService.getUser(uid)
                .then(res => {
                    const userData = res.data;

                    const { buyerID, firstName, lastName, phone, email, city, state, statusID, registrationCompleted } = userData;

                    this.props.setUser({
                        userID: buyerID,
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        phone: phone,
                        city: city,
                        state: state,
                        statusID: statusID,
                        currentUser: user,
                        emailVerified: user.emailVerified,
                        registrationCompleted: registrationCompleted,
                        recentAuthenticationRequired: false
                    });

                    resolve();
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    handleSignUpBtnClicked = () => {
        $('#signUpModal').modal('show');
    }

    handleRegistrationCompleted = (redirectURL) => {
        $('#signUpModal').modal('hide');
        
        if (redirectURL)
            this.props.history.push(redirectURL);
    }

    render() {
        const { showForm } = this.state;

        if (showForm) {
            return (
                <React.Fragment>
                    <div className="block">
                        <div className="block-header">
                            <h5>Login</h5>
                        </div>
                        <div className="block-body">
                            <form noValidate>
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input id="email" 
                                        type="text" 
                                        className="form-control"
                                        onChange={this.handleEmailChanged}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input id="password" 
                                        type="password" 
                                        className="form-control" 
                                        onChange={this.handlePasswordChanged}
                                    />
                                </div>
                                <div className="form-group text-center">
                                    <div className="row">
                                        <div className="col-12">
                                            <button type="button" 
                                                    className="btn btn-primary"
                                                    onClick={this.handleLoginBtnClicked}
                                                    style={{ width: '100%' }}
                                            >
                                                <i className="fas fa-sign-in-alt"></i> 
                                                Log in
                                            </button>
                                        </div>
                                        <div className="col-12">
                                            OR
                                        </div>
                                        <div className="col-12">
                                            <button type="button" 
                                                    className="btn btn-facebook"
                                                    onClick={this.handleFacebookSignIn}
                                                    style={{ width: '100%' }}
                                            >
                                                <i className="fab fa-facebook-f"></i> 
                                                Continue with Facebook
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <p>Forgot password? Click <Link to="/password-reset">here</Link>.</p>
                                </div>
                                <div className="hr-line-dashed"></div>
                                <div className="row form-group">
                                    <div className="col-12">
                                        <p>Haven't registered yet?</p>
                                    </div>
                                    <div className="col-12">
                                        <button type="button"
                                                className="btn btn-success"
                                                onClick={this.handleSignUpBtnClicked}
                                                style={{ width: '100%' }}
                                        >
                                            Register
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <SignUpModal onRegistrationCompleted={this.handleRegistrationCompleted} />
                </React.Fragment>
            );
        } else {
            return <div style={{ height: '300px' }}></div>
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);