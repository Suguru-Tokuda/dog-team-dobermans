import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import PuppyRequestModal from './puppyRequestModal';
import PageNotFound from '../common/pageNotFound';
import PuppyService from '../../services/puppyService';
import $ from 'jquery';
import toastr from 'toastr';

class PuppyDetail extends Component {
    state = {
        puppyData: {},
        description: '',
        dateOfBirth: null,
        name: '',
        price: 0,
        paidAmount: 0,
        color: '',
        weight: 0,
        gender: '',
        type: '',
        dadID: 0,
        momID: 0,
        puppyID: 0,
        pictures: [],
        parents: {},
        sold: false,
        pageLoaded: false,
        puppyFound: false
    };

    constructor(props) {
        super(props);
        const puppyID = props.match.params.puppyID;
        if (puppyID.length === 0) {
            this.state.puppyFound = false;
        } else {
            this.state.puppyID = puppyID;
        }
    }

    componentDidMount() {
        const { puppyID } = this.state;
        window.scrollTo(0, 0);
        this.props.showLoading({ reset: true, count: 1});
        PuppyService.getPuppy(puppyID)
            .then(res => {
                if (Object.keys(res.data).length === 0) {
                    this.setState({ puppyFound: false });
                } else {
                    const puppyData = res.data;
                    const parents = {
                        dad: puppyData.dad,
                        mom: puppyData.mom
                    };

                    this.setState({
                        puppyData: puppyData,
                        name: puppyData.name,
                        description: puppyData.description,
                        dateOfBirth: puppyData.dateOfBirth,
                        price: puppyData.price,
                        paidAmount: puppyData.paidAmount,
                        color: puppyData.color,
                        weight: puppyData.weight,
                        gender: puppyData.gender,
                        type: puppyData.type,
                        dadID: puppyData.dadID,
                        momID: puppyData.momID,
                        pictures: puppyData.pictures,
                        parents: parents,
                        sold: puppyData.sold,
                        puppyFound: true
                    });
                }
            })
            .catch(err => {
                toastr.error('There was an error in loading puppy data');
                this.setState({ puppyFound: false });
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
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

    handleResendVerificationEmailBtnClicked = () => {
        const { currentUser } = this.props.user;

        if (currentUser && currentUser.sendEmailVerification) {
            this.props.showLoading({ reset: true, count: 1 });

            currentUser.sendEmailVerification({ url: window.location.href })
                .then(res => {
                    this.setState({ emailVerificationConfirmationMsg: 'Verification Email has been sent. Please check your email and click the link to continue using the site.' });
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    this.props.doneLoading({ reset: true });
                });
        }
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
                                    <Link to="/puppies">Puppies</Link>
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
            return (
                <p className="text-center">
                    <i className="fa fa-photo" style={{fontSize: '100px'}}></i>
                    {' '}
                    <i className="fa fa-ban" style={{fontSize: '50px'}}></i>
                </p>
            );
        }
    }

    getDetailsSection() {
        const { name, description, price, paidAmount, sold } = this.state;
        const { authenticated, user } = this.props;

        console.log(sold);

        return (
            <section className="product-details">
                <div className="container">
                    <div className="row">
                        <div className="product-images col-lg-6">
                            {paidAmount > 0 && paidAmount === price && ( 
                                <div className="ribbon ribbon-primary text-uppercase">Adopted</div>
                            )}
                            {paidAmount > 0 && paidAmount < price && (
                                <div className="ribbon ribbon-success text-uppercase">Pending</div>
                            )}
                            {this.getImageCarousel()}
                        </div>
                        <div className="details col-lg-6">
                            <div className="d-flex align-items-center justify-content-between flex-column flex-sm-row">
                                <ul className="price list-inline no-margin">
                                    <li className="list-inline-item">{name}</li>
                                    <li className="list-inline-item current">{`$${price}`}</li>
                                </ul>
                            </div>
                            <p>{description}</p>
                            {(sold === false) && (
                                <ul>
                                    <button type="button" className="btn btn-primary wide" onClick={this.handleInquireBtnClicked}>Inquire</button>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    getAdditionalInfoSection() {
        const { description, dateOfBirth, color, weight, gender, type, parents } = this.state;
        const { dad, mom } = parents;
        if (description !== '') {
            return (
                <section className="product-description no-padding">
                    <div className="container">
                        <ul role="tablist" className="nav nav-tabs flex-column flex-sm-row">
                            <li className="nav-item">
                                <a data-toggle="tab" href="#description" role="tab" className="nav-link active">Description</a>
                            </li>
                            <li className="nav-item">
                                <a data-toggle="tab" href="#parents" role="tab" className="nav-link">Parents</a>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div id="description" role="tabpanel" className="tab-pane active">
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
                                            <th>Weight (lb)</th>
                                            <td>{weight}</td>
                                        </tr>
                                        <tr>
                                            <th>Gender</th>
                                            <td>{`${gender.substring(0, 1).toUpperCase()}${gender.substring(1, gender.length).toLowerCase()}`}</td>
                                        </tr>
                                        <tr>
                                            <th>Type</th>
                                            <td>{type}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div id="parents" role="tabpanel" className="tab-pane">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th className="border-0">Dad</th>
                                            <td className="border-0">
                                                <table className="table table-borderless">
                                                    <tbody>
                                                        <tr>
                                                            <th>Name</th>
                                                            <td>{dad.name}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Color</th>
                                                            <td>{dad.color}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Weight (lb)</th>
                                                            <td>{dad.weight}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Type</th>
                                                            <td>{`${dad.type.substring(0, 1).toUpperCase()}${dad.type.substring(1, dad.type.length).toLowerCase()}`}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Picture</th>
                                                            <td>
                                                                <div className="float-left">
                                                                    <Link to={`/our-dogs/${dad.dadID}`}><img className="review-image" src={dad.pictures[0].url} alt={dad.pictures[0].reference} /></Link>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody> 
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Mom</th>
                                            <td>
                                                <table className="table table-borderless">
                                                    <tbody>
                                                        <tr>
                                                            <th>Name</th>
                                                            <td>{mom.name}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Color</th>
                                                            <td>{mom.color}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Weight (lb)</th>
                                                            <td>{mom.weight}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Type</th>
                                                            <td>{`${mom.type.substring(0, 1).toUpperCase()}${mom.type.substring(1, mom.type.length).toLowerCase()}`}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Picture</th>
                                                            <td>
                                                                <div className="float-left">
                                                                    <Link to={`/our-dogs/${mom.momID}`}><img className="review-image" src={mom.pictures[0].url} alt={mom.pictures[0].reference} /></Link>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            );
        }
    }

    handleInquireBtnClicked = () => {
        $('#puppyRequestModal').modal('show');
    }

    render() {
        const { puppyFound, puppyData, pageLoaded } = this.state;
        if (puppyFound === true && pageLoaded === true) {
            return (
                <React.Fragment>
                    {this.getHeader()}
                    {this.getDetailsSection()}
                    {this.getAdditionalInfoSection()}
                    <PuppyRequestModal puppyData={puppyData} />
                </React.Fragment>
            );
        } else if (puppyFound === false && pageLoaded === true) {
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

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated,
    loadCount: state.loadCount,
    userChecked: state.userChecked,
    redirectURL: state.redirectURL
  });
  
  const mapDispatchToProps = dispatch => {
    return {
      login: () => dispatch({ type: 'SIGN_IN' }),
      logout: () => dispatch({ type: 'SIGN_OUT' }),
      checkUser: () => dispatch({ type: 'USER_CHECKED' }),
      setUser: (user) => dispatch({ type: 'SET_USER', user: user }),
      getUser: () => dispatch({ type: 'GET_USER' }),
      showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
      doneLoading: () => dispatch({ type: 'DONE_LOADING' }),
      resetRedirectURL: () => dispatch({ type: 'RESET_REDIRECT_URL' })
    };
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(PuppyDetail);