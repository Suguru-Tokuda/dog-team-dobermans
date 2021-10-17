import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import AboutUsService from '../../services/aboutUsService';

class AboutDobermans extends Component {
    state = {
        message: ''
    };

    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.showLoading({ reset: true, count: 1 });
        AboutUsService.getAboutDobermans()
            .then(res => {
                this.setState({
                    message: res.data
                });
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
            });
    }

    getHeader() {
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-1">
                            <h1>About Dobermans</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    About Dobermans
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    getMessage() {
        const { message } = this.state;
        if (message.length > 0) {
            return <div dangerouslySetInnerHTML={{__html: message }} />
        } else {
            return <div style={{marginTop: '700px'}} />
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.getHeader()}      
                <section className="padding-small">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-8 col-lg-10">
                                {this.getMessage()}
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(AboutDobermans);