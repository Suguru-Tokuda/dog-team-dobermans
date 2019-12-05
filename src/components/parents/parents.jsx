import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Parents extends Component {
    state = {

    };

    componentDidMount() {

    }

    render() {
        return (
            <section class="hero hero-page gray-bg padding-small">
                <div class="container">
                    <div class="row d-flex">
                    <div class="col-lg-9 order-2 order-lg-1">
                        <h1>Our Dogs</h1><p class="lead text-muted"></p>
                    </div>
                    <div class="col-lg-3 text-right order-1 order-lg-2">
                        <ul class="breadcrumb justify-content-lg-end">
                        <li class="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li class="breadcrumb-item active">Our Dogs</li>
                        </ul>
                    </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Parents;