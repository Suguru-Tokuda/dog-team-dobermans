import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Topnavbar extends Component {

    render() {
        return(
            <header className="header">
                <nav className="navbar navbar-expand-lg">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/" exact>Logo</Link>
                        <button type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation" className="navbar-toggler navbar-toggler-right"><i className="fa fa-bars"></i></button>
                        <div id="navbarCollapse" className="collapse navbar-collapse">
                            <ul className="navbar-nav mx-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Puppies</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Parents</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Farm</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Contact</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}