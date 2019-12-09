import React, { Component } from 'react';

class MissionStatements extends Component {
    state = {
        missionStatements: []
    };

    constructor(props) {
        super(props);
        this.state.missionStatements = props.missionStatements;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.missionStatements) !== JSON.stringify(prevState.missionStatements)) {
            return { missionStatements: nextProps.missionStatements };
        }
        return null;
    }

    render() {
        const { missionStatements } = this.state;
        if (missionStatements.length > 0) {
            const statements = missionStatements.map((missionStatement, i) => {
                let retVal;
                if (i % 2 === 0) {
                    retVal = (
                        <React.Fragment>
                            <div className="col-lg-8 col-sm-9">
                                <h2>{missionStatement.title}</h2>
                                <p className="text-muted">{missionStatement.description}</p>
                            </div>
                            <div className="col-lg-4 col-sm-3 d-none d-sm-flex align-items-center">
                                <img src={missionStatement.picture.url} alt={missionStatement.picture.reference} className="img-fluid" />
                            </div>
                        </React.Fragment>
                    );
                } else if (i % 2 === 1) {
                    retVal = (
                        <React.Fragment>
                            <div className="col-lg-4 col-sm-3 d-none d-sm-flex align-items-center">
                                <img src={missionStatement.picture.url} alt={missionStatement.picture.reference} className="img-fluid" />
                            </div>
                            <div className="col-lg-8 col-sm-9">
                                <h2>{missionStatement.title}</h2>
                                <p className="text-muted">{missionStatement.description}</p>
                            </div>
                        </React.Fragment>
                    );
                }
                return (
                    <div key={`mission-statement-${i}`} className="row about-item">
                        {retVal}
                    </div>
                );
            });
            return (
                <section className="padding-small">
                    <div className="container">
                        {statements}
                    </div>
                </section>
            )
        } else {
            return null;
        }
    }
}

export default MissionStatements;