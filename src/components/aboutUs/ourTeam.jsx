import React, { Component } from 'react';

class OurTeam extends Component {
    state = {
        ourTeam: []
    };

    constructor(props) {
        super(props);
        this.state.ourTeam = props.ourTeam;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.ourTeam) !== JSON.stringify(prevState.ourTeam)) {
            return { ourTeam: nextProps.ourTeam };
        }
        return null;
    }

    render() {
        const { ourTeam } = this.state;
        if (ourTeam.length > 0) {
            const ourTeamElements = ourTeam.map((member, i) => {
                return (
                    <div key={`member-${i}`} className="col-md-3 col-6">
                        <div className="team-member">
                            <div className="image">
                                <img src={member.picture.url} alt={member.picture.reference} className="img-fluid rounded-circle" />
                            </div>
                            <h3 className="h5">{member.name}</h3>
                            <p className="role">{member.title}</p>
                            <div className="text">
                                <p>{member.description}</p>
                            </div>
                        </div>
                    </div>
                )
            });
            return (
                <section className="padding-small">
                    <div className="container">
                        <header>
                            <h2 className="h1">Our team</h2>
                        </header>
                        <div className="row team">
                            {ourTeamElements}
                        </div>
                    </div>
                </section>
            );
        } else {
            return null;
        }
    }
}

export default OurTeam;