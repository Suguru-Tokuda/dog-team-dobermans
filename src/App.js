import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
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
import PageNotFound from './components/common/pageNotFound';
import $ from 'jquery';

class App extends Component {

  componentDidMount() {
    $(document).ready(() => {
      const navMain = $('#navbarCollapse');
      const root = $('#root');
      root.on('click', () => {
        navMain.collapse('hide');
      });
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
            <Route component={PageNotFound} />
          </Switch>
        <Footer />
      </BrowserRouter>
    );
  }

}

export default App;