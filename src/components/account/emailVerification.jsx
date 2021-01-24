import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import firebase from '../../services/firebaseService';
import firebaseCustomActions from '../../services/firebaseService';
import { connect } from 'react-redux';
import userService from '../../services/userService';
import toastr from 'toastr';

class EmailVerification extends Component {
    
    state = {
        emailVerificationConfirmationMsg: ''
    }

    handleResendVerificationEmailBtnClicked = async () => {
        const { currentUser } = this.props.user;

        if (this.props.user) {
            this.props.showLoading({ reset: false, count: 1 });

            try {
                const res = await userService.getUser(this.props.user.userID);
                const { buyerID, firstName, lastName, phone, email, city, state, statusID, emailVerified, registrationCompleted } = res.data;
                const { user } = this.props;

                if (user.currentUser.reload) {
                    await user.currentUser.reload();
                }

                const currentUser = firebase.auth().currentUser;
            
                user.userID = buyerID;
                user.firstName = firstName;
                user.lastName = lastName;
                user.email = email;
                user.phone = phone;
                user.city = city;
                user.state = state;
                user.statusID = statusID;
                user.currentUser = currentUser;
                user.emailVerified = emailVerified;
                user.registrationCompleted = registrationCompleted;

                if (emailVerified !== currentUser.emailVerified) {
                    const userUpdateData = {
                        userID: user.userID,
                        emailVerified: currentUser.emailVerified
                    };

                    await userService.editUser(userUpdateData);
                }

                this.props.setUser(user);
            } catch (err) {
                console.log(err);
                toastr.error('There was an error in refreshing user data.');
            } finally {
                this.props.doneLoading({ resetAll: true });
            }
        }

        if (currentUser && currentUser.sendEmailVerification) {
            this.props.showLoading({ reset: true, count: 1 });
            const options = firebaseCustomActions.getCustomActionParameters();

            currentUser.sendEmailVerification(options)
                .then(res => {
                    this.setState({ emailVerificationConfirmationMsg: 'Verification Email has been sent. Please check your email and click the link to continue using the site.' });
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    this.props.doneLoading({ reset: true });
                });
        }
    }

    renderHeader() {
        return (
            <section className="hero hero-page gray-bg padding-small">
            <div className="container">
                <div className="row d-flex">
                    <div className="col-lg-9 order-2 order-lg-1">
                        <h1>Email Verification</h1>
                    </div>
                    <div className="col-lg-3 text-right order-1 order-lg-2">
                        <ul className="breadcrumb justify-content-lg-end">
                            <li className="breadcrumb-item">
                                <Link to="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item active">
                                Email Verification
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
        );
    }

    render() {
        let emailVerified = false;
        const { authenticated } = this.props;

        if (this.props.user) {
            emailVerified = this.props.user.emailVerified;
        }
        
        if (authenticated && emailVerified) {
            return <Redirect to="/" />;
        } else {
            return (
                <React.Fragment>
                    {this.renderHeader()}
                    <div className="container" style={{ marginTop: '100px' }}>
                        <div className="text-center">
                            <h2>Please verify your email to continue.</h2>
                            <button type="button"
                                    onClick={this.handleResendVerificationEmailBtnClicked}
                                    className="btn btn-primary"
                                    style={{ marginTop: '50px', marginBottom: '50px' }}
                            >
                                Resend Verification Email
                            </button>
                        </div>
                    </div>
                </React.Fragment>
            );
        }
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
      checkUser: () => dispatch({ type: 'USER_CHECKED' }),
      setUser: (user) => dispatch({ type: 'SET_USER', user: user }),
      getUser: () => dispatch({ type: 'GET_USER' }),
      showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
      doneLoading: () => dispatch({ type: 'DONE_LOADING' }),
      resetRedirectURL: () => dispatch({ type: 'RESET_REDIRECT_URL' })
    };
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(EmailVerification);