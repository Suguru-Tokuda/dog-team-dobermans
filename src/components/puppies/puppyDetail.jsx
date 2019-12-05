import React, { Component } from 'react';

class PuppyDetail extends Component {
    state = {
        description: '',
        dateOfBirth: null,
        name: '',
        color: '',
        dadID: 0,
        momID: 0,
        puppyID: 0,
        pictures: []
    };

    componentDidMount() {

    }

    getHeader() {
        const { name } = this.state;
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-1">
                            <h1>{name}</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">

                        </div>
                    </div>
                </div>
            </section>
        );
    }

    getCarousel() {
        const { pictures } = this.state;
        if (pictures.length > 0) {
            const images = pictures.map((picture, i) => {
                <div key={`picture-${i}`} className="owl-stage-outer">
                    <div className="owl-item" style={{width: "690px"}}>
                        <div className="item">
                            <img src={picture.url} alt={picture.reference} />
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
            );
        } else {
            return null;
        }
    }

    getDescription() {
        const { description } = this.state;
        if (description !== '') {
            return (
                <div className="details col-lg-6">
                    <p>{description}</p>
                </div>
            );
        }
    }

    getDetails() {
        const { description } = this.state;
        if (description !== '') {
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

export default PuppyDetail;