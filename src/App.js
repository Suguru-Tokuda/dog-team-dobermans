import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Spinner from 'react-spinkit';
import firebase from './services/firebaseService';
import Main from './components/main/main';
import TopNavbar from './components/common/topnavbar';
import Footer from './components/common/footer';
import AboutDobermans from './components/aboutDobermans/aboutDobermans';
import Parents from './components/parents/parents';
import Puppies from './components/puppies/puppies';
import Testimonials from './components/testimonials/testimonials';
import Blog from './components/blog/blog';
import AboutUs from './components/aboutUs/aboutUs';
import Contact from './components/contact/contact';
import Login from './components/account/login';
import Account from './components/account/account';
import EmailVerification from './components/account/emailVerification';
import PasswordReset from './components/account/passwordReset';
import PuppyRequests from './components/puppyRequests';
import PuppyRequest from './components/puppyRequest';
import PageNotFound from './components/common/pageNotFound';
import userService from './services/userService';
import $ from 'jquery';
import UserRegistration from './components/account/userRegistration';

class App extends Component {

  componentDidMount() {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        this.props.checkUser();          
        this.props.login();

        this.props.showLoading({reset: false, count: 1 });

        try {
          const res = await userService.getUser(user.uid);
          const userData = res.data;
    
          const { buyerID, firstName, lastName, phone, email, city, state, statusID, registrationCompleted } = userData;
          const { emailVerified } = user;

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
              emailVerified: emailVerified,
              registrationCompleted: registrationCompleted
          });
        } catch (err) {
          console.log(err);
        } finally {
          this.props.doneLoading();
        }
      }
    });

    $(document).ready(() => {
      const navMain = $('#navbarCollapse');
      const root = $('#root');
      root.on('click', () => {
        navMain.collapse('hide');
      });
    });
  }

  showSpinner = () => {
    if (this.props.loadCount > 0) {
      return (
        <div className="centered-spinner">
          <Spinner name="line-spin-fade-loader" color="purple"/>
        </div>
      );
    }
  }

  getUIBlockerClass = () => {
    return (this.props.loadCount > 0 ? 'block-screen': '');
  }

  render() {
    const { authenticated } = this.props;

    return (
      <BrowserRouter>
      <div className={this.getUIBlockerClass()}>
        <TopNavbar />
          {this.showSpinner()}
          <Switch>
            <Route path="/" exact render={(props) => <Main {...props} />} />
            <Route path="/about-dobermans" exact render={(props) => <AboutDobermans {...props} />} />
            <Route path="/puppies" render={(props) => <Puppies {...props} />} />
            <Route path="/our-dogs" render={(props) => <Parents {...props} />} />
            <Route path="/testimonials" render={(props) => <Testimonials {...props} />} />
            <Route path="/blog" render={(props) => <Blog {...props} />} />
            <Route path="/about-us" render={(props) => <AboutUs {...props} />} />
            <Route path="/contact" render={(props) => <Contact {...props} />} />
            <Route path="/account" render={(props) => <Account {...props} />} />
            <Route path="/puppy-requests" render={(props) => <PuppyRequests {...props} />} />
            <Route path="/puppy-request" render={(props) => <PuppyRequest {...props} />} />
            <Route path="/login" render={(props) => <Login {...props} />} />
            <Route path="/email-verification" render={(props) => <EmailVerification {...props} />} />
            <Route path="/user-registration"render={(props) => <UserRegistration {...props} />} />
            <Route path="/password-reset" render={(props) => <PasswordReset {...props} />} />
            <Route component={PageNotFound} />
          </Switch>
        <Footer />
      </div>
      </BrowserRouter>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(App);