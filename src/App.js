import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Main from './components/main/main';
import AdminMain from './components/admin/main/adminMain';
import PageNotFound from './components/common/pageNotFound';
import Sidebar from './components/admin/templates/adminSidebar';
import Header from './components/admin/templates/adminHeader';

class App extends Component {

  showNotification(message, type) {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warn(message);
        break;
      case 'info':
        toast.info(message);
        break;
      default:
        toast(message);
    }
  }

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
        <ToastContainer />
            <Switch>
              {/* <Route path="/" render={(props) => <Main onShowNotification={this.showNotification.bind(this)} />} exact /> */}
              <Route path="/" render={(props) => <AdminMain onShowNotification={this.showNotification} />} exact />
              <Route path="/admin" render={(props) => <AdminMain onShowNotification={this.showNotification.bind(this)} />} />
              <Route component={PageNotFound} />
            </Switch>
      </BrowserRouter>
    );
  }

}

export default App;