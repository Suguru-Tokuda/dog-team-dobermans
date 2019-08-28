import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Topnavbar from './components/common/topnavbar';
import Main from './components/main/main';
import PageNotFound from './components/common/pageNotFound';
import './App.css';

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
      <BrowserRouter>
        <ToastContainer />
        <header className="header">
          <Topnavbar />
        </header>
        <div className="App">
          <Switch>
            <Route path="/" render={(props) => <Main onShowNotification={this.showNotification.bind(this)} />} exact />
            <Route component={PageNotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }

}

export default App;