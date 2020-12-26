import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

class EmailVerification extends Component {
    
    state = {
        emailVerificationConfirmationMsg: ''
    }

    handleResendVerificationEmailBtnClicked = () => {
        const { currentUser } = this.props.user;

        if (currentUser && currentUser.sendEmailVerification) {
            this.props.showLoading({ reset: true, count: 1 });

            currentUser.sendEmailVerification()
                .then(res => {
                    this.setState({ emailVerificationConfirmationMsg: 'Verification Email has been sent. Please check your email and click the link to continue using the site.' });
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    this.props.doneLoading({ reset: true });
                });
        }
    }

    renderHeader() {
        return (
            <section className="hero hero-page gray-bg padding-small">
            <div className="container">
                <div className="row d-flex">
                    <div className="col-lg-9 order-2 order-lg-1">
                        <h1>Email Verification</h1>
                    </div>
                    <div className="col-lg-3 text-right order-1 order-lg-2">
                        <ul className="breadcrumb justify-content-lg-end">
                            <li className="breadcrumb-item">
                                <Link to="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item active">
                                Email Verification
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
        );
    }

    render() {
        let emailVerified = false;
        const { authenticated } = this.props;

        if (this.props.user) {
            emailVerified = this.props.user.emailVerified;
        }
        
        if (authenticated && emailVerified) {
            return <Redirect to="/" />;
        } else {
            return (
                <React.Fragment>
                    {this.renderHeader()}
                    <div className="container" style={{ marginTop: '100px' }}>
                        <div className="text-center">
                            <h2>Please verify your email to continue.</h2>
                            <button type="button"
                                    onClick={this.handleResendVerificationEmailBtnClicked}
                                    className="btn btn-primary"
                                    style={{ marginTop: '50px', marginBottom: '50px' }}
                            >
                                Resend Verification Email
                            </button>
                        </div>
                    </div>
                </React.Fragment>
            );
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(EmailVerification);