import React, { Component } from 'react';
import { connect } from 'react-redux';
import contactService from '../../services/contactService';
import UserService from '../../services/userService';
import ValidationService from '../../services/validationService';
import toastr from 'toastr';

class ProfileEditor extends Component {
    state = {
        selection: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            state: '',
            city: ''
        },
        validation: {},
        formSubmitted: false
    };

    componentDidMount() {
        const { user } = this.props;
        const { currentUser } = user;

        if (currentUser.providerData[0].providerId !== 'password') {
            this.setState({
                selection: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    city: user.city,
                    state: user.state
                }
            });
        } else {
            this.setState({
                selection: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    city: user.city,
                    state: user.state
                }
            });
        }
    }

    handleFirstNameChanged = (e) => {
        const { value } = e.target;
        const { selection, validation } = this.state;

        if (value) {
            delete validation.firstName;
        } else {
            validation.firstName = 'Enter first name';
        }

        selection.firstName = value;

        this.setState({ selection, validation });
    }

    handleLastNameChanged = (e) => {
        const { value } = e.target;
        const { selection, validation } = this.state;

        if (value) {
            delete validation.lastName;
        } else {
            validation.lastName = 'Enter last name';
        }

        selection.lastName = value;

        this.setState({ selection, validation });
    }

    handleEmailChanged = (e) => {
        const email = e.target.value.trim();
        const { selection, validation } = this.state;

        if (email !== '') {
            if (ValidationService.validateEmail(email) === true) {
                validation.email = '';
            } else {
                validation.email = 'Enter valid email';
            }
        } else {
            validation.email = 'Enter email name';
        }
        selection.email = email;
        this.setState({ selection, validation });
    }

    handlePhoneChanged = (e) => {
        let { value } = e.target;
        const { selection, validation } = this.state;

        if (value.length > 0) {
            value = value.replace(/\D/g, '');
            if (value) {
                delete validation.phone;
                selection.phone = value;
            } else {
                validation.phone = 'Enter phone number';
            }
        } else {
            selection.phone = '';
            validation.phone = 'Enter phone number';
        }

        this.setState({ selection, validation });
    }

    handleCityChanged = (e) => {
        const { value } = e.target;
        const { selection, validation } = this.state;

        if (value) {
            delete validation.city;
        } else {
            validation.city = 'Enter city name';
        }

        selection.city = value;

        this.setState({ selection, validation });
    }

    handleStateChanged = (e) => {
        const { value } = e.target;
        const { selection, validation } = this.state;

        if (value) {
            delete validation.state;
        } else {
            validation.state = 'Enter state name';
        }

        selection.state = value;

        this.setState({ selection, validation });
    }

    renderStateOptions() {
        const states = contactService.getStates();

        return states.map(state => {
            return <option key={state.abbreviation} value={state.abbreviation}>{ state.abbreviation }</option>
        });
    }

    handleUndoClicked = () => {
        const { user } = this.props;
        const { firstName, lastName, email, phone, state, city } = user;

        const selection = {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            state: state,
            city: city            
        };

        if (user.currentUser.providerData[0].providerId === 'password') {
            selection.email = email;
        }

        this.setState({ selection: selection });
    }

    handleSubmitBtnClicked = async () => {
        const { selection, validation } = this.state;
        const { user } = this.props;
        const selectionKeys = Object.keys(selection);
        let isValid = true;

        selectionKeys.forEach(key => {
            if (key === 'email') {
                if (user.currentUser.providerData[0].providerId !== 'facebook.com') {
                    if (selection[key] === '') {
                        validation[key] = `Enter ${key}`;
                        isValid = false;
                    } else {
                        validation[key] = '';
                    }

                    if (ValidationService.validateEmail(selection[key]) === true) {
                        validation[key] = '';
                    } else {
                        validation[key] = `Enter valid email`;
                        isValid = false;
                    }
                }
            } else {
                if (selection[key] === '') {
                    validation[key] = `Enter ${key}`;
                    isValid = false;
                }
            }
        });

        if (isValid === true) {
            let { firstName, lastName, email, phone, state, city } = selection;
            firstName = firstName.trim();
            lastName = lastName.trim();
            phone = phone.trim();
            city = city.trim();

            const data = {
                userID: user.userID,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                phone: phone.trim(),
                state: state.trim(),
                city: city.trim()
            };

            if (user.currentUser.providerData[0].providerId === 'password') {
                data.email = email.toLowerCase();
            }

            this.props.showLoading({ reset: true, count: 1 });
            
            try {
                if (user.currentUser.providerData[0].providerId === 'password') {
                    if (user.email.toLowerCase() !== email.trim().toLowerCase()) {
                        await user.currentUser.updateEmail(email.trim().toLowerCase());
                        await user.currentUser.sendEmailVerification();

                        toastr.success('Verification email has been sent. Please check your email to continue.');
                        user.email = email.trim().toLowerCase();
                    }
                }

                await UserService.editUser(data);           

                user.firstName = firstName;
                user.lastName = lastName;
                user.phone = phone;
                user.city = city;
                user.state = state;

                this.props.setUser(user);
            } catch (err) {
                console.log(err);

                if (err.message) {
                    toastr.error(err.message);
                } else {
                    toastr.error('There was an error in updating profile.');
                }

                if (err.code && err.code === 'auth/requires-recent-login') {
                    this.props.setRedirectURL('/account?accountMenu=update-profile');
                    const { user } = this.props;
                    user.recentAuthenticationRequired = true;

                    this.props.setUser(user);
                    this.props.history.push('/login');
                }
            }

            this.props.doneLoading({ reset: true });
        }
    }

    render() {
        const { user } = this.props;
        const { currentUser } = user;
        const { firstName, lastName, email, phone, city, state } = this.state.selection;
        const { validation } = this.state;

        return (
            <React.Fragment>
                <div className="block-header mb-5">
                    <h5>Profile Editor</h5>
                </div>
                <div className="content-block" style={{ margin: '20px', color: 'gray' }}>
                    <div className="form-group row">
                        <label className="form-label col-xs-12 col-sm-12 col-md-3 col-lg-3" htmlFor="firstName">First Name</label>
                        <div className="col-xs-12 col-sm-12 col-md-5 col-lg-4">
                            <input 
                                id="firstName" 
                                type="text" 
                                className="form-control" 
                                value={firstName}
                                onChange={this.handleFirstNameChanged}
                            />
                            {(validation.firstName) && (
                                <small className="text-danger">{validation.firstName}</small>
                            )}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="form-label col-xs-12 col-sm-12 col-md-3 col-lg-3"  htmlFor="lastName">Last Name</label>
                        <div className="col-xs-12 col-sm-12 col-md-5 col-lg-4">
                            <input 
                                id="lastName" 
                                type="text" 
                                className="form-control" 
                                value={lastName}
                                onChange={this.handleLastNameChanged}
                            />
                            {(validation.lastName) && (
                                <small className="text-danger">{validation.lastName}</small>
                            )}
                        </div>
                    </div>
                    {currentUser.providerData[0].providerId !== 'facebook.com' && (
                        <div className="form-group row">
                            <label className="form-label col-xs-12 col-sm-12 col-md-3 col-lg-3"  htmlFor="email">Email</label>
                            <div className="col-xs-12 col-sm-12 col-md-5 col-lg-4">
                                <input 
                                    id="email" 
                                    type="email" 
                                    className="form-control" 
                                    value={email}
                                    onChange={this.handleEmailChanged}
                                />
                                {(validation.email) && (
                                    <small className="text-danger">{validation.email}</small>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="form-group row">
                        <label className="form-label col-xs-12 col-sm-12 col-md-3 col-lg-3"  htmlFor="firstName">Phone</label>
                        <div className="col-xs-12 col-sm-12 col-md-5 col-lg-4">
                            <input 
                                id="phone" 
                                type="text" 
                                className="form-control" 
                                value={phone}
                                onChange={this.handlePhoneChanged}
                            />
                            {(validation.phone) && (
                                <small className="text-danger">{validation.phone}</small>
                            )}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="form-label col-xs-12 col-sm-12 col-md-3 col-lg-3"  htmlFor="city">City</label>
                        <div className="col-xs-12 col-sm-12 col-md-5 col-lg-4">
                            <input 
                                id="city" 
                                type="text" 
                                className="form-control" 
                                value={city}
                                onChange={this.handleCityChanged}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="form-label col-xs-12 col-sm-12 col-md-3 col-lg-3"  htmlFor="state">State</label>
                        <div className="col-xs-12 col-sm-12 col-md-5 col-lg-4">
                            <select 
                                id="state" 
                                className="form-control" 
                                value={state}
                                onChange={this.handleStateChanged}
                            >
                                {this.renderStateOptions()}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-xs-12">
                            <button type="button"
                                    className="btn btn-template-outlined"
                                    onClick={this.handleUndoClicked}
                            >
                                <i className="fas fa-undo"></i>
                                Undo
                            </button>
                            <button type="button"
                                    className="btn btn-primary ml-1"
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
      setRedirectURL: (url) => dispatch({ type: 'SET_REDIRECT_URL', url: url }),
      resetRedirectURL: () => dispatch({ type: 'RESET_REDIRECT_URL' })
    };
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditor);