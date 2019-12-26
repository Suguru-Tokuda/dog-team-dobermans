import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as nodemailer from 'nodemailer';
import * as api from '../src/api.json';

admin.initializeApp(functions.config().firease);

const corsHeader = cors({ origin: true });

function getAPIKEY() {
    const parsedJSON = JSON.parse(JSON.stringify(api));
    return parsedJSON.API_KEY;
}

function notifyNewTestimonial(firstName: string, lastName: string, dogName: string, email: string, picture: any) {
    return new Promise((resolve, reject) => {
        const htmlBody = `
                    <!DOCTYPE html>
                        <body>
                            <h3>New Testimonial</h3>
                            <br /><br />
                            <table>
                                <tr>
                                    <th>First name</th>
                                    <td>${firstName}</td>
                                </tr>
                                <tr>
                                    <th>Last Name</th>
                                    <td>${lastName}</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td><a href="mailto:${email}">${email}</a></td>
                                </tr>
                                <tr>
                                    <th>Dog name</th>
                                    <td>${dogName}</td>
                                </tr>
                                <tr>
                                    <th>Picture</th>
                                    <td><img src="${picture.url}" alt="${picture.reference}" /></td>
                                </tr>
                            </table>
                        </body>
                    </html>
        `;
        sendEmail('suguru.tokuda@gmail.com', 'New Testimonial Submitted', htmlBody)
            .then(() => {
                resolve();
            })
            .catch(() => {
                reject();
            });
    });
}

function sendEmail(email: string, subject: string, htmlBody: string) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: 'dogTeam@dogteamdobermans.com',
            pass: 'DogTeamDobermans'
        }
    });
    const options = {
        sender: 'dogTeam@dogteamdobermans.com',
        from: 'dogTeam@dogteamdobermans.com',
        to: email,
        subject: subject,
        html: htmlBody
    };
    return transporter.sendMail(options);
}

export const homepageContents = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const query = request.query;
        const method = request.method;
        if (typeof query.key === 'undefined') {
            response.status(400).send('Missing API key');
        } else {
            if (query.key !== getAPIKEY()) {
                response.status(400).send('Incorrect API key');
            } else if (query.key === getAPIKEY()) {
                if (method === 'GET') {
                    admin.firestore().collection('homepageContents').get()
                        .then(querySnapshot => {
                            if (querySnapshot.size > 0) {
                                response.status(200).send(querySnapshot.docs[0].data());
                            } else {
                                response.sendStatus(200);
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                } else if (method === 'PUT') {
                    const homepageContentData = request.body;
                    admin.firestore().collection('homepageContents').get()
                        .then(async (querySnapshot) => {
                            if (querySnapshot.size > 0) {
                                const homepageContentID = querySnapshot.docs[0].id;
                                const homepageContentRef = admin.firestore().collection('homepageContents').doc(homepageContentID);
                                homepageContentRef.set(homepageContentData, { merge: true })
                                    .then(() => {
                                        response.sendStatus(200);        
                                    })
                                    .catch(err => {
                                        response.status(500).send(err);
                                    });
                            } else {
                                admin.firestore().collection('homepageContents').add(homepageContentData)
                                    .then(() => {
                                        response.sendStatus(200);
                                    })
                                    .catch(err => {
                                        response.status(500).send(err);
                                    });
                            }
                        })
                        .catch(() => {
                            admin.firestore().collection('homepageContents').add(homepageContentData)
                                .then(() => {
                                    response.sendStatus(200);
                                })
                                .catch(err => {
                                    response.status(500).send(err);
                                });
                        });
                } else {
                    response.status(404).send('Unsupported method');
                }
            }
        }
    });
});

// get all puppies
export const puppies = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const query = request.query;
        if (typeof query.key === 'undefined') {
            response.status(400).send("Missing API key");
        } else if (query.key) {
            if (query.key !== getAPIKEY()) {
                response.status(400).send("Incorrect API key");
            } else if (query.key === getAPIKEY()) {
                admin.firestore().collection('puppies').get()
                .then(querySnapshot => {
                    const puppyArr: any = [];
                    if (querySnapshot.size > 0) {
                        querySnapshot.forEach((doc) => {
                            const retVal = doc.data();
                            retVal.puppyID = doc.id;
                            if (query.live === "true" && retVal.live === true)  {
                                puppyArr.push(retVal);
                            } else if (typeof query.live === 'undefined' || query.live === false) {
                                puppyArr.push(retVal);
                            }
                        });
                    }
                    response.status(200).send(puppyArr);
                })
                .catch(err => {
                    response.status(500).send(err);
                });
            }
        }
    });
});

// puppy CRUD
export const puppy = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const query = request.query;
        if (typeof query.key === 'undefined') {
            response.status(400).send("Missing API key");
        } else if (query.key) {
            if (query.key !== getAPIKEY()) {
                response.status(400).send("Incorrect API key");
            } else if (query.key === getAPIKEY()) {
                const puppyID = query.puppyID;
                if (request.method === 'GET') {
                    if (typeof puppyID !== 'undefined' && puppyID.length > 0) {
                        const puppyRef = admin.firestore().collection('puppies').doc(puppyID);
                        puppyRef.get().then(async (doc) => {
                            let retVal: any = {};
                            if (typeof doc.data() !== undefined) {
                                retVal = doc.data();
                                retVal.puppyID = doc.id;
                                /* get dad and mom info */
                                const dadID = retVal.dadID;
                                const momID = retVal.momID;
                                const dadRef = admin.firestore().collection('parents').doc(dadID);
                                const momRef = admin.firestore().collection('parents').doc(momID);
                                await dadRef.get()
                                    .then(dadDoc => {
                                        retVal.dad = dadDoc.data();
                                        retVal.dad.dadID = dadID;
                                    })
                                    .catch(err => {
                                       response.status(500).send(err); 
                                    });
                                await momRef.get()
                                    .then(momDoc => {
                                        retVal.mom = momDoc.data();
                                        retVal.mom.momID = momID;
                                    })
                                    .catch(err => {
                                        response.status(500).send(err);
                                    });
                            }
                            response.status(200).send(retVal);
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                    } else {
                        response.status(204);
                    }
                } else if (request.method === 'POST') {
                    const data = request.body;
                    admin.firestore().collection('puppies').add(data)
                        .then(snapshot => {
                            const retVal = data;
                            retVal.puppyID = snapshot.id;
                            response.status(201).send(retVal);
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                } else if (request.method === 'PUT') {
                    if (typeof puppyID !== 'undefined' && puppyID.length > 0) {
                            const data = request.body;
                            const puppyRef = admin.firestore().collection('puppies').doc(puppyID);
                            puppyRef.set(data, { merge: true })
                                .then(() => {
                                    const retVal = data;
                                    retVal.puppyID = puppyID;
                                    response.status(200).send(retVal);
                                })
                                .catch(err => {
                                    response.sendStatus(500).send(err);
                                });
                        }
                } else if (request.method === 'DELETE') {
                    if (typeof puppyID !== 'undefined' && puppyID.length > 0) {
                            const puppyRef = admin.firestore().collection('puppies').doc(puppyID);
                            puppyRef.delete()
                                .then(res => {
                                    response.status(200);
                                })
                                .catch(err => {
                                    response.sendStatus(500).send(err);
                                });
                        } else {
                        response.status(400).send('Invalid ID');
                    }
                }
            }
        }
    });
});

// get all parents
export const parents = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const query = request.query;
        if (typeof query.key === 'undefined') {
            response.status(400).send("Missing API key");
        } else if (query.key) {
            if (query.key !== getAPIKEY()) {
                response.status(400).send("Incorrect API key");
            } else if (query.key === getAPIKEY()) {
                admin.firestore().collection('parents').get()
                .then(querySnapshot => {
                    const parentsArr: any = [];
                    if (querySnapshot.size > 0) {
                        querySnapshot.forEach((doc) => {
                            const retVal = doc.data();
                            retVal.parentID = doc.id;
                            if (query.live === "true" && retVal.query === true) {
                                parentsArr.push(retVal);
                            } else if (typeof query.live === 'undefined' || query.live === false) {
                                parentsArr.push(retVal);
                            }
                        });
                    }
                    response.status(200).send(parentsArr);
                })
                .catch(err => {
                    response.status(500).send(err);
                });
            }
        }
    });
});

// parent CRUD
export const parent = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const method = request.method;
        const query = request.query;
        const id = query.parentID;
        const path = request.path;
        if (typeof query.key === 'undefined') {
            response.status(400).send("Missing API key");
        } else if (query.key) {
            if (query.key !== getAPIKEY()) {
                response.status(400).send("Incorrect API key");
            } else if (query.key === getAPIKEY()) {
                if (path === '/') {
                    if (method === 'GET') {
                        if (id.length > 0) {
                            const parentRef = admin.firestore().collection('parents').doc(id);
                            parentRef.get()
                                .then(doc => {
                                    let retVal: any = {};
                                    if (typeof doc.data() !== undefined) {
                                        retVal = doc.data();
                                        retVal.parentID = doc.id;
                                    }
                                    response.status(200).send(retVal);
                                })
                                .catch(err => {
                                    response.status(500).send(err);
                                });
                        } else {
                            response.status(204);
                        }
                    } else if (method === 'POST') {
                        const data = request.body;
                        admin.firestore().collection('parents').add(data)
                            .then(snapshot => {
                                const retVal = data;
                                retVal.parentID = snapshot.id;
                                response.status(201).send(retVal);
                            })
                            .catch(err => {
                                response.sendStatus(500).send(err);
                            });
                    } else if (method === 'PUT') {
                        if (id.length > 0) {
                            const data = request.body;
                            const parentRef = admin.firestore().collection('parents').doc(id);
                            parentRef.set(data, { merge: true })
                                .then(snapshot => {
                                    const retVal = data;
                                    retVal.parentID = id;
                                    response.status(200).send(retVal);
                                })
                                .catch(err => {
                                    response.sendStatus(500).send(err);
                                });
                        }
                    } else if (method === 'DELETE') {
                        if (id.length > 0) {
                            const parentRef = admin.firestore().collection('parents').doc(id);
                            parentRef.delete()
                                .then(res => {
                                    response.status(200);
                                })
                                .catch(err => {
                                    response.sendStatus(500).send(err);
                                });
                        }
                    }
                }
            }
        }
    });
});

// buyer CRUD
export const buyer = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const method = request.method;
        const query = request.query;
        const path = request.path;
        const id = query.buyerID;
        if (typeof query.key === 'undefined') {
            response.status(400).send("Missing API key");
        } else if (query.key === getAPIKEY()) {
            if (path === '/') {
                if (method === 'GET') {
                    if (id.length > 0) {
                        const buyerRef = admin.firestore().collection('buyers').doc(id);
                        buyerRef.get()
                            .then(doc => {
                                let retVal: any = {};
                                if (typeof doc.data() !== undefined) {
                                    retVal = doc.data();
                                    retVal.buyerID = doc.id;
                                }
                                response.status(200).send(retVal);
                            })
                            .catch(err => {
                                response.status(500).send(err);
                            });
                    } else {
                        response.status(204);
                    }
                } else if (method === 'POST') {
                    const data = request.body;
                    admin.firestore().collection('buyers').add(data)
                        .then(snapshot => {
                            const retVal = data;
                            retVal.buyerID = snapshot.id;
                            response.status(201).json(retVal);
                        })
                        .catch(err => {
                            response.sendStatus(500).send(err);
                        });
                } else if (method === 'PUT') {
                    if (id.length > 0) {
                        const data = request.body;
                        const buyerRef = admin.firestore().collection('buyers').doc(id);
                        buyerRef.set(data, { merge: true })
                            .then(snapshot => {
                                response.status(200).json({id: id, data: data});
                            })
                            .catch(err => {
                                response.sendStatus(500).send(err);
                            });
                    }
                } else if (method === 'DELETE') {
                    if (id.length > 0) {
                        const buyerRef = admin.firestore().collection('buyers').doc(id);
                        buyerRef.delete()
                            .then(res => {
                                response.status(200).json({ id: id });
                            })
                            .catch(err => {
                                response.sendStatus(500).send(err);
                            });
                    }
                }
            } else if (path === '/search') {
                const searchKeywords = query.searchKeywords.toLowerCase().split(' ');
                admin.firestore().collection('buyers').get()
                    .then(querySnapshot => {
                        const buyersArr: any = [];
                        if (querySnapshot.size > 0) {
                            querySnapshot.forEach((doc) => {
                                const retVal = doc.data();
                                retVal.buyerID = doc.id;
                                let foundCount = 0;
                                searchKeywords.forEach((searchKeyword: string) => {
                                    if (typeof retVal.firstName !== 'undefined' && retVal.firstName.toLowerCase().indexOf(searchKeyword) !== -1)
                                            foundCount++;
                                    if (typeof retVal.lastName !== 'undefined' && retVal.lastName.toLowerCase().indexOf(searchKeyword) !== -1)
                                            foundCount++;
                                    if (typeof retVal.email !== 'undefined' && retVal.email.toLowerCase().indexOf(searchKeyword) !== -1)
                                            foundCount++;
                                    if (typeof retVal.state !== 'undefined' && retVal.state.toLowerCase().indexOf(searchKeyword) !== -1)
                                            foundCount++;
                                    if (typeof retVal.city !== 'undefined' && retVal.city.toLowerCase().indexOf(searchKeyword) !== -1)
                                            foundCount++;
                                });
                                if (foundCount > 0)
                                    buyersArr.push(retVal)
                            });
                            response.status(200).send(buyersArr);
                        } else {
                            response.status(200).send([]);
                        }
                    })
                    .catch(err => {
                        response.status(500).send(err);
                    });
            }
        }
    });
});

export const buyers = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const query = request.query;
        if (typeof query.key === 'undefined') {
            response.status(400).send('Missing API key');
        } else if (query.key) {
            if (query.key !== getAPIKEY()) {
                response.status(400).send('Incorrect API key');
            } else if (query.key === getAPIKEY()) {
                admin.firestore().collection('buyers').get()
                    .then(querySnapshot => {
                        const buysersArr: any = [];
                        if (querySnapshot.size > 0) {
                            querySnapshot.forEach((doc) => {
                                const retVal = doc.data();
                                retVal.buyerID = doc.id;
                                buysersArr.push(retVal);
                            });
                        }
                        response.status(200).send(buysersArr);
                    })
                    .catch(err => {
                        response.status(500).send(err);
                    });
            }
        }
    });
});

export const aboutUs = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const query = request.query;
        const method = request.method;
        const path = request.path;
        if (typeof query.key === 'undefined') {
            response.status(400).send('Missing API key');
        } else if (query.key === getAPIKEY()) {
            if (path === '/') {
                if (method === 'GET') {
                    admin.firestore().collection('aboutUs').get()
                        .then(querySnapshot => {
                            const aboutUsArr: any = [];
                            if (querySnapshot.size > 0) {
                                querySnapshot.forEach((doc) => {
                                    const retVal = doc.data();
                                    retVal.aboutUsID = doc.id;
                                    aboutUsArr.push(retVal);
                                });
                            }
                            if (aboutUsArr.length > 0) {
                                response.status(200).send(aboutUsArr[0]);
                            } else {
                                response.status(200).send({});
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                }
            } else if (path === '/missionStatements') {
                if (method === 'PUT') {
                    admin.firestore().collection('aboutUs').get()
                        .then(querySnapshot => {
                            const data = request.body;
                            if (querySnapshot.size > 0) {
                                const aboutUsData = {
                                    missionStatements: data
                                };
                                const aboutUsID = querySnapshot.docs[0].id;
                                const aboutUsRef = admin.firestore().collection('aboutUs').doc(aboutUsID);
                                aboutUsRef.set(aboutUsData, { merge: true })
                                    .then(() => {
                                        response.sendStatus(200);
                                    })
                                    .catch(err => {
                                        response.status(500).send(err);
                                    });
                            } else {
                                const aboutUsData = {
                                    ourTeam: [],
                                    missionStatements: data
                                };
                                admin.firestore().collection('aboutUs').add(aboutUsData)
                                    .then(() => {
                                        response.status(201).send(aboutUsData);
                                    })
                                    .catch(err => {
                                        response.status(500).send(err);
                                    });
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                }
            } else if (path === '/ourTeam') {
                if (method === 'PUT') {
                    admin.firestore().collection('aboutUs').get()
                        .then(querySnapshot => {
                            const data = request.body;
                            if (querySnapshot.size > 0) {
                                const aboutUsData = {
                                    ourTeam: data
                                };
                                const aboutUsID = querySnapshot.docs[0].id;
                                const aboutUsRef = admin.firestore().collection('aboutUs').doc(aboutUsID);
                                aboutUsRef.set(aboutUsData, { merge: true })
                                    .then(() => {
                                        response.sendStatus(200);
                                    })
                                    .catch(err => {
                                        response.sendStatus(500).send(err);
                                    });
                            } else {
                                const aboutUsData = {
                                    ourTeam: data,
                                    introductions: []
                                };
                                admin.firestore().collection('aboutUs').add(aboutUsData)
                                    .then(() => {
                                        response.status(201).send(aboutUsData);
                                    })
                                    .catch(err => {
                                        response.status(500).send(err);
                                    });
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                }
            } else {
                response.status(404);
            }
        }
    });
});

export const testimonials = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const query = request.query;
        const path = request.path;
        const method = request.method;
        if (typeof query.key === 'undefined') {
                response.status(400).send('Missing API key');
        } else if (query.key === getAPIKEY()) {
            if (path === '/') {
                if (method === 'GET') {
                    admin.firestore().collection('testimonials').get()
                        .then(querySnapshot => {
                            const testimonialsArr: any = [];
                            if (querySnapshot.size > 0) {
                                querySnapshot.forEach((doc) => {
                                    const testimonial = doc.data();
                                    testimonial.testimonialID = doc.id;
                                    if (typeof query.approved !== 'undefined' && query.approved === 'true') {
                                        if (testimonial.approved === true) {
                                            testimonialsArr.push(testimonial);
                                        }
                                    } else {
                                        testimonialsArr.push(testimonial);
                                    }
                                });
                            }
                            response.status(200).send(testimonialsArr)
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                } else if (method === 'POST') {
                    const data = request.body;
                    admin.firestore().collection('testimonials').add(data)
                        .then(async () => {
                            const { firstName, lastName, dogName, email, picture } = data;
                            await notifyNewTestimonial(firstName, lastName, dogName, email, picture);
                            response.sendStatus(201);
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                } else if (method === 'PUT') {
                    const testimonialID = query.testimonialID;
                    if (typeof testimonialID !== 'undefined' && testimonialID.length > 0) {
                        const data = request.body;
                        const testimonialRef = admin.firestore().collection('testimonials').doc(testimonialID);
                        testimonialRef.set(data, { merge: true })
                            .then(() => {
                                const retVal = data;
                                retVal.testimonialID = testimonialID;
                                response.status(200).send(retVal);
                            })
                            .catch(err => {
                                response.sendStatus(500).send(err);
                            });
                    } else {
                        response.status(400).send('Missing testimonialID');
                    }
                } else if (method === 'DELETE') {
                    const testimonialIDs = request.body.testimonialIDs;
                    if (typeof testimonialIDs !== 'undefined' && testimonialIDs.length > 0) {
                        testimonialIDs.forEach(async (testimonialID: string) => {
                            try {
                                const testimonialRef = admin.firestore().collection('testimonials').doc(testimonialID);
                                await testimonialRef.delete();
                            } catch (err) {
                                response.status(500).send(err);
                            }
                        });
                        response.sendStatus(200);
                    } else {
                        response.status(400).send('Missing testimonialID');
                    }
                } else {
                    response.status(400).send('Unsupported method');
                }
            } else {
                response.status(400).send('Unsupported path');
            }
        }
    });
});

export const contact = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const query = request.query;
        const method = request.method;
        if (typeof query.key === 'undefined') {
            response.status(400).send('Missing API key');
        } else if (query.key === getAPIKEY()) {
            if (method === 'GET') {
                admin.firestore().collection('contact').get()
                    .then(querySnapshot => {
                        if (querySnapshot.size > 0) {
                            const docs = querySnapshot.docs;
                            const doc = docs[0];
                            const retVal = doc.data();
                            retVal.contactID = doc.id;
                            response.status(200).send(retVal);
                        } else {
                            response.status(200).send({});
                        }
                    })
                    .catch(err => {
                        response.status(500).send(err);
                    });
            } else if (method === 'PUT') {
                admin.firestore().collection('contact').get()
                    .then(querySnapshot => {
                        if (querySnapshot.size > 0) {
                            // update
                            const contactID = query.contactID;
                            const data = request.body;
                            const contactRef = admin.firestore().collection('contact').doc(contactID);
                            contactRef.set(data, { merge: true })
                                .then(() => {
                                    const retVal = data;
                                    retVal.contacdtUsID = contactID;
                                    response.status(201).send(retVal);
                                })
                                .catch(err => {
                                    response.status(500).send(err);
                                });
                        } else {
                            const data = request.body;
                            // create new
                            admin.firestore().collection('/contact').add(data)
                                .then(snapshot => {
                                    response.status(200).json
                                })
                                .catch(err => {
                                    response.sendStatus(500).send(err);
                                });
                        }
                    })
                    .catch(err => {
                        response.status(500).send(err);
                    });
            } 
        }
    });
});

export const waitList = functions.https.onRequest((request, response) => {
    corsHeader(request, response, async () => {
        const query = request.query;
        const method = request.method;
        const path = request.path;
        if (typeof query.key === 'undefined') {
            response.status(400).send('Missing API key');
        } else if (query.key === getAPIKEY()) {
            if (path === '/') {
                if (method === 'GET') {
                    const waitRequestID = query.waitRequestID;
                    if (typeof waitRequestID !== 'undefined' && waitRequestID.length > 0) {
                        admin.firestore().collection('waitList').doc(waitRequestID).get()
                            .then(doc => {
                                let retVal: any = {};
                                retVal = doc.data();
                                retVal.waitRequestID = doc.id;
                                response.status(200).send(retVal);
                            })
                            .catch(err => {
                                response.status(500).send(err);
                            });
                    } else {
                        admin.firestore().collection('waitList').get()
                        .then(querySnapshot => {
                            if (querySnapshot.size > 0) {
                                const retVal = [] as any;
                                querySnapshot.forEach((doc) => {
                                    const waitRequest = doc.data();
                                    waitRequest.waitRequestID = doc.id;
                                    retVal.push(waitRequest);
                                });
                                response.status(200).send(retVal);
                            } else {
                                response.status(200).send([]);
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });

                    }
                } else if (method === 'POST') {
                    const data = request.body;
                    admin.firestore().collection('waitList').add(data)
                        .then(() => {
                            response.sendStatus(201);
                        })
                        .catch((err => {
                            response.status(500).send(err);
                        }));
                } else if (method === 'PUT') {
                    const waitRequestID = query.waitRequestID;
                    if (typeof waitRequestID !== 'undefined' && waitRequestID.length > 0) {
                        const data = request.body;
                        const waitRequestRef = admin.firestore().collection('waitList').doc(waitRequestID);
                        waitRequestRef.set(data, { merge: true })
                            .then(() => {
                                const retVal = data;
                                retVal.waitRequestID = waitRequestID;
                                response.status(200).send(retVal);
                            })
                            .catch(err => {
                                response.sendStatus(500).send(err);
                            }); 
                    } else {
                        response.status(400).send('Missing waitRequestID');
                    }
                } else if (method === 'DELETE') {
                    const waitRequestID = query.waitRequestID;
                    if (typeof waitRequestID !== 'undefined' && waitRequestID.length > 0) {
                        const waitRequestRef = admin.firestore().collection('waitList').doc(waitRequestID);
                        waitRequestRef.delete()
                            .then(() => {
                                response.status(200);
                            })
                            .catch(err => {
                                response.status(500).send(err);
                            });
                    } else {
                        response.status(400).send('Invalid ID');
                    }
                } else {
                    response.status(400).send('Unsupported method');
                }
            } else if (path === '/notify') {
                if (method === 'POST') {
                    const data = request.body;
                    const waitRequestIDs = data.waitRequestIDs;
                    for (let i = 0, max = waitRequestIDs.length; i < max; i++) {
                        const waitRequestID = waitRequestIDs[i];
                        const waitRequestRef = admin.firestore().collection('waitList').doc(waitRequestID);
                        await waitRequestRef.get()
                            .then(async (doc) => {
                                let waitRequest: any = {};
                                waitRequest = doc.data();
                                waitRequest.notified = new Date().toISOString();
                                let body = data.body;
                                await waitRequestRef.set(waitRequest, { merge: true });
                                if (body.indexOf('[FIRST_NAME]') !== -1) {
                                    body = body.replace(/\[FIRST_NAME\]/gm, waitRequest.firstName);
                                }
                                if (body.indexOf('[LAST_NAME]') !== -1) {
                                    body = body.replace(/\[LAST_NAME\]/gm, waitRequest.lastName);
                                }
                                await sendEmail(waitRequest.email, data.subject, body)
                                    .catch(err => {
                                        console.log(err);
                                    });
                            })
                            .catch(err => {
                                response.status(500).send(err);
                            });
                    }
                    response.sendStatus(200);
                } else {
                    response.status(400).send('Unsupported method');
                }
            }
        }
    });
});

export const blogs = functions.https.onRequest((request, response) => {
    corsHeader(request, response, async () => {
        const query = request.query;
        const method = request.method;
        if (typeof query.key === 'undefined') {
            response.status(400).send('Missing API key');
        } else if (query.key === getAPIKEY()) {
            const blogID = query.blogID;
            let blogRef;
            if (typeof blogID !== 'undefined' && blogID.length > 0) {
                blogRef = admin.firestore().collection('blogs').doc(blogID);
            }
            if (method === 'GET') {
                if (typeof blogID !== 'undefined' && blogID.length > 0) {
                    if (typeof blogRef !== 'undefined') {
                        blogRef.get()
                        .then(doc => {
                            let blog: any = {};
                            blog = doc.data();
                            blog.blogID = doc.id;
                            response.status(200).send(blog);
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        })
                    }
                } else {
                    admin.firestore().collection('blogs').get()
                        .then(querySnapshot => {
                            if (querySnapshot.size > 0) {
                                const retVal = [] as any;
                                querySnapshot.forEach((doc) => {
                                    const blog = doc.data();
                                    blog.message = blog.message.replace(/(<([^>]+)>)/gm, '');
                                    // blog.message = blog.message.replace(/(.*?).(.*?)/gm, '. ');
                                    blog.blogID = doc.id;
                                    retVal.push(blog);
                                });
                                response.status(200).send(retVal);
                            } else {
                                response.status(200).send([]);
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                }
            } else if (method === 'PUT') {
                const data = request.body;
                if (typeof blogRef !== 'undefined') {
                    blogRef.set(data, { merge: true })
                        .then(() => {   
                            const retVal = data;
                            retVal.blogID = blogID;
                            response.status(200).send(retVal);
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                } else {
                    data.created = new Date().toISOString();
                    admin.firestore().collection('blogs').add(data)
                        .then(() => {
                            response.sendStatus(201);
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                }
            } else if (method === 'DELETE') {
                if (typeof blogRef !== 'undefined') {
                    blogRef.delete()
                        .then(() => {
                            response.sendStatus(200);
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                } else {
                    response.sendStatus(500);
                }
            } else {
                response.status(400).send('Unsupported method');
            }
        }
    });
});