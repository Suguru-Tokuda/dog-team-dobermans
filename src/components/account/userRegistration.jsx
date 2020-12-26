import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import contactService from '../../services/contactService';
import validationService from '../../services/validationService';
import userService from '../../services/userService';
import toastr from 'toastr';

class UserRegistration extends Component {
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
        formSubmitted: false,
        dataLoaded: false
    };

    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        const { user } = this.props;
        let currentUser;

        if (user) {
            currentUser = user;
        }

        if (user && user.registrationCompleted) {
            this.props.history.push('/');
        }

        if (user && this.state.dataLoaded === false) {
            if (currentUser && currentUser.providerData && currentUser.providerData[0].providerId !== 'password') {
                this.setState({
                    selection: {
                        firstName: user.firstName ? user.firstName : '',
                        lastName: user.lastName ? user.lastName : '',
                        phone: user.phone ? user.phone : '',
                        city: user.city ? user.city : '',
                        state: user.state ? user.state : ''
                    }
                });
            } else {
                this.setState({
                    selection: {
                        firstName: user.firstName ? user.firstName : '',
                        lastName: user.lastName ? user.lastName : '',
                        email: user.email ? user.email : '',
                        phone: user.phone ? user.phone : '',
                        city: user.city ? user.city : '',
                        state: user.state ? user.state : ''
                    }
                });
            }

            this.setState({
                dataLoaded: true
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
            if (validationService.validateEmail(email) === true) {
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
            validation.state = 'Select state';
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

    getHeader() {
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-1">
                            <h1>User Registration</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    User Registration
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    handleSubmitBtnClicked = async () => {
        this.setState({ formSubmitted: true });

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

                    if (validationService.validateEmail(selection[key]) === true) {
                        validation[key] = '';
                    } else {
                        validation[key] = `Enter valid email`;
                        isValid = false;
                    }
                }
            } else {
                if (selection[key] === '') {
                    if (key !== 'state')
                        validation[key] = `Enter ${key}`;
                    else
                        validation[key] = 'Select state';
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
                await userService.editUser(data);
                
                if (user.currentUser.providerData[0].providerId === 'password') {
                    if (user.email.toLowerCase() !== email.trim().toLowerCase()) {
                        await user.currentUser.updateEmail(email.trim().toLowerCase());
                        await user.currentUser.sendEmailVerification();

                        toastr.success('Verification email has been sent. Please check your email to continue.');
                        user.email = email.trim().toLowerCase();
                    }
                }

                user.firstName = firstName;
                user.lastName = lastName;
                user.phone = phone;
                user.city = city;
                user.state = state;
                user.registrationCompleted = true;

                this.props.setUser(user);
            } catch (err) {
                console.log(err);
                toastr.error('There was an error in updating profile.');
            }

            this.props.doneLoading({ reset: true });

            toastr.success('User Registration Completed.');

            this.props.history.push('/');
        }
    }

    render() {
        const { user } = this.props;
        let currentUser;
        if (user) {
            currentUser = user.currentUser;
        }
        const { firstName, lastName, email, phone, city, state } = this.state.selection;
        const { validation, formSubmitted } = this.state;

        return (
            <React.Fragment>
                {this.getHeader()}
                <div className="container">
                    <div className="content-block" style={{ margin: '20px', color: 'gray' }}>
                        <div className="form-group row">
                            <label className="form-label col-xs-12 col-sm-12 col-md-3 col-lg-3" htmlFor="firstName">First Name</label>
                            <div className="col-xs-12 col-sm-12 col-md-5 col-lg-4">
                                <input 
                                    id="firstName" 
                                    type="text" 
                                    className={`form-control ${formSubmitted && validation.firstName ? 'error': ''}`} 
                                    value={firstName}
                                    onChange={this.handleFirstNameChanged}
                                />
                                {(validation.firstName) && (
                                    <small className="text-danger">{formSubmitted && validation.firstName}</small>
                                )}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="form-label col-xs-12 col-sm-12 col-md-3 col-lg-3"  htmlFor="lastName">Last Name</label>
                            <div className="col-xs-12 col-sm-12 col-md-5 col-lg-4">
                                <input 
                                    id="lastName" 
                                    type="text" 
                                    className={`form-control ${formSubmitted && validation.lastName ? 'error': ''}`} 
                                    value={lastName}
                                    onChange={this.handleLastNameChanged}
                                />
                                {(validation.lastName) && (
                                    <small className="text-danger">{formSubmitted && validation.lastName}</small>
                                )}
                            </div>
                        </div>
                        {currentUser && currentUser.providerData[0].providerId !== 'facebook.com' && (
                            <div className="form-group row">
                                <label className="form-label col-xs-12 col-sm-12 col-md-3 col-lg-3"  htmlFor="email">Email</label>
                                <div className="col-xs-12 col-sm-12 col-md-5 col-lg-4">
                                    <input 
                                        id="email" 
                                        type="email" 
                                        className={`form-control ${formSubmitted && validation.email ? 'error': ''}`} 
                                        value={email}
                                        readOnly
                                        onChange={this.handleEmailChanged}
                                    />
                                    {(validation.email) && (
                                        <small className="text-danger">{formSubmitted && validation.email}</small>
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
                                    className={`form-control ${formSubmitted && validation.phone ? 'error': ''}`} 
                                    value={phone}
                                    onChange={this.handlePhoneChanged}
                                />
                                {(validation.phone) && (
                                    <small className="text-danger">{formSubmitted && validation.phone}</small>
                                )}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="form-label col-xs-12 col-sm-12 col-md-3 col-lg-3" htmlFor="city">City</label>
                            <div className="col-xs-12 col-sm-12 col-md-5 col-lg-4">
                                <input 
                                    id="city" 
                                    type="text" 
                                    className={`form-control ${formSubmitted && validation.city ? 'error': ''}`} 
                                    value={city}
                                    onChange={this.handleCityChanged}
                                />
                                {(validation.phone) && (
                                    <small className="text-danger">{formSubmitted && validation.city}</small>
                                )}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="form-label col-xs-12 col-sm-12 col-md-3 col-lg-3"  htmlFor="state">State</label>
                            <div className="col-xs-12 col-sm-12 col-md-5 col-lg-4">
                                <select 
                                    id="state" 
                                    className={`form-control ${formSubmitted && validation.state ? 'error': ''}`} 
                                    value={state}
                                    onChange={this.handleStateChanged}
                                >
                                    <option value="">--Select State--</option>
                                    {this.renderStateOptions()}
                                </select>
                                {(validation.phone) && (
                                    <small className="text-danger">{formSubmitted && validation.state}</small>
                                )}
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-xs-12">
                                <button type="button"
                                        className="btn btn-primary ml-1"
                                        onClick={this.handleSubmitBtnClicked}
                                >
                                    Submit
                                </button>
                            </div>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(UserRegistration);