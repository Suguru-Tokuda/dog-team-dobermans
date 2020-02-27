import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PuppiesTable from './puppiesTable';
import PuppyService from '../../services/puppyService';
import HomepageContentsService from '../../services/homepageContentsService';

class PuppyList extends Component {
    state = {
        puppies: [],
        puppyMessage: '',
        loaded: false
    };

    componentDidMount() {
        const promises = [PuppyService.getAllLivePuppies() ,HomepageContentsService.getPuppyMessage()];
        window.scrollTo(0, 0);
        Promise.all(promises)
            .then(res => {
                this.setState({ 
                    puppies: res[0].data, 
                    puppyMessage: res[1].data
                 });
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.setState({ loaded: true });
            });
    }

    getHeader() {
        const { puppyMessage } = this.state;
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-1">
                            <h1>Puppies</h1>
                            <p className="lead text-muted" dangerouslySetInnerHTML={{__html: puppyMessage }}></p>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    Puppies
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    getPuppyList() {
        const { puppies, loaded } = this.state;
        if (puppies.length > 0 && loaded === true) {
            return <PuppiesTable {...this.props} puppies={puppies} />;
        } else {
            return <div style={{marginTop: "800px"}}></div>;
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.getHeader()}
                <div className="container">
                    <div className="row">
                        {this.getPuppyList()}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PuppyList;