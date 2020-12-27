import React, { Component } from 'react';
import firebase from 'firebase/app';
import { provider } from '../../services/firebaseService';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import userService from '../../services/userService';
import utilService from '../../services/utilService';
import toastr from 'toastr';

class LoginForm extends Component {
    state = {
        email: '',
        password: ''
    };

    constructor(props) {
        super(props);
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
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
      
                this.props.setUser({
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
                });
                
                this.props.checkUser();          
                this.props.login();

                if (this.props.redirectURL) {
                  this.props.history.push(this.props.redirectURL);
                  this.props.resetRedirectURL();
                } else if (this.props.urlToRedirect) {
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
            this.props.showLoading({ reset: false, count: 1});

            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(async res => {
                    await this.populateUser(res.user);
                    this.props.login();
                })
                .catch(err => {
                    if (err.message) {
                        toastr.error(err.message);
                    } else {
                        toastr.error('There was an error in loggin in.');
                    }
                })
                .finally(() => {
                    this.props.doneLoading();
                    if (this.props.urlToRedirect) {
                        this.props.history.push(this.props.urlToRedirect);
                    } else {
                        // redirect to the main page
                        this.props.history.push('/');
                    }
                });
        }
    }

    handleFacebookSignIn = async () => {
        const isDesktop = utilService.isMobile();

        try {
            let userInfo;
            if (isDesktop === false) {
                userInfo = await firebase.auth().signInWithPopup(provider);
            } else {
                userInfo = await firebase.auth().signInWithRedirect(provider);
            }

            if (userInfo.additionalUserInfo.isNewUser === true) {
                // redirect to the user registration page.
            } else {
                // get user info from the api, then set the user info to the global state.
                await this.populateUser(userInfo.user);

                this.props.login();
                if (this.props.urlToRedirect) {
                    this.props.history.push(this.props.urlToRedirect);
                } else {
                    // redirect to the main page
                    this.props.history.push('/');
                }
            }
        } catch (err) {
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
                        registrationCompleted: registrationCompleted
                    });

                    resolve();
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    render() {
        return (
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
                            <button type="button" 
                                    className="btn btn-primary"
                                    onClick={this.handleLoginBtnClicked}
                            >
                                <i className="fas fa-sign-in-alt"></i> 
                                Log in</button>
                            <span className="ml-2 mr-2">or</span>
                            <button type="button" 
                                    className="btn btn-facebook"
                                    onClick={this.handleFacebookSignIn}
                            >
                                <i className="fab fa-facebook-f"></i> 
                                Continue with Facebook
                            </button>
                        </div>
                        <div className="form-group">
                            <div className="text-center">
                                <p>Forgot password? Click <Link to="/password-reset">here</Link>.</p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated,
    userChecked: state.userChecked,
    redirectURL: state.redirectURL
});

const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch({ type: 'SIGN_IN' }),
        setUser: (user) => dispatch({ type: 'SET_USER', user: user }),
        checkUser: () => dispatch({ type: 'USER_CHECKED' }),
        showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
        doneLoading: () => dispatch({ type: 'DONE_LOADING' }),
        resetRedirectURL: () => dispatch({ type: 'RESET_REDIRECT_URL' })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);