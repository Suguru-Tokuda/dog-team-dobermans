import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from './components/main/main';
import TopNavbar from './components/common/topnavbar';
import Footer from './components/common/footer';
import Parents from './components/parents/parents';
import Puppies from './components/puppies/puppies';
import Testimonials from './components/testimonials/testimonials';
import AboutUs from './components/aboutUs/aboutUs';
import Contact from './components/contact/contact';
import PageNotFound from './components/common/pageNotFound';

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <TopNavbar />
          <Switch>
            <Route path="/" exact render={(props) => <Main {...props} />} />
            <Route path="/puppies" render={(props) => <Puppies {...props} />} />
            <Route path="/our-dogs" render={(props) => <Parents {...props} />} />
            <Route path="/testimonials" render={(props) => <Testimonials {...props} />} />
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