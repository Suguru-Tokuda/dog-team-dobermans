import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as siteLogo from '../../assets/img/site_logo.PNG';

export default class Footer extends Component {
    render() {
        return (
            <footer className="main-footer">
                <div className="main-block">
                    <div className="container">
                        <div className="row">
                            <div className="info col-lg-4">
                                <div className="logo">
                                    <img src={siteLogo} style={{ width: "179px", filter: "invert(90%)" }} alt={siteLogo}></img>
                                </div>
                            </div>
                            <div className="site-links col-lg-2 col-md-6">
                                <h5 className="text-uppercase">Site Map</h5>
                                <ul className="list-unstyled">
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/about-dobermans">About Dobermans</Link></li>
                                    <li><Link to="/our-dogs">Our Dogs</Link></li>
                                    <li><Link to="/puppies">Puppies</Link></li>
                                    <li><Link to="/blog">Blog</Link></li>
                                    <li><Link to="/testimonials">Testimonials</Link></li>
                                    <li><Link to="/about-us">About Us</Link></li>
                                    <li><Link to="/contact">Contact/Request a Puppy</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}