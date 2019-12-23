import React, { Component } from 'react';
import HomepageContentsService from '../../services/homepageContentsService';
import toastr from 'toastr';

class Main extends Component {
    state = {
        videoSrc: '',
        news: ''
    };

    componentDidMount() {
        HomepageContentsService.getHomepageContents()
            .then(async (res) => {
                const homepageContentsData = res.data;
                if (typeof homepageContentsData.backgroundVideo !== 'undefined') {
                    this.setState({ videoSrc: homepageContentsData.backgroundVideo.url })
                    // await fetch(homepageContentsData.backgroundVideo.url)
                    //     .then(res => res.blob())
                    //     .then(blob => {
                    //         const objectURL = URL.createObjectURL(blob);
                    //         this.setState({ videoSrc: objectURL });
                    //     })
                    //     .catch(err => {
                    //         console.log(err);
                    //         toastr.error('There was an error in loading the home page data');
                    //     });
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

    render() {
        const { videoSrc, news } = this.state;
        return (
            <div>
                <section className="hero-video">
                    {/* <video muted autoPlay loop src="https://firebasestorage.googleapis.com/v0/b/dogteamdobermans.appspot.com/o/mainVideo%2FolCKecjEqf?alt=media&token=9f707307-3126-44d9-b32b-d711ff94ae63" className="bg-video"></video> */}
                    <video muted autoPlay loop src={videoSrc} className="bg-video"></video>
                    <div className="container position-relative text-white text-center">
                        <div className="row">
                            <div className="col-xl-7 mx-auto">
                                <h1 className="text-uppercase text-shadow letter-spacing-2 mb-4">Dog Team Dobermans</h1>
                                <hr class="bg-light m-5"></hr>
                                <p class="lead mb-5">We breed quality dobermans.</p>
                            </div>
                        </div>
                    </div>
                </section>
                {news !== '' && (
                    <section className="blog gray-bg">
                        <div className="container">
                            <div dangerouslySetInnerHTML={{ __html: news }} />
                        </div>
                    </section>
                )}
            </div>
        );
    }
}

export default Main;