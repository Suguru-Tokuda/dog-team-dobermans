import React, { Component } from 'react';
import moment from 'moment';
import PuppyService from '../../services/puppyService';

class PuppyDetail extends Component {
    state = {
        description: '',
        dateOfBirth: null,
        name: '',
        price: 0,
        color: '',
        weight: 0,
        dadID: 0,
        momID: 0,
        puppyID: 0,
        pictures: {}
    };

    constructor(props) {
        
    }

    componentDidMount() {
        PuppyService.getPuppyDetail()
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
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link to="/puppiess">Puppies</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    {name}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    getImageCarousel() {
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

    getDetailsSection() {
        const { name, descripton, price } = this.state;
        return (
            <section className="product-details">
                <div className="row">
                    <div className="product-images col-lg-6">
                        {this.getImageCarousel()}
                    </div>
                    <div className="details col-lg-6">
                        <div className="d-flex align-items-center justify-content-between flex-column flex-sm-row">
                            <ul className="price list-inline no-margin">
                                <li className="list-inline-item">{name}</li>
                                <li className="list-inline-item current">{`$${price}`}</li>
                            </ul>
                        </div>
                        <p>{descripton}</p>
                    </div>
                </div>
            </section>
        );
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

    getAdditionalInfoSection() {
        const { description, dateOfBirth, color, weight, parents } = this.state;
        const { dad, mom } = parents;
        if (description !== '') {
            return (
                <section className="product-description no-padding">
                    <div className="container">
                        <ul role="tablist" className="nav nav-tabs flex-column flex-sm-row">
                            <li className="nav-item">
                                <a data-toggle="tab" href="#description" role="tab" className="nav-link">Description</a>
                            </li>
                            <li className="nav-item">
                                <a data-toggle="tab" href="#additional-information" role="tab" className="nav-link">Additional Information</a>
                            </li>
                            <li className="nav-item">
                                <a data-toggle="tab" href="#parents" role="tab" className="nav-link">Parents</a>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div id="description" role="tabpanel" className="tab-pane"><p>{description}</p></div>
                            <div id="additional-information" role="tabpanel" className="tab-pane">
                                <table className="table">
                                    <tr>
                                        <th>Date of birth</th>
                                        <tr>{moment(dateOfBirth).format('MM/DD/YYYY')}</tr>
                                    </tr>
                                    <tr>
                                        <th>Color</th>
                                        <tr>{color}</tr>
                                    </tr>
                                    <tr>
                                        <th>Weight (lbs)</th>
                                        <th>{weight}</th>
                                    </tr>
                                </table>
                            </div>
                            <div id="parents" role="tabpanel" className="tab-pane">
                                <table className="table">
                                    <tr>
                                        <th>Dad</th>
                                        <td>
                                            <table className="table table-borderless">
                                                <tr>
                                                    <th>Name</th>
                                                    <td>{dad.name}</td>
                                                </tr>
                                                <tr>
                                                    <th>Color</th>
                                                    <td>{dad.color}</td>
                                                </tr>
                                                <tr>
                                                    <th>Weight (lbs)</th>
                                                    <td>{dad.weight}</td>
                                                </tr>
                                                <tr>
                                                    <th>Picture</th>
                                                    <td>
                                                        <img src={dad.picture.url} atl={dad.picture.reference} />
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Momo</th>
                                        <td>
                                            <table className="table table-borderless">
                                                <tr>
                                                    <th>Name</th>
                                                    <td>{mom.name}</td>
                                                </tr>
                                                <tr>
                                                    <th>Color</th>
                                                    <td>{mom.color}</td>
                                                </tr>
                                                <tr>
                                                    <th>Weight (lbs)</th>
                                                    <td>{mom.weight}</td>
                                                </tr>
                                                <tr>
                                                    <th>Picture</th>
                                                    <td>
                                                        <img src={mom.picture.url} atl={mom.picture.reference} />
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            );
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.getHeader()}
                {this.getDetailsSection()}
                {this.getAdditionalInfoSection()}
            </React.Fragment>
        );
    }
}

export default PuppyDetail;