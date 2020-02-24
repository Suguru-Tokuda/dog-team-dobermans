import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import HomepageContentsService from '../../services/homepageContentsService';
import ImageGallery from 'react-image-gallery';
// import PuppyService from '../../services/puppyService';
// import ParentService from '../../services/parentService';
import toastr from 'toastr';

class Main extends Component {
    state = {
        title: '',
        description: '',
        videoSrc: '',
        news: '',
        banner: null,
        puppies: [],
        parents: [],
        galleryImages: [],
        loaded: false
    };

    componentDidMount() {
        window.scrollTo(0, 0);
        // PuppyService.getLivePuppiesForLimit(10)
        //     .then(res => {
        //         this.setState({ puppies: res.data });
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     });
        // ParentService.getLiveParentsForLimit(4)
        //     .then(res => {
        //         this.setState({ parents: res.data });
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     });
        HomepageContentsService.getHomepageContents()
            .then(async (res) => {
                const homepageContentsData = res.data;
                if (typeof homepageContentsData.backgroundVideo !== 'undefined') {
                    this.setState({ 
                        title: homepageContentsData.backgroundVideo.title,
                        description: homepageContentsData.backgroundVideo.description,
                        videoSrc: homepageContentsData.backgroundVideo.url
                     });
                }
                if (typeof homepageContentsData.news !== 'undefined') {
                    if (homepageContentsData.news !== '<p><br></p>')
                        this.setState({ news: homepageContentsData.news });
                }
                if (typeof homepageContentsData.banner !== 'undefined') {
                    this.setState({ banner: homepageContentsData.banner });
                }
                if (homepageContentsData.galleryImages) {
                    this.setState({ galleryImages: homepageContentsData.galleryImages });
                }
            })
            .catch(err => {
                console.log(err);
                toastr.error('There was an error in loading the home page data');
            })
            .finally(() => {
                this.setState({ loaded: true });
            });
    };

    // componentDidUpdate() {
    //     $(document).ready(function () {
    //         $('.owl-carousel').owlCarousel({ 
    //             margin: 10, 
    //             autoHeight: true,
    //             responsiveClass: true,
    //             responsive: {
    //                 0: {
    //                     items: 1,
    //                     nav: false
    //                 },
    //                 768: {
    //                     items: 2,
    //                     nav: false
    //                 },
    //                 992: {
    //                     items: 4,
    //                     nav: false
    //                 }
    //             } 
    //         });
    //     });
    // }

    getOurDogs() {
        const { parents } = this.state;
        if (parents.length > 0) {
            const items = parents.map(parent => {
                return (
                    <div key={`parent-${parent.parentID}`} className="item">
                        <div className="product is-gray">
                            <div className="image d-flex align-items-center justify-content-center">
                                {typeof parent.pictures !== 'undefined' && parent.pictures.length > 0 && (
                                    <img src={parent.pictures[0].url} alt={parent.pictures[0].reference} className="img-fluid"/>
                                )}
                                {(typeof parent.pictures === 'undefined' || (typeof parent.pictures !== 'undefined' && parent.pictures.length === 0)) && (
                                    <React.Fragment>
                                        <p>
                                            <i className="fa fa-photo" style={{fontSize: '100px'}}></i>
                                            {` `}
                                            <i className="fa fa-ban" style={{fontSize: '50px'}}></i>
                                        </p>
                                    </React.Fragment>
                                )}
                                <div className="hover-overlay d-flex align-items-center justify-content-center">
                                    <div className="CTA d-flex align-items-center justify-content-center">
                                        <Link to={`/our-dogs/${parent.parentID}`} className="visit-product active"><i className="fa fa-search"></i>View</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="title">
                            <Link to={`/our-dogs/${parent.parentID}`}>
                                <h3 className="h6 text-uppercase no-margin-bottom text-center">{parent.name}</h3>
                            </Link>
                        </div>
                    </div>
                );
            });
            return (
                <section className="categories">
                    <div className="container">
                        <header className="text-center">
                            <h2 className="text-uppercase">
                                Our Dogs
                            </h2>
                        </header>
                        <div data-slider-id="1" className="owl-carousel">
                            {items}
                        </div>
                    </div>
                </section>
            );
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
                                {typeof puppy.pictures !== 'undefined' && puppy.pictures.length > 0 && (
                                    <img src={puppy.pictures[0].url} alt={puppy.pictures[0].reference} className="img-fluid"/>
                                )}
                                {(typeof puppy.pictures === 'undefined' || (typeof puppy.pictures !== 'undefined' && puppy.pictures.length === 0)) && (
                                    <React.Fragment>
                                        <p>
                                            <i className="fa fa-photo" style={{fontSize: '100px'}}></i>
                                            {` `}
                                            <i className="fa fa-ban" style={{fontSize: '50px'}}></i>
                                        </p>
                                    </React.Fragment>
                                )}
                                <div className="hover-overlay d-flex align-items-center justify-content-center">
                                    <div className="CTA d-flex align-items-center justify-content-center">
                                        <Link to={`/puppies/${puppy.puppyID}`} className="visit-product active"><i className="fa fa-search"></i>View</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="title">
                                <Link to={`/puppies/${puppy.puppyID}`}>
                                    <h3 className="h6 text-uppercase no-margin-bottom text-center">{puppy.name}</h3>
                                </Link>
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
                        <div data-slider-id="2" className="owl-carousel">
                            {items}
                        </div>
                    </div>
                </section>
            );
        }
    }
    
    getBanner() {
        const { banner } = this.state;
        if (banner !== null) {
            return (
                <section style={{backgroundImage: `url(${banner.picture.url})`}} className="divider">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                {banner.title !== '' && (
                                    <h2 className="h1 text-uppercase no-margin">{banner.title}</h2>
                                )}
                                {banner.description !== '' && (
                                    <p>{banner.description}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )
        } else { 
            return null;
        }
    }

    renderImageGalley = () => {
        const { galleryImages } = this.state;
        if (galleryImages.length > 0) {
            const imageObjects = galleryImages.map(image => {
                return {
                    original: image.url,
                    thumbnail: image.url,
                    originalAlt: image.reference,
                    thumbnailAlt: image.reference
                }
            });
            return (
                <section className="gray-bg">
                    <div className="container">
                        <ImageGallery items={imageObjects} slideInterval={3500} autoPlay={true} />
                    </div>
                </section>
            );
        } else {
            return null;
        }
    }

    render() {
        const { title, description, videoSrc, news, loaded } = this.state;
        if (loaded === true) {
            return (
                    <div>
                        {videoSrc !== '' && (
                            <section className="hero-video">
                                <video muted autoPlay loop playsInline src={videoSrc} className="bg-video"></video>
                                <div className="container position-relative text-white text-center">
                                    <div className="row">
                                        <div className="col-xl-7 mx-auto">
                                            <h1 className="text-uppercase text-shadow letter-spacing mb-4">{title}</h1>
                                            <hr className="bg-light m-5"></hr>
                                            <p className="lead mb-5">{description}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    {/* {this.getOurDogs()}
                    {this.getPuppies()} */}
                    {this.renderImageGalley()}
                    {this.getBanner()}
                    {/* {news !== '' && (
                        <section className="blog">
                            <div className="container">
                            <header className="text-center">
                                <h2 className="text-uppercase">News</h2>
                            </header>
                                <div dangerouslySetInnerHTML={{ __html: news }} />
                            </div>
                        </section>
                    )} */}
                </div>
            );
        } else {
            return <div style={{marginTop: '500px'}}></div>;
        }
    }
}

export default Main;