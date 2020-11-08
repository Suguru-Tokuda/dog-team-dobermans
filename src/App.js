import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import firebase from 'firebase/app';
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
import { Account } from './components/account';
import { PuppyRequests } from './components/puppyRequests'
import PageNotFound from './components/common/pageNotFound';
import $ from 'jquery';

class App extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount(props) {
    $(document).ready(() => {
      const navMain = $('#navbarCollapse');
      const root = $('#root');
      root.on('click', () => {
        navMain.collapse('hide');
      });
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.setUser(user);
      }
    });
  }

  render() {
    return (
      <BrowserRouter>
        <TopNavbar />
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
            <Route component={PageNotFound} />
          </Switch>
        <Footer />
      </BrowserRouter>
    );
  }

}

const mapStateToProps = state => ({
  user: state.user,
  login: state.login
});

const mapDispatchToProps = dispatch => {
  return {
    login: () => dispatch({ type: 'SIGN_IN' }),
    logout: () => dispatch({ type: 'SIGN_OUT' }),
    setUser: (user) => dispatch({ type: 'SET_USER', user: user })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);