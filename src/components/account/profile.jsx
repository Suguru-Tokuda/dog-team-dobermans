import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from '../../services/firebaseService';
import BasicInformation from './basicInformation';
import ProfileEditor from './profileEditor';

class Profile extends Component {

    state = {
        selectedProfileMenu: ''
    };

    getHeader() {
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-1">
                            <h1>Profile</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link to="/puppies">Puppies</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    Profile
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    getProfileContent() {
        const { selectedProfileMenu } = this.state;

        switch (selectedProfileMenu) {
            case 'profile':
                return <BasicInformation {...this.props} />;
            case 'update-profile':
                return <ProfileEditor {...this.props} />;
            default:
                return null;
        }
    }

    getHeader() {
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-">
                            <h1>Profile</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    Profile
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    handleSignOut = () => {
        this.props.showLoading({ reset: true, count: 1 });
        firebase.auth().signOut()
            .then(() => {
                this.props.logout();
            })
            .catch(() => {

            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
                this.props.history.push('/');
            });
    }

    render() {
        const { selectedProfileMenu } = this.state;
        const { user, authenticated } = this.props;
                
        if (authenticated && user && user.registrationCompleted) {
            const { currentUser } = user;
            return (
                <React.Fragment>
                    {this.getHeader()}
                    <section className="padding-small">
                        <div className="container">
                            <div className="row">
                                <div className="customer-sidebar col-xs-3 col-lg-4 col-xl-3">
                                    <div className="customer-profile">
                                        <h5>{ `${user.firstName} ${user.lastName}` }</h5>
                                        <p className="text-muted text-small">{ user.email }</p>
                                    </div>
                                    <nav className="list-group customer-nav">
                                        <a href="#" onClick={() => this.setState({ selectedProfileMenu: 'profile'})} className={`list-group-item d-flex justify-content-between align-items-center ${selectedProfileMenu === 'profile' ? 'active' : '' }`}><i className="fa fa-user"></i> Profile</a>
                                        <a href="#" onClick={() => this.setState({ selectedProfileMenu: 'update-profile'})} className={`list-group-item d-flex justify-content-between align-items-center ${selectedProfileMenu === 'update-profile' ? 'active' : '' }`}><i className="fa fa-info"></i> Update Profile</a>
                                        {currentUser.providerData[0].providerId !== 'facebook.com' && (
                                            <a href="#" onClick={() => this.setState({ selectedProfileMenu: 'update-password'})} className={`list-group-item d-flex justify-content-between align-items-center ${selectedProfileMenu === 'update-password' ? 'active' : '' }`}><i className="fa fa-key"></i> Update Passowrd</a>
                                        )}
                                        <a href="#" onClick={this.handleSignOut} className={`list-group-item d-flex justify-content-between align-items-center`}><i className="fas fa-sign-out-alt"></i> Sign out</a>
                                        {/* <a href="#" onClick={() => this.setState({ selectedProfileMenu: 'delete'})} className={`list-group-item d-flex justify-content-between align-items-center ${selectedProfileMenu === 'delete' ? 'active' : '' }`}><i className="fa fa-remove"></i> Delete Account</a> */}
                                    </nav>
                                </div>
                                <div className="col-xs-9 col-lg-8 col-xl-9 col-lg-3">
                                    {this.getProfileContent()}
                                </div>
                            </div>
                        </div>
                    </section>
                </React.Fragment>
            );
        } else if (!authenticated) {
            this.props.resetRedirectURL();
            return <Redirect to={{ pathname: '/login' }} />;
        } else if (authenticated && user && !user.registrationCompleted) {
            return <Redirect to={{ pathname: '/user-registration' }} />;
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(Profile);