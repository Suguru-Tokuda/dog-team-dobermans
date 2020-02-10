import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MissionStatements from './missionStatements';
import OurTeam from './ourTeam';
import AboutUsService from '../../services/aboutUsService';

class AboutUs extends Component {
    state = {
        missionStatements: [],
        ourTeam: []
    };

    componentDidMount() {
        window.scrollTo(0, 0);
        AboutUsService.getAboutUs()
            .then(res => {
                this.setState({
                    missionStatements: res.data.missionStatements,
                    ourTeam: res.data.ourTeam
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    getHeader() {
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-1">
                            <h1>About us</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    About us
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    getMissionStatements() {
        const { missionStatements } = this.state;
        if (missionStatements.length > 0) { 
            return <MissionStatements missionStatements={missionStatements} />
        }
        return <div style={{marginTop: '400px'}}></div>;
    }

    getOurTeam() {
        const { ourTeam } = this.state;
        if (ourTeam.length > 0) {
            return <OurTeam ourTeam={ourTeam} />
        }
        return <div style={{marginTop: '400px'}}></div>;
    }

    render() {
        return (
            <React.Fragment>
                {this.getHeader()}
                {this.getMissionStatements()}
                {this.getOurTeam()}
            </React.Fragment>
        );
    }
}

export default AboutUs;