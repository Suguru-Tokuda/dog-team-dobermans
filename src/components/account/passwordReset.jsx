import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from '../../services/firebaseService';
import validationService from '../../services/validationService';
import toastr from 'toastr';

class PasswordReset extends Component {
    state = {
        email: '',
        emailValidation: '',
        formSubmitted: false
    };

    getHeader() {
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-1">
                            <h1>Reset Password</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    Reset Password
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    handleEmailChanged = (e) => {
        const { value } = e.target;
        let emailValidation = '';

        if (!value) {
            emailValidation = 'Enter an email';
        } else if (validationService.validateEmail(value) === false) {
            emailValidation = 'Enter a valid email';
        }

        this.setState({ email: value, emailValidation: emailValidation });
    }

    handleResetPasswordBtnClicked = () => {
        this.setState({ formSubmitted: true });

        let isValid = !this.state.emailValidation;

        if (isValid) {
            this.props.showLoading({ reset: false, count: 1 });

            firebase.auth().sendPasswordResetEmail(this.state.email.trim().toLowerCase())
                .then(() => {
                    toastr.success('A password reset email was successfully sent. Please check your email.');
                })
                .catch(err => {
                    if (err.message) {
                        toastr.error(err.message);
                    } else {
                        toastr.error('There was an error in sending a password reset email.');
                    }
                })
                .finally(() => {
                    this.props.doneLoading({ reset: true });
                })
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.getHeader()}
                <section className="padding-small">
                    <div className="container">
                        <h2>Password Reset</h2>
                        <p>Please enter your email to reset the password.</p>
                        <div className="text-center">
                            <input className="form-control"
                                   type="email"
                                   onChange={this.handleEmailChanged}
                            />
                            <button type="button"
                                    className="btn btn-primary mt-3"
                                    onClick={this.handleResetPasswordBtnClicked}
                            >
                                Reset Password
                            </button>
                            {this.state.emailValidation && (
                                <small className="text-danger">{this.state.emailValidation}</small>
                            )}
                        </div>
                    </div>
                </section>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated,
    loadCount: state.loadCount,
    userChecked: state.userChecked,
    redirectURL: state.redirectURL
  });
  
  const mapDispatchToProps = dispatch => {
    return {
      login: () => dispatch({ type: 'SIGN_IN' }),
      logout: () => dispatch({ type: 'SIGN_OUT' }),
      resetUser: () => dispatch({ type: 'RESET_USER' }),
      checkUser: () => dispatch({ type: 'USER_CHECKED' }),
      setUser: (user) => dispatch({ type: 'SET_USER', user: user }),
      getUser: () => dispatch({ type: 'GET_USER' }),
      showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
      doneLoading: () => dispatch({ type: 'DONE_LOADING' }),
      resetRedirectURL: () => dispatch({ type: 'RESET_REDIRECT_URL' })
    };
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(PasswordReset);