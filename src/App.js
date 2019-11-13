import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from './components/main/main';
import Puppies from './components/puppies/puppies';
import Parents from './components/parents/parents';
import PageNotFound from './components/common/pageNotFound';

class App extends Component {

  render() {
    return (
      // <BrowserRouter>
      //   <div className="app">
      //     <Header />
      //     <div className="app-body">
      //       <Sidebar />
      //       <main className="main">
      //         <div className="container-fluid">
      //           <Switch>
      //           <Route path="/" render={(props) => <AdminMain onShowNotification={this.showNotification} />} exact />
      //           </Switch>
      //         </div>
      //       </main>
      //     </div>
      //   </div>
      // </BrowserRouter>
      <BrowserRouter>
            <Switch>
              <Route path="/" exact render={(props) => <Main {...props} />} />
              <Route path="/puppies" render={(props) => <Puppies {...props} />} />
              <Route path="/our-dogs" render={(props) => <Parents {...props} />} />
              <Route path="/about-us" render={(props) => <AboutUs {...props} />} />
              <Route component={PageNotFound} />
            </Switch>
      </BrowserRouter>
    );
  }

}

export default App;