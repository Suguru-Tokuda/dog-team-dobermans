import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Topnavbar extends Component {
    render() {
        return(
            <header className="header">
                <nav className="navbar navbar-expand-lg fixed-top">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/">Logo</Link>
                        <button type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation" className="navbar-toggler navbar-toggler-right"><i className="fa fa-bars"></i></button>
                        <div id="navbarCollapse" className="collapse navbar-collapse">
                            <ul className="navbar-nav mx-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/our-dogs">Our Dogs</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/puppies">Puppies</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/about-us">About us</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/contact-us">Contact us</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}