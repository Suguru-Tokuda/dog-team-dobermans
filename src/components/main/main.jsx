import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import HomepageContentsService from '../../services/homepageContentsService';
import PuppyService from '../../services/puppyService';
import ParentService from '../../services/parentService';
import toastr from 'toastr';
import $ from 'jquery';

class Main extends Component {
    state = {
        videoSrc: '',
        news: '',
        puppies: [],
        parents: []
    };

    componentDidMount() {
        PuppyService.getLivePuppiesForLimit(10)
            .then(res => {
                this.setState({ puppies: res.data });
            })
            .catch(err => {
                console.log(err);
            });
        ParentService.getLiveParentsForLimit(3)
            .then(res => {
                this.setState({ parents: res.data });
            })
            .catch(err => {
                console.log(err);
            });
        HomepageContentsService.getHomepageContents()
            .then(async (res) => {
                const homepageContentsData = res.data;
                if (typeof homepageContentsData.backgroundVideo !== 'undefined') {
                    this.setState({ videoSrc: homepageContentsData.backgroundVideo.url })
                }
                if (typeof homepageContentsData.news !== 'undefined') {
                    this.setState({ news: homepageContentsData.news });
                }
            })
            .catch(err => {
                console.log(err);
                toastr.error('There was an error in loading the home page data');
            });
    };

    componentDidUpdate() {
        $(document).ready(function () {
            $('.owl-carousel').owlCarousel({
                items: 4
            });
        });
    }

    getOurDogs() {
        const { parents } = this.state;
        if (parents.length > 0) {
            const items = parents.map(parent => {
                let imageUrl = '';
                if (typeof parent.pictures !== 'undefined' && parent.pictures.length > 0) {
                    imageUrl = parent.pictures[0].url;
                }
                return (
                    <div className="col-lg-4" key={`our-dog-${parent.parentID}`}>
                        <Link to={`/our-dogs/${parent.parentID}`}>
                            <div style={{backgroundImage: `url(${imageUrl})`}} className="item d-flex align-items-end">
                                <div className="content">
                                    <h3 className="h5">{parent.name}</h3>
                                </div>
                            </div>
                        </Link>
                    </div>
                );
            });
            return (
                <section className="categories">
                    <div className="container">
                        <header className="text-center">
                            <h2 className="text-uppercase">Our Dogs</h2>
                        </header>
                        <div className="row text-left">
                            {items}
                        </div>
                    </div>
                </section>
            )
        }
        return null;
    }

    getPuppies() {
        const { puppies } = this.state;
        if (puppies.length > 0) {
            const items = puppies.map(puppy => {
                return (
                    <div key={`puppy-${puppy.puppyID}`} className="item">
                        <div className="product is-gray">
                            <div className="image d-flex align-items-center justify-content-center">
                                <img src={puppy.pictures[0].url} alt={puppy.pictures[0].reference} className="img-fluid" />
                                <div className="hover-overlay d-flex align-items-center justify-content-center">
                                    {puppy.sold === true && (
                                        <div className="ribbon ribbon-danger text-uppercase">Sold</div>
                                    )}
                                    <div className="CTA d-flex align-items-center justify-content-center">
                                        <Link to={`/puppies/${puppy.puppyID}`} className="visit-product active"><i className="fa fa-search"></i>View</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            });
            return (
                <section className="men-collection gray-bg">
                    <div className="container">
                        <header className="text-center">
                            <h2 className="text-uppercase">
                                Pupppies
                            </h2>
                        </header>
                        <div data-slider-id="1" className="owl-carousel">
                            {items}
                        </div>
                    </div>
                </section>
            );
        }
    }

    render() {
        const { videoSrc, news } = this.state;
        return (
            <div>
                <section className="hero-video">
                    {/* <video muted autoPlay loop src="https://firebasestorage.googleapis.com/v0/b/dogteamdobermans.appspot.com/o/mainVideo%2FolCKecjEqf?alt=media&token=9f707307-3126-44d9-b32b-d711ff94ae63" className="bg-video"></video> */}
                    <video muted autoPlay loop playsInline src={videoSrc} className="bg-video"></video>
                    <div className="container position-relative text-white text-center">
                        <div className="row">
                            <div className="col-xl-7 mx-auto">
                                <h1 className="text-uppercase text-shadow letter-spacing-2 mb-4">Dog Team Dobermans</h1>
                                <hr className="bg-light m-5"></hr>
                                <p className="lead mb-5">We breed quality dobermans.</p>
                            </div>
                        </div>
                    </div>
                </section>
                {this.getOurDogs()}
                {this.getPuppies()}
                {news !== '' && (
                    <section className="blog">
                        <div className="container">
                        <header className="text-center">
                            <h2 className="text-uppercase">News</h2>
                        </header>
                            <div dangerouslySetInnerHTML={{ __html: news }} />
                        </div>
                    </section>
                )}
            </div>
        );
    }
}

export default Main;