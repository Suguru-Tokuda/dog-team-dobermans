import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import firebase from '../../services/firebaseService';
import { provider } from '../../services/firebaseService';
import { Redirect } from 'react-router-dom';
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
                    statusID: 1
                };

                await userService.createUser(createUserData);

                if (currentUser.sendEmailVerification) {
                    await currentUser.sendEmailVerification();
                    toastr.success('Verification email has been sent. Please check your email and click the link to continue.');
                }

                this.props.history.push('/');
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
        const specialCharacterRegex = /[!@#?\]\-]/g;

        if (specialCharacterRegex.test(password))
            return 'text-success'
        else
            return '';
    }

    handleFaceBookSignIn = async () => {
        const isDesktop = utilService.isMobile();

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
                statusID: 1
            };

            await userService.createUser(createUserData);

            if (!userInfo.user.emailVerified) {
                await userInfo.user.sendEmailVerification();
                toastr.success('Verification email has been sent. Please check your email and click the link to continue.');
            }

            const userData = createUserData;
            userData.currentUser = user;

            this.props.setUser(userData);
            this.props.login();

            // check if there was a previousURL from props.
            if (this.props.urlToRedirect) {
                this.props.history.push(this.props.urlToRedirect);
            } else {
                // redirect to the main page
                this.props.history.push('/');
            }
        } catch (err) {
            if (err.message) {
                toastr.error(err.message);
            } else {
                toastr.error('There was an error with Facebook sign up. Please try again.');
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

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);