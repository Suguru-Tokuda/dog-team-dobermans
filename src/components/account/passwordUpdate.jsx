import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../../services/firebaseService';
import toastr from 'toastr';

class PasswordUpdae extends Component {
    state = {
        form: {
            newPassword: '',
            confirmPassword: ''
        },
        showNewPassword: false,
        showConfirmPassword: false,
        validation: {},
        formSubmitted: false
    };

    componentDidMount() {
        const { authenticated } = this.props;
        
        if (authenticated === false) {
            this.props.history.push('/');
        }
    }

    handleNewPasswordChanged = (e) => {
        const { value } = e.target;
        const { form, validation } = this.state;

        if (!value) {
            validation.newPassword = 'Enter a new password';
        } else {
            delete validation.newPassword;
        }

        form.newPassword = value;

        this.setState({ form, validation });
    }

    handleConfirmPasswordChanged = (e) => {
        const { value } = e.target;
        const { form, validation } = this.state;

        if (!value) {
            validation.confirmPassword = 'Enter confirm password';
        } else if (value !== form.newPassword) {
            validation.confirmPassword = 'Confirm password does not match with the new password';
        } else {
            delete validation.confirmPassword;
        }

        form.confirmPassword = value;

        this.setState({ form, validation });
    }

    getEightCharacterLongClass() {
        const { newPassword } = this.state.form;

        if (newPassword.length >= 8) {
            return 'text-success';
        } else {
            return '';
        }
    }

    getUpperCaseLowerCaseLettersClass() {
        const { newPassword } = this.state.form;
        const upperCaseRegex = /[A-Z]/g;
        const lowerCaseRegex = /[a-z]/g;

        if (upperCaseRegex.test(newPassword) && lowerCaseRegex.test(newPassword))
            return 'text-success';
        else
            return '';
    }

    getSpecialCharacterClass() {
        const { newPassword } = this.state.form;
        const specialCharacterRegex = /[!@#?\]\-]/g;

        if (specialCharacterRegex.test(newPassword))
            return 'text-success'
        else
            return '';
    }

    handleSubmitBtnClicked = () => {
        const { form } = this.state;
        let isValid = true;

        if (form.newPassword !== form.confirmPassword) {
            isValid = false;
            const { validation } = this.state;

            validation.confirmPassword = 'Password does not match.';
        }

        isValid = Object.keys(this.state.validation).length === 0;

        if (isValid) {
            this.props.showLoading({ reset: true, count: 1 });

            firebase.auth().currentUser.updatePassword(form.newPassword)
                .then(() => {
                    toastr.success('Successfully updated the password.');

                    this.setState({
                        form: {
                            newPassword: '',
                            confirmPassword: ''
                        }
                    });
                })
                .catch(err => {
                    if (err.message) {
                        toastr.error(err.message);
                    } else {
                        toastr.error('There was an error in updating the password.');
                    }
                })
                .finally(() => {
                    this.props.doneLoading({ reset: true });
                })
        }
    }

    render() {
        const { form, validation, formSubmitted } = this.state;

        return (
            <React.Fragment>
                <div className="block-header mb-5">
                    <h5>Password Update</h5>
                </div>
                <div className="content-block" style={{ margin: '20px', color: 'gray' }}>
                    <div className="form-group row">
                        <label className="form-label col-xs-12 col-sm-12 col-md-3 col-lg-3" htmlFor="newPassword">New Password</label>
                        <div className="col-xs-12 col-sm-12 col-md-5 col-lg-4">
                            <div className="form-inline">
                                <div className="form-group">
                                    <input 
                                        id="newPassword" 
                                        style={{ display: 'inline-block !important'}}
                                        type={this.state.showNewPassword ? 'text' : 'password'} 
                                        className="form-control" 
                                        value={form.newPassword}
                                        onChange={this.handleNewPasswordChanged}
                                    />
                                    <span style={{ cursor: 'pointer' }} className="ml-2" onClick={() => this.setState({ showNewPassword: !this.state.showNewPassword})}><i className={this.state.showNewPassword ? 'far fa-eye' : 'far fa-eye-slash'}></i></span>
                                </div>
                            </div>
                            {(validation.newPassword) && (
                                <small className="text-danger">{validation.newPassword}</small>
                            )}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="form-label col-xs-12 col-sm-12 col-md-3 col-lg-3" htmlFor="confirmPassword">Confirm Password</label>
                        <div className="col-xs-12 col-sm-12 col-md-5 col-lg-4">
                            <div className="form-inline">
                                <div className="form-group">
                                    <input 
                                        id="confirmPassword" 
                                        type={this.state.showConfirmPassword ? 'text' : 'password'} 
                                        className="form-control" 
                                        value={form.confirmPassword}
                                        onChange={this.handleConfirmPasswordChanged}
                                    />
                                    <span style={{ cursor: 'pointer' }} className="ml-2" onClick={() => this.setState({ showConfirmPassword: !this.state.showConfirmPassword})}><i className={this.state.showConfirmPassword ? 'far fa-eye' : 'far fa-eye-slash'}></i></span>
                                </div>
                            </div>
                            {(validation.confirmPassword) && (
                                <small className="text-danger">{validation.confirmPassword}</small>
                            )}
                        </div>
                    </div>
                    <p>Password rules:</p>
                                <ul style={{ color: 'gray' }}>
                                    <li className={this.getEightCharacterLongClass()}>At least 8 characters.</li>
                                    <li className={this.getUpperCaseLowerCaseLettersClass()}>A mixture of both uppercase and lowercase letters.</li>
                                    <li className={this.getSpecialCharacterClass()}>Inclusion of at least one special character, e.g., ! @ # ? ] -</li>
                                </ul>
                    <div className="form-group row">
                        <div className="col-xs-12 text-center">
                            <button type="button"
                                    className="btn btn-primary"
                                    onClick={this.handleSubmitBtnClicked}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(PasswordUpdae);