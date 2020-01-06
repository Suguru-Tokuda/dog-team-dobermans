import React, { Component } from 'react';
import LaddaButton, { S, SLIDE_LEFT } from 'react-ladda';
import ValidationService from '../../services/validationService';
import WaitListService from '../../services/waitListService';
import toastr from 'toastr';

class WaitListForm extends Component {
    state = {
        selections: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            message: '',
            color: '',
        },
        validations: {},
        formSubmitted: false,
        loading: false
    };

    getColorOptions() {
        const colors = ["Black & Tan", "Red", "Blue", "Fawn", "Black (Melanistic)"];
        return colors.map(color => <option value={color} key={color}>{color}</option>);
    }

    getTypeOptions() {
        const types = ["American", "European"];
        return types.map(type => <option value={type} key={type}>{type}</option>);
    }


    getFormClass(key) {
        const { formSubmitted, validations } = this.state;
        return formSubmitted === true && typeof validations[key] !== 'undefined' && validations[key].length > 0 ? 'is-invalid' : '';
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
            if (selections[key] === '') {
                isValid = false;
                if (key === 'color')
                    validations[key] = `Select ${key}`;
                else
                    validations[key] = `Enter ${key}`;
            } else {
                delete validations[key];
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
        });
        if (isValid === true) {
            const { firstName, lastName, email, phone, message, color } = selections;
            this.setState({ loading: true });
            WaitListService.createWaitRequest(firstName, lastName, email.toLowerCase(), phone, message, color, new Date())
                .then(() => {
                    toastr.success('Request submitted!');
                    const selections = {
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
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
                });
        }
    }

    render() {
        const { selections, validations, loading, formSubmitted } = this.state;
        const { firstName, lastName, email, phone, message, color } = selections;
        return (
            <section>
                <div className="container">
                    <header className="mb-5">
                        <h2 className="heading-line">Wait list form</h2>
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
                                            <label htmlFor="color" className={`form-label`}>Color *</label>
                                            <select className={`form-control ${this.getFormClass('color')}`} name="color" id="color" value={color} onChange={this.handleSetColor}>
                                                <option>--Select color for puppy--</option>
                                                {this.getColorOptions()}
                                            </select>
                                            {formSubmitted === true && validations.color && (
                                                    <small className="text-danger">{validations.color}</small>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="message" className={`form-label`}>Your message for us *</label>
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
                            <p>If you'd like to send a request us for a puppy, please fill out the form. When we have puppies with the color you pick and any other preference, we will contact you.</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default WaitListForm;