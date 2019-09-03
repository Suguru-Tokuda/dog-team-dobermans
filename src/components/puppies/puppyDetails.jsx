import React, { Component } from 'react';
import { throwStatement } from '@babel/types';

class PuppyDetails extends Component {
    state = {
        description: '',
        dateOfBirth: null,
        name: '',
        color: '',
        parentId: 0,
        puppyId: 0,
        imageUrls: []
    };

    componentDidMount() {

    }

    getHeader() {
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-1">
                            <h1>{this.state.name}</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">

                        </div>
                    </div>
                </div>
            </section>
        )
    }

    getCarousel() {
        if (this.state.imageUrls.length > 0) {
            const images = this.state.imageUrls.map(imageUrl => {
                <div className="owl-stage-outer">
                    <div className="owl-item" style={{width: "690px"}}>
                        <div className="item">
                            <img src={imageUrl} />
                        </div>
                    </div>
                </div>
            });
            return (
                <div className="product-images col-lg-6">
                    <div data-slider-id="1" className="owl-carousel items-slider owl-drag owl-loaded">
                        <div className="owl-stage">
                            {images}                                    
                        </div>
                    </div>
                </div>
            )
        } else {
            return null;
        }
    }

    getDescription() {
        if (this.state.description !== '') {
            return (
                <div className="details col-lg-6">
                    <p>{this.state.description}</p>
                </div>
            )
        }
    }

    getDetails() {
        if (this.state.description !== '') {
            return (
                <section className="product-description no-padding">
                    <div className="container">
                        
                    </div>
                </section>
            )
        }
    }

    render() {
        return null;
    }
}