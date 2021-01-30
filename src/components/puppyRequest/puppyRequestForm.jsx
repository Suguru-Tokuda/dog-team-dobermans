import React, { Component } from 'react';
import { connect } from 'react-redux';
import LaddaButton, { S, SLIDE_LEFT } from 'react-ladda';
import ValidationService from '../../services/validationService';
import WaitListService from '../../services/waitListService';
import ConstantsService from '../../services/contactService';
import toastr from 'toastr';
import UtilService from '../../services/utilService';

class PuppyRequestForm extends Component {

    state = {
        selections: {
            firstName: '',
            lastName: '',
            email: '',
            confirmEmail: '',
            phone: '',
            city: '',
            state: '',
            message: '',
            color: '',
        },
        validations: {},
        formSubmitted: false,
        loading: false
    };

    componentDidMount() {
        const email = document.getElementById('email');
        const confirmEmail = document.getElementById('confirmEmail');

        email.onpaste = e => e.preventDefault();
        confirmEmail.onpaste = e => e.preventDefault();
    }

    handleSetFirstName = (event) => {
        const firstName = event.target.value;
        const { selections, validations } = this.state;
        if (firstName !== '') {
            delete validations.firstName;
        } else {
            validations.firstName = 'Enter first name';
        }
        selections.firstName = firstName;
        this.setState({ selections, validations });
    }

    handleSetLastName = (event) => {
        const lastName = event.target.value;
        const { selections, validations } = this.state;
        if (lastName !== '') {
            delete validations.lastName;
        } else {
            validations.lastName = 'Enter last Name';
        }
        selections.lastName = lastName;
        this.setState({ lastName, validations });
    }

    handleSetEmail = (event) => {
        const email = event.target.value;
        const { selections, validations } = this.state;
        if (email !== '') {
            delete validations.email;
            if (ValidationService.validateEmail(email) === true) {
                delete validations.email;
            } else {
                validations.email = 'Invalid email';
            }
        } else {
            validations.email = 'Enter email';
        }
        selections.email = email;
        this.setState({ selections, validations });
    }

    handleSetConfirmEmail = (event) => {
        const confirmEmail = event.target.value;
        const { selections, validations } = this.state;
        const { email } = selections;

        if (confirmEmail !== '') {
            delete validations.confirmEmail;
            if (email && email.toLowerCase() === confirmEmail.toLowerCase()) {
                delete validations.confirmEmail;
            } else {
                validations.confirmEmail = 'Email and confirm email does not match the email';
            }
        } else {
            validations.confirmEmail = 'Enter confirm email';
        }
        selections.confirmEmail = confirmEmail;
        this.setState({ selections, validations });
    }

    handleSetColor = (event) => {
        const color = event.target.value;
        const { selections, validations } = this.state;
        if (color !== '') {
            delete validations.color;
        } else {
            validations.type = 'Enter color';
        }
        selections.color = color;
        this.setState({ selections, validations });
    }

    handleSetPhone = (event) => {
        let phone = event.target.value;
        const { selections, validations } = this.state;

        if (phone.length > 0) {
            phone = phone.replace(/\D/g, '');

            phone = UtilService.formatPhoneNumber(phone);

            if (ValidationService.validatePhone(phone)) {
                delete validations.phone;
            } else {
                validations.phone = 'Enter valid phone number';
            }
        } else {
            validations.phone = 'Enter phone number';
        }
        // if (phone.length > 0) {
        //     phone = phone.replace(/\D/g, '');
        //     if (phone !== '') {
        //         delete validations.phone;
        //     } else {
        //         validations.phone = 'Enter phone';
        //     }
        // } else {
        //     validations.phone = 'Enter phone number';
        // }

        selections.phone = phone;
        this.setState({ selections, validations });
    }

    handleSetState = (event) => {
        const { selections, validations } = this.state;
        const state = event.target.value;
        if (state !== '') {
            delete validations.state;
        } else {
            validations.state = 'Select state';
        }
        selections.state = event.target.value;
        this.setState({ selections });
    }

    handleSetCity = (event) => {
        const { selections, validations } = this.state;
        const city = event.target.value;
        if (city !== '') {
            delete validations.city;
        } else {
            validations.city = 'Enter city';
        }
        selections.city = city;
        this.setState({ selections, validations });
    }

    getColorOptions() {
        const colors = ["Black & Tan", "Red", "Blue", "Fawn", "Black (Melanistic)"];
        return colors.map(color => <option value={color} key={color}>{color}</option>);
    }

    getTypeOptions() {
        const types = ["American", "European"];
        return types.map(type => <option value={type} key={type}>{type}</option>);
    }

    getStateOptions() {
        const states = ConstantsService.getStates();
        return states.map(state => <option value={state.abbreviation} key={state.abbreviation}>{`${state.abbreviation} - ${state.name}`}</option>);
    }

    getFormClass(key) {
        const { formSubmitted, validations } = this.state;
        return formSubmitted === true && typeof validations[key] !== 'undefined' && validations[key].length > 0 ? 'is-invalid' : '';
    }

    handleSetColor = (event) => {
        const color = event.target.value;
        const { selections, validations } = this.state;
        if (color !== '') {
            delete validations.color;
        } else {
            validations.type = 'Enter color';
        }
        selections.color = color;
        this.setState({ selections, validations });
    }

    handleSetMessage = (event) => {
        const message = event.target.value;
        const { selections, validations } = this.state;
        if (message !== '') {
            selections.message = message;
            delete validations.message;
        } else {
            validations.message = 'Enter message';
        }
        selections.message = message;
        this.setState({ selections, validations });
    }

    handleSubmitForm = (event) => {
        event.preventDefault();
        this.setState({ formSubmitted: true });
        const { selections, validations } = this.state;
        let isValid = true;
        const selectionKeys = Object.keys(selections);

        selectionKeys.forEach(key => {
            if ((selections[key] === '' || selections[key] === null) && key !== 'color') {
                isValid = false;
                if (key === 'color') {
                    validations[key] = `Select ${key}`;
                } else {
                    validations[key] = `Enter ${key}`;
                }
            } else {
                delete validations[key];
            }

            if (key === 'phone') {
                if (selections.phone.length > 0) {
                    if (ValidationService.validatePhone(selections.phone)) {
                        delete validations.phone;
                    } else {
                        validations.phone = 'Enter valid phone number';
                        isValid = false;
                    }
                } else {
                    isValid = false;
                    validations.phone = 'Enter phone number';
                }
            }

            if (key === 'email') {
                if (selections[key].length > 0) {
                    if (ValidationService.validateEmail(selections[key]) === true) {
                        delete validations[key];
                    } else {
                        isValid = false;
                        
                        validations[key] = 'Invalid email';
                    }
                }
            }

            if (key === 'confirmEmail') {
                if (selections.email && selections.confirmEmail) {
                    if (selections.email.toLowerCase() !== selections.confirmEmail.toLowerCase()) {
                        validations.confirmEmail = 'Email and confirm email do not match';
                        isValid = false;
                    } else {
                        delete validations.confirmEmail;
                    }
                }
            }
        });

        if (isValid === true) {
            const { firstName, lastName, email, phone, city, state, message, color } = selections;

            this.setState({ loading: true });

            const waitRequestData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                city: city,
                state: state,
                message: message,
                color: color,
            };

            this.props.showLoading({ reset: true, count: 1 });

            WaitListService.createWaitRequest(waitRequestData)
                .then(() => {
                    toastr.success('Request submitted!');

                    const selections = {
                        firstName: '',
                        lastName: '',
                        email: '',
                        confirmEmail: '',
                        phone: '',
                        city: '',
                        state: '',
                        message: '',
                        color: '',
                    };

                    this.setState({selections, formSubmitted: false });
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    this.setState({ loading: false });
                    this.props.doneLoading({ reset: true });
                });
        }
    }

    render() {
        const { selections, validations, loading, formSubmitted } = this.state;
        const { firstName, lastName, email, confirmEmail, phone, city, state, message, color } = selections;

        return (
            <section id="waitListForm">
                <div className="container">
                    <header className="mb-5">
                        <h2 className="heading-line">Doberman Puppy Wait List Form</h2>
                    </header>
                    <div className="row">
                        <div className="col-md-7">
                            <form noValidate className="custom-form form">
                                <div className="controls">
                                <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label htmlFor="firstName" className={`form-label`}>First Name *</label>
                                                <input type="text" name="firstName" id="firstName" placeholder="Enter your first name" className={`form-control ${this.getFormClass('firstName')}`} value={firstName} onChange={this.handleSetFirstName} />
                                                {formSubmitted === true && validations.firstName && (
                                                    <small className="text-danger">Enter first name</small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label htmlFor="lastName" className={`form-label`}>Last Name *</label>
                                                <input type="text" name="lastName" id="lastName" placeholder="Enter your last name" className={`form-control ${this.getFormClass('lastName')}`} value={lastName} onChange={this.handleSetLastName} />
                                                {formSubmitted === true && validations.lastName && (
                                                    <small className="text-danger">Enter last name</small>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label htmlFor="email" className={`form-label`}>Email *</label>
                                                <input type="text" name="email" id="email" placeholder="Enter your email" className={`form-control ${this.getFormClass('email')}`} value={email} onChange={this.handleSetEmail} />
                                                {formSubmitted === true && validations.email && (
                                                    <small className="text-danger">{validations.email}</small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label htmlFor="confirmEmail" className="form-label">Confirm Email *</label>
                                                <input type="text" name="confirmEmail" id="confirmEmail" placeholder="Enter confirm email" className={`form-control ${this.getFormClass('email')}`} value={confirmEmail} onChange={this.handleSetConfirmEmail} />
                                                {formSubmitted === true && validations.confirmEmail && (
                                                    <small className="text-danger">{validations.confirmEmail}</small>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label htmlFor="phone" className={`form-label`}>Phone number *</label>
                                                <input type="text" name="phone" id="phone" placeholder="Enter your phone number" className={`form-control ${this.getFormClass('phone')}`} value={phone} onChange={this.handleSetPhone} />
                                                {formSubmitted === true && validations.phone && (
                                                    <small className="text-danger">{validations.phone}</small>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label htmlFor="city" className="form-label">City *</label>
                                                <input type="text" name="city" id="city" placeholder="Enter city" className={`form-control ${this.getFormClass('city')}`} value={city} onChange={this.handleSetCity} />
                                                {formSubmitted === true && validations.city && (
                                                    <small className="text-danger">{validations.city}</small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label htmlFor="state" className="form-label">State *</label>
                                                <select className={`form-control ${this.getFormClass('state')}`} value={state} onChange={this.handleSetState}>
                                                    <option value="">--Select State --</option>
                                                    {this.getStateOptions()}
                                                </select>
                                                {formSubmitted === true && validations.state && (
                                                    <small className="text-danger">{validations.state}</small>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <label htmlFor="color" className={`form-label`}>Color</label>
                                            <select className={`form-control`} name="color" id="color" style={{ height: '50px' }} value={color} onChange={this.handleSetColor}>
                                                <option value="">--Select color for puppy--</option>
                                                {this.getColorOptions()}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group mt-5">
                                        <label htmlFor="message" className={`form-label`}>Message for us *</label>
                                        <textarea row="4" className={`form-control ${this.getFormClass('message')}`} placehodler="Enter your message" value={message} onChange={this.handleSetMessage}></textarea>
                                        {formSubmitted === true && validations.message && (
                                            <small className="text-danger">{validations.message}</small>
                                        )}
                                    </div>
                                    <LaddaButton className="btn btn-primary" loading={loading} onClick={this.handleSubmitForm} data-size={S} data-style={SLIDE_LEFT}>Send Request</LaddaButton>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-5">
                            <p>If you'd like to send a request us for a Doberman puppy, please fill out the form. When we have puppies that match your preferences, we will contact you.</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated
});

const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch({ type: 'SIGN_IN' }),
        setUser: (user) => dispatch({ type: 'SET_USER', user: user }),
        showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
        doneLoading: () => dispatch({ type: 'DONE_LOADING' })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PuppyRequestForm);