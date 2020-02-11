import React, { Component } from 'react';
import LaddaButton, { S, SLIDE_LEFT } from 'react-ladda';
import ImageCropModal from '../common/imageCropModal';
import TestimonialService from '../../services/testimonialService';
import ValidationService from '../../services/validationService';
import $ from 'jquery';
import toastr from 'toastr';

class TestimonialForm extends Component {
    state = {
        selections: {
            firstName: '',
            lastName: '',
            dogName: '',
            email: '',
            message: '',
            picture: null
        },
        tempImageFile: null,
        imageURL: '',
        validations: {},
        formSubmitted: false,
        loading: false
    };

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
            validations.lastName = 'Enter last name';
        }
        selections.lastName = lastName;
        this.setState({ lastName, validations });
    }

    handleSetDogName = (event) => {
        const dogName = event.target.value;
        const { selections, validations } = this.state;
        if (dogName !== '') {
            delete validations.dogName;
        } else {
            validations.dogName = 'Enter dog\'s name';
        }
        selections.dogName = dogName;
        this.setState({ dogName, validations });
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

    handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            this.setState({ tempImageFile: event.target.files[0] });
        }
        $('#picture-upload').val(null);
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

    handleFinishImageCropping = (newFile) => {
        const { selections } = this.state;
        selections.picture = newFile;
        const newImageURL = URL.createObjectURL(newFile);
        const { imageURL } = this.state;
        if (imageURL !== '') {
            URL.revokeObjectURL(imageURL);
        }
        this.setState({ selections, imageURL: newImageURL });
    }

    handleResetTempPictureFile = () => {
        this.setState({ tempImageFile: null });
    }

    handleSubmitForm = async (event) => {
        event.preventDefault();
        this.setState({ formSubmitted: true });
        const { selections, validations } = this.state;
        let isValid = true;
        const selectionKeys = Object.keys(selections);
        selectionKeys.forEach(key => {
            if ((selections[key] === '' || selections[key] === null) && key !== 'picture') {
                isValid = false;
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
            const { firstName, lastName, dogName, email, message, picture } = selections;
            this.setState({ loading: true });
            let image = null;
            if (picture !== null) {
                try {
                    image = await TestimonialService.uploadPicture(picture, dogName);
                } catch (err) {
                    console.log(err);
                }
            }
            TestimonialService.createTestimonial(firstName, lastName, dogName, email.toLowerCase(), message, image, new Date())
                .then(() => {
                    toastr.success('Thanks for submitting a testimonial! We will review it within a coule business days.');
                    const selections = {
                        firstName: '',
                        lastName: '',
                        dogName: '',
                        email: '',
                        message: '',
                        picture: null
                    };
                    const { imageURL } = this.state;
                    URL.revokeObjectURL(imageURL); // Revoke the URL before erase it.
                    this.setState({ selections: selections, tempImageFile: null, imageURL: '', validations: {}, formSubmitted: false });
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    this.setState({ loading: false });
                });
        } else {
            this.setState({ validations });
        }
    }

    render() {
        const { selections, tempImageFile, imageURL, validations, loading, formSubmitted } = this.state;
        const { firstName, lastName, dogName, email, message } = selections;
        return (
            <React.Fragment>
                <section id="testimonialForm">
                    <header><h2 className="heading-line">Testimonial form</h2></header>
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
                                                <label htmlFor="dogName" className={`form-label`}>Dog Name *</label>
                                                <input type="text" name="dogName" id="dogName" placeholder="Enter your dog's name" className={`form-control ${this.getFormClass('dogName')}`} value={dogName} onChange={this.handleSetDogName} />
                                                {formSubmitted === true && validations.dogName && (
                                                    <small className="text-danger">Enter your dog's name</small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label htmlFor="email" className={`form-label`}>Email *</label>
                                                <input type="email" name="email" id="email" placeholder="Enter email" className={`form-control ${this.getFormClass('email')}`} value={email} onChange={this.handleSetEmail} />
                                                {formSubmitted === true && validations.email && (
                                                    <small className="text-danger">{validations.email}</small>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <label>Picture of your dog (optional)</label><br />
                                            <label htmlFor="picture-upload" className="btn btn-primary">
                                                <i className="fa fa-picture-o"></i> Select
                                            </label>
                                            <input id="picture-upload" type="file" accept="image/*" onChange={this.handleImageChange} />
                                        </div>
                                        {imageURL !== '' && (
                                            <div className="col-sm-6">
                                                <img className="img-fluid rounded-circle" src={imageURL} alt={imageURL} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="message" className={`form-label`}>Your message for us *</label>
                                        <textarea row="4" className={`form-control ${this.getFormClass('message')}`} placehodler="Enter your message" value={message} onChange={this.handleSetMessage}></textarea>
                                        {formSubmitted === true && validations.message && (
                                            <small className="text-danger">{validations.message}</small>
                                        )}
                                    </div>
                                    <LaddaButton className="btn btn-primary" loading={loading} onClick={this.handleSubmitForm} data-size={S} data-style={SLIDE_LEFT}>Send Testimonial</LaddaButton>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-5">
                            <p>Please submit your experience with Dog Team Dobermans. We appreciate your opinion about our Doberman puppies and share your thoughts with others.</p>
                        </div>
                    </div>
                </section>
                <ImageCropModal 
                aspect={1/1}
                imageFile={tempImageFile} 
                onFinishImageCropping={this.handleFinishImageCropping.bind(this)}
                onResetTempPictureFile={this.handleResetTempPictureFile} 
                />
            </React.Fragment>
        );
    }
}

export default TestimonialForm;