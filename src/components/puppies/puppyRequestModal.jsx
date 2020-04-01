import React, { Component } from 'react';
import LaddaButton, { S, SLIDE_LEFT } from 'react-ladda';
import ValidationService from '../../services/validationService';
import WaitListService from '../../services/waitListService';
import ConstantsService from '../../services/contactService';
import DatePicker from 'react-datepicker';
import toastr from 'toastr';
import $ from 'jquery';

export default class PuppyRequestModal extends Component {
    state = {
        puppyData: {},
        selections: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            city: '',
            state: '',
            message: '',
            expectedPurchaseDate: null
        },
        validations: {},
        formSubmitted: false,
        loading: false
    }

    constructor(props) {
        super(props);
        this.state.puppyData = props.puppyData;
    }

    getFormClass(key) {
        const { formSubmitted, validations } = this.state;
        return formSubmitted === true && typeof validations[key] !== 'undefined' && validations[key].length > 0 ? 'is-invalid' : '';
    }

    getStateOptions() {
        const states = ConstantsService.getStates();
        return states.map(state => <option value={state.abbreviation} key={state.abbreviation}>{`${state.abbreviation} - ${state.name}`}</option>);
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

    handleSetPhone = (event) => {
        let phone = event.target.value;
        const { selections, validations } = this.state;
        if (phone.length > 0) {
            phone = phone.replace(/\D/g, '');
            if (phone !== '') {
                delete validations.phone;
            } else {
                validations.phone = 'Enter phone';
            }
        } else {
            validations.phone = 'Enter phone number';
        }
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

    handleSelectExpectedPurchaseDate = (expectedPurchaseDate) => {
        const { selections, validations } = this.state;
        selections.expectedPurchaseDate = expectedPurchaseDate;
        if (expectedPurchaseDate !== null) {
            validations.expectedPurchaseDate = '';
        } else {
            validations.expectedPurchaseDate = 'Enter expected purchase date';
        }
        this.setState({ selections, validations });
    }

    handleCancelBtnClicked = () => {
        $('#puppyRequestModal').modal('hide');
    }

    handleSubmitForm = (e) => {
        e.preventDefault();
        this.setState({ formSubmitted: true });
        const { puppyData, selections, validations } = this.state;
        let isValid = true;
        const selectionKeys = Object.keys(selections);
        for (const key of selectionKeys) {
            if ((selections[key] === '' || selections[key] === null)) {
                isValid = false;
                if (key !== 'expectedPurchaseDate') {
                    validations[key] = `Enter ${key}`;
                } else {
                    validations[key] = `Enter expected purchase date`;
                }
            } else {
                delete validations[key];
            }
        }
        console.log(validations);
        if (isValid === true) {
            const { firstName, lastName, email, phone, city, state, message, expectedPurchaseDate } = selections;
            const { puppyID } = puppyData;
            this.setState({ loading: true });
            const waitRequest = {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim().toLowerCase(),
                phone: phone,
                message: message.trim(),
                city: city.trim(),
                state: state,
                puppyID: puppyID,
                created: new Date(),
                color: puppyData.color,
                notified: null,
                expectedPurchaseDate: expectedPurchaseDate
            };
            WaitListService.createWaitRequest(waitRequest)
                .then(() => {
                    toastr.success('The inquiry was successfuly sent. We will get back to you within a couple business days.');
                    this.setState({
                        selections: {
                            firstName: '',
                            lastName: '',
                            email: '',
                            phone: '',
                            city: '',
                            state: '',
                            message: '',
                            expectedPurchaseDate: null
                        },
                        validations: {},
                        formSubmitted: false,
                    });
                    $('#puppyRequestModal').modal('hide');
                })
                .catch(err => {
                    toastr.error('There was an error in creating an inquiry');
                })
                .finally(() => {
                    this.setState({ loading: false });
                });
        }
    }

    render() {
        const { puppyData, selections, validations, formSubmitted, loading } = this.state;
        const { firstName, lastName, email, phone, city, state, message, expectedPurchaseDate } = selections;
        return (
            <div className="modal fade" id="puppyRequestModal" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <form noValidate className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Puppy Request Form</h5>
                        </div>
                        <div className="modal-body">
                            <div className="custo-form form">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="table-responsive">
                                            <table className="table table-borderless">
                                                <tbody>
                                                    <tr>
                                                        <th>Name</th>
                                                        <td>{puppyData.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Color</th>
                                                        <td>{puppyData.color}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Type</th>
                                                        <td>{puppyData.type}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Price</th>
                                                        <td>{`$${parseFloat(puppyData.price)}`}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
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
                                        <label className="form-label">Expected Purchase Date *</label><br/>
                                        <DatePicker className={`form-control ${this.getFormClass('expectedPurchaseDate')}`} selected={expectedPurchaseDate} onChange={this.handleSelectExpectedPurchaseDate} minDate={new Date()} />
                                        <br />{formSubmitted === true && validations.expectedPurchaseDate && (<small className="text-danger">{validations.expectedPurchaseDate}</small>)}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message" className={`form-label`}>Your message for us *</label>
                                    <textarea row="4" className={`form-control ${this.getFormClass('message')}`} placehodler="Enter your message" value={message} onChange={this.handleSetMessage}></textarea>
                                    {formSubmitted === true && validations.message && (
                                        <small className="text-danger">{validations.message}</small>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <LaddaButton className="btn btn-primary" loading={loading} onClick={this.handleSubmitForm} data-size={S} data-style={SLIDE_LEFT}>Send Inquiry</LaddaButton>
                            <button type="button" className="btn btn-secondary" onClick={this.handleCancelBtnClicked}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

}