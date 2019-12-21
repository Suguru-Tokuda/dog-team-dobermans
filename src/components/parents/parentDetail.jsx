import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PageNotFound from '../common/pageNotFound';
import ParentService from '../../services/parentService';
import moment from 'moment';
import $ from 'jquery';

class ParentDetail extends Component {
    state = {
        description: '',
        dateOfBirth: null,
        name: '',
        weight: 0,
        color: '',
        sex: '',
        parentID: 0,
        pictures: [],
        pageLoaded: false,
        parentFound: false
    };

    constructor(props) {
        super(props);
        const parentID = props.match.params.parentID;
        if (parentID.length === 0) {
            this.state.parentFound = false;
        } else {
            this.state.parentID = parentID;
        }
    }

    componentDidMount() {
        const { parentID } = this.state;
        ParentService.getParent(parentID)
            .then(res => {
                if (Object.keys(res.data).length === 0) {
                    this.setState({ parentFound: false });
                } else {
                    const parentData = res.data;
                    this.setState({
                        name: parentData.name,
                        description: parentData.description,
                        color: parentData.color,
                        sex: parentData.sex,
                        type: parentData.type,
                        weight: parentData.weight,
                        dateOfBirth: parentData.dateOfBirth,
                        pictures: parentData.pictures
                    });
                    this.setState({ parentFound: true });
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.setState({ pageLoaded: true });
            });
    }

    componentDidUpdate() {
        $(document).ready(function(){
            $('.owl-carousel').owlCarousel({
                items: 1,
                thumbs: true,
                thumbsPrerendered: true,
                dots: false
            });
        });
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
                                    <Link to="/our-dogs">Our dogs</Link>
                                </li>
                                {name !== '' && (
                                    <li className="breadcrumb-item active">
                                        {name}
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    getDetailsSection() {
        const { name, description } = this.state;
        return (
            <section className="product-details">
                <div className="container">
                    <div className="row">
                        <div className="product-images col-lg-6">
                            {this.getImageCarousel()}
                        </div>
                        <div className="details col-lg-6">
                            <div className="d-flex align-items-center justify-content-between flex-column flex-sm-row">
                                <ul className="price list-inline no-margin">
                                    <li className="list-inline-item">{name}</li>
                                </ul>
                            </div>
                            <p>{description}</p>
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
                return (
                    <div key={`picture-${i}`} className="item">
                        <img src={picture.url} alt={picture.reference} />
                    </div>
                );
            });
            const thumbs = pictures.map((picture, i) => {
                return (
                    <button key={`thumb-item-${i}`} className="owl-thumb-item"><img src={picture.url} alt={picture.reference} /></button>
                );
            })
            return (
                <React.Fragment>
                    <div data-slider-id="1" className="owl-carousel">
                        {images}                                    
                    </div>
                    <div data-slider-id="1" className="owl-thumbs">
                        {thumbs}
                    </div>
                </React.Fragment> 
            );
        } else {
            return null;
        }
    }

    getAdditionalInfoSection() {
        const { description, dateOfBirth, color, sex, type, weight } = this.state;
        if (description !== '') {
            return (
                <section className="product-description no-padding">
                    <div className="container">
                        <ul role="tablist" className="nav nav-tabs flex-column flex-sm-row">
                            <li className="nav-item">
                                <a data-toggle="tab" href="#description" role="tab" className="nav-link active">Description</a>
                            </li>
                            <li className="nav-item">
                                <a data-toggle="tab" href="#additional-information" role="tab" className="nav-link">Additional Information</a>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div id="description" role="tabpanel" className="tab-pane active"><p>{description}</p></div>
                            <div id="additional-information" role="tabpanel" className="tab-pane">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th className="border-0">Date of birth</th>
                                            <td className="border-0">{moment(dateOfBirth).format('MM/DD/YYYY')}</td>
                                        </tr>
                                        <tr>
                                            <th>Color</th>
                                            <td>{color}</td>
                                        </tr>
                                        <tr>
                                            <th>Weight (lbs)</th>
                                            <td>{weight}</td>
                                        </tr>
                                        <tr>
                                            <th>Sex</th>
                                            <td>{`${sex.substring(0, 1).toUpperCase()}${sex.substring(1, sex.length).toLowerCase()}`}</td>
                                        </tr>
                                        <tr>
                                            <th>Type</th>
                                            <td>{`${type.substring(0, 1).toUpperCase()}${type.substring(1, type.length).toLowerCase()}`}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            )
        }
    }

    render() {
        const { parentFound, pageLoaded } = this.state;
        if (parentFound === true && pageLoaded === true) {
            return (
                <React.Fragment>
                    {this.getHeader()}
                    {this.getDetailsSection()}
                    {this.getAdditionalInfoSection()}
                </React.Fragment>
            )
        } else if (parentFound === false && pageLoaded === true) {
            return <PageNotFound />;
        } else if (pageLoaded === false) {
            return (
                <React.Fragment>
                    {this.getHeader()}
                    <div style={{marginTop: '700px'}}></div>
                </React.Fragment>
            );
        }
    }
}

export default ParentDetail;