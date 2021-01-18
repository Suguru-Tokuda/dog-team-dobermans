import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import firebase from '../../services/firebaseService';
import PuppyRequestForm from './puppyRequestForm';
import userService from '../../services/userService';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import toastr from 'toastr';

class PuppyRequest extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = async () => {
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
    }

    getHeader() {
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-1">
                            <h1>Puppy Request</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    Puppy Request
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    getLoginButton() {
        return (
            <section>
                <div className="container">
                    <header className="mb-5">
                        <h2 className="heading-line">Please login to create a puppy request.</h2>
                    </header>
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <Link className="btn btn-primary" 
                                  to={{
                                    pathname: '/login',
                                    state: {
                                        previousUrl: '/puppy-request'
                                    }
                                    }} 
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    render() {
        const { user, authenticated, userChecked } = this.props;
        let emailVerified, registrationCompleted;

        if (this.props.user) {
            emailVerified = user.emailVerified;
            registrationCompleted = user.registrationCompleted;
    
            if (!emailVerified) {
                toastr.error('Please verify your email first.');
            } else if (!registrationCompleted) {
                toastr.error('Please complete user registration first.');
            }
        }

        return (
            <React.Fragment>
                {this.getHeader()}
                {(userChecked && authenticated  && emailVerified && registrationCompleted) && (
                    <PuppyRequestForm {...this.props} />
                )} 
                {(userChecked && !authenticated) && (
                    this.getLoginButton()
                )}
                {(userChecked && user && !emailVerified) && (
                    <Redirect to="/email-verification" />
                )}
                {(userChecked && user && emailVerified && !registrationCompleted) && (
                    <Redirect to="/user-registration" />
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    authenticated: state.authenticated,
    user: state.user,
    userChecked: state.userChecked
});

const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch({ type: 'SIGN_IN' }),
        setUser: (user) => dispatch({ type: 'SET_USER', user: user }),
        showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
        doneLoading: () => dispatch({ type: 'DONE_LOADING' })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PuppyRequest);