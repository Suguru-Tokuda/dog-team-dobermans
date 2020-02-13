import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ContactService from '../../services/contactService';
import UtilService from '../../services/utilService';
import WaitListForm from './waitListForm';
import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';
import * as api from '../../api.json';
import $ from 'jquery';

function Map() {
    return <GoogleMap defaultZoom={12} defaultCenter={{ lat: 39.891180, lng: -89.854590 }} ><Marker position={{ lat: 39.891180, lng: -89.854590 }} /></GoogleMap>;
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

class ContactuUs extends Component {
    state = {
        city: '',
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        state: '',
        street: '',
        zip: ''
    };

    componentDidMount() {
        window.scrollTo(0, 0);
        ContactService.getContact()
            .then(res => {
                const contactInfo = res.data;
                this.setState({
                    city: contactInfo.city,
                    email: contactInfo.email,
                    firstName: contactInfo.firstName,
                    lastName: contactInfo.lastName,
                    phone: contactInfo.phone,
                    state: contactInfo.state,
                    street: contactInfo.street,
                    zip: contactInfo.zip
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    getHeader() {
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-1">
                            <h1>Contact / Request a Puppy</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    Contact
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    getMain() {
        const { city, email, phone, state, street, zip } = this.state;
        if (city !== '' && email !== '' && phone !== '' && state !== '' && street !== '' && zip !== '') {
            return (
                <section className="contact">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="contact-icon">
                                    <i className="far fa-map"></i>
                                </div>
                                <h3>Address</h3>
                                <p>{street}<br/>{city} {state}<br/>{zip}</p>
                            </div>
                            <div className="col-md-3">
                                <div className="contact-icon">
                                    <i className="fa fa-phone"></i>
                                </div>
                                <h3>Phone</h3>
                                <p>You may contact us Monday-Saturday from 9am - 6pm</p>
                                <p><strong><a href={`tel:${phone}`}>{UtilService.formatPhoneNumber(phone)}</a></strong></p>

                            </div>
                            <div className="col-md-3">
                            <div className="contact-icon">
                                <i className="far fa-envelope"></i>
                            </div>
                            <h3>Email</h3>
                            <p>Please feel free to contact us regarding Doberman puppies.</p>
                            <p><strong><a href={`mailto:${email}`}>{email}</a></strong></p>
                            </div>
                            <div className="col-md-3">
                                <div className="contact-icon">
                                    <i className="fas fa-dog"></i>
                                </div>
                                <h3>Request</h3>
                                <p>Please <a style={{color: 'purple', cursor: 'pointer'}} onClick={this.handleToNavigateToTheForm}>click here</a> to scroll to the bottom of this page to request that you be added to our wait list</p>
                            </div>
                        </div>
                    </div>
                </section>
            );
        } else {
            return null;
        }
    }

    getMap() {
        return (
            <div style={{width: '100vw', height: '50vh'}}>
                <WrappedMap 
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${api.Gmap_API_KEY}`}
                    loadingElement={<div style={{ height: '100%'}} />}
                    containerElement={<div style={{ height: '100%'}} />}
                    mapElement={<div style={{ height: '100%'}} />}
                />
            </div>
        );
    }

    handleToNavigateToTheForm = () => {
        $(document).ready(() => {
            $('html, body').animate({
                scrollTop: $('#waitListForm').offset().top
            }, 1000)
        });
    }

    render() {
        return (
            <React.Fragment>
                {this.getHeader()}
                {this.getMain()}
                {this.getMap()}
                <WaitListForm />
            </React.Fragment>
        )
    }

}

export default ContactuUs;