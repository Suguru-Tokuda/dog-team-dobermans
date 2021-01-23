import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import firebase from '../../services/firebaseService';
import PuppyRequestForm from './puppyRequestForm';
import userService from '../../services/userService';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import toastr from 'toastr';

class PuppyRequest extends Component {
    state = {
        showForm: false
    };

    constructor(props) {
        super(props);
    }

    componentDidMount = async () => {
        if (this.props.user || firebase.auth().currentUser) {
            const { emailVerified, registrationCompleted } = this.props.user;

            if (!emailVerified || !registrationCompleted) {
                this.props.showLoading({ reset: false, count: 1 });
                try {
                    const res = await userService.getUser(firebase.auth().currentUser.uid);
    
                    const { buyerID, firstName, lastName, phone, email, city, state, statusID, emailVerified, registrationCompleted } = res.data;
                    const { user } = this.props;
    
                    if (user.currentUser.reload)
                        await user.currentUser.reload();
    
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
                    user.emailVerified = currentUser.emailVerified;
                    user.registrationCompleted = registrationCompleted;
    
                    if (emailVerified !== currentUser.emailVerified) {
                        const userUpdateData = {
                            userID: user.userID,
                            emailVerified: currentUser.emailVerified
                        };
    
                        await userService.editUser(userUpdateData);
                    }
    
                    this.props.setUser(user);
    
                    if (!currentUser.emailVerified) {
                        toastr.error('Please verify your email first.');
                        this.props.history.push({
                            pathname: '/email-verification',
                            state: {
                                redirectURL: '/puppy-request'
                            }
                        });

                        return;
                    }
    
                    if (!registrationCompleted) {
                        toastr.error('Please finish user registration.');
                        this.props.history.push({
                            pathname: '/user-registration',
                            state: {
                                redirectURL: '/puppy-request'
                            }
                        });

                        return;
                    }

                    if (currentUser.emailVerified && registrationCompleted)
                        this.setState({ showForm: true });

                } catch (err) {
                    console.log(err);
                    toastr.error('There was an error in refreshing user data.');
                } finally {
                    this.props.doneLoading({ resetAll: true });
                }
            } else {
                this.setState({ showForm: true });
            }
        } else {
            this.props.history.push({
                pathname: '/login',
                state: {
                    previousUrl: '/puppy-request'
                }
            });
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
        const { showForm } = this.state;
        const { authenticated, userChecked } = this.props;

        return (
            <React.Fragment>
                {this.getHeader()}
                {(showForm && userChecked && authenticated) && (
                    <PuppyRequestForm {...this.props} />
                )}
                {(!showForm && (
                 <div style={{ height: '300px' }}></div>   
                ))}
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