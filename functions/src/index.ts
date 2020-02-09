import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as nodemailer from 'nodemailer';
import * as api from '../src/api.json';
import * as config from '../src/config.json';

admin.initializeApp(functions.config().firease);

const corsHeader = cors({ origin: true });

function getAPIKEY() {
    const parsedJSON = JSON.parse(JSON.stringify(api));
    return parsedJSON.API_KEY;
}

function getConfig() {
    const parsedJSON = JSON.parse(JSON.stringify(config));
    return parsedJSON.office;
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
        sendEmail('dogTeam@dogteamdobermans.com', 'New Testimonial Submitted', htmlBody)
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
            user: getConfig().user,
            pass: getConfig().pass
        }
    });
    const options = {
        sender: getConfig().user,
        from: getConfig().user,
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
    corsHeader(request, response, async () => {
        const query = request.query;
        const path = request.path;
        if (typeof query.key === 'undefined') {
            response.status(400).send("Missing API key");
        } else if (query.key) {
            if (query.key !== getAPIKEY()) {
                response.status(400).send("Incorrect API key");
            } else if (query.key === getAPIKEY()) {
                if (path === '/') {
                    admin.firestore().collection('puppies').get()
                    .then(querySnapshot => {
                        let limit: any = undefined;
                        if (query.limit !== undefined)
                            limit = parseInt(query.limit);
                        const puppyArr: any = [];
                        if (querySnapshot.size > 0) {
                            querySnapshot.forEach((doc) => {
                                const retVal = doc.data();
                                retVal.puppyID = doc.id;
                                if (query.live === "true" && retVal.live === true) {
                                    if ((typeof limit !== 'undefined' && puppyArr.length < limit) || typeof limit === 'undefined')
                                        puppyArr.push(retVal);
                                } else if (query.live === "false" && retVal.live === false) {
                                    if ((typeof limit !== 'undefined' && puppyArr.length < limit) || typeof limit === 'undefined')
                                        puppyArr.push(retVal);
                                } else if (typeof query.live === 'undefined') {
                                    if ((typeof limit !== 'undefined' && puppyArr.length < limit) || typeof limit === 'undefined')
                                        puppyArr.push(retVal);
                                }
                            });
                        }
                        response.status(200).send(puppyArr);
                    })
                    .catch(err => {
                        response.status(500).send(err);
                    });
                } else if (path === '/getByBuyerID') {
                    const buyerID = query.buyerID;
                    if (typeof buyerID !== 'undefined' && buyerID.length >0) {
                        const buyerRef = admin.firestore().collection('buyers').doc(buyerID);
                        buyerRef.get()
                            .then(async (doc) => {
                                if (typeof doc.data() !== 'undefined') {
                                    const buyerData = doc.data();
                                    if (typeof buyerData !== 'undefined') {
                                        const puppyIDs = buyerData.puppyIDs;
                                        const retVal: any[] = [];
                                        puppyIDs.foreach(async (puppyID: Number) => {
                                            const puppyRef = admin.firestore().collection('puppies').doc(puppyID.toString());
                                            if (typeof puppyRef !== 'undefined') {
                                                await puppyRef.get()
                                                    .then(puppyDoc => {
                                                        const puppyData: any = puppyDoc.data();
                                                        puppyData.puppyID = puppyDoc.id;
                                                        retVal.push(puppyData);
                                                    })
                                                    .catch(err => {
                                                        console.log(err);
                                                    });
                                            }
                                        });
                                        response.status(200).send(retVal);
                                    }
                                }
                            })
                            .catch(err => {
                                response.status(500).send(err);
                            })
                    } else {
                        response.status(404).send('Missing buyerID')
                    }
                } else if (path === '/processTransaction') {
                    const transactionData = request.body;
                    const puppyRef = admin.firestore().collection('puppies').doc(transactionData.puppyID);
                    const buyerRef = admin.firestore().collection('buyers').doc(transactionData.buyerID);
                    await puppyRef.get()
                        .then(async (snapshot) => {
                            const puppyData = snapshot.data();
                            if (typeof puppyData !== 'undefined') {
                                puppyData.buyerID = transactionData.buyerID;
                                puppyData.paidAmount += transactionData.paidAmount;
                                puppyData.sold = true;
                                if (puppyData.soldDate === null)
                                    puppyData.soldDate = new Date();
                                await puppyRef.set(puppyData, { merge: true });
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                    await buyerRef.get()
                        .then(async (snapshot) => {
                            const buyerData = snapshot.data();
                            if (typeof buyerData !== 'undefined') {
                                if (buyerData.puppyIDs.indexOf(transactionData.puppyID) === -1) {
                                    buyerData.puppyIDs.push(transactionData.puppyID);
                                    await buyerRef.set(buyerData, {merge: true });
                                }
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                    response.sendStatus(200);
                } else if (path === '/cancelTransaction') {
                    const puppyID = query.puppyID;
                    const puppyRef = admin.firestore().collection('puppies').doc(puppyID);
                    puppyRef.get()
                        .then(async (puppySnapshot) => {
                            const puppyData = puppySnapshot.data();
                            if (typeof puppyData !== 'undefined') {
                                const buyerID = puppyData.buyerID;
                                puppyData.buyerID = null;
                                puppyData.paidAmount = 0;
                                puppyData.sold = false;
                                const buyerRef = admin.firestore().collection('buyers').doc(buyerID);
                                await buyerRef.get()
                                    .then(async (buyerSnapshot) => {
                                        const buyerData = buyerSnapshot.data();
                                        if (typeof buyerData !== 'undefined') {
                                            const index = buyerData.puppyIDs.indexOf(puppyID);
                                            if (index !== -1) {
                                                buyerData.puppyIDs.splice(index, 1);
                                                await buyerRef.set(buyerData, { merge: true });
                                            }
                                        }
                                    })
                                    .catch(err => {
                                        response.status(500).send(err);
                                    });
                                await puppyRef.set(puppyData, { merge: true });
                                response.sendStatus(200);
                            } else {
                                response.status(500).send('There was an error in getting puppy data');
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        })
                }
            }
        }
    });
});

// puppy CRUD
export const puppy = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const query = request.query;
        const path = request.path;
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
                            if (typeof doc.data() !== 'undefined') {
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
                    if (path === '/') {
                        admin.firestore().collection('puppies').add(data)
                            .then(snapshot => {
                                const retVal = data;
                                retVal.puppyID = snapshot.id;
                                response.status(201).send(retVal);
                            })
                            .catch(err => {
                                response.status(500).send(err);
                            });
                    }
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
                                .then(() => {
                                    response.sendStatus(200);
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
                    let limit: any = undefined;
                    if (query.limit !== undefined)
                        limit = parseInt(query.limit);
                    const parentsArr: any = [];
                    if (querySnapshot.size > 0) {
                        querySnapshot.forEach((doc) => {
                            const retVal = doc.data();
                            retVal.parentID = doc.id;
                            if (query.live === "true" && retVal.live === true) {
                                if ((typeof limit !== 'undefined' && parentsArr.length < limit) || typeof limit === 'undefined')
                                    parentsArr.push(retVal);
                            } else if (query.live === "false" && retVal.live === false) {
                                if ((typeof limit !== 'undefined' && parentsArr.length < limit) || typeof limit === 'undefined')
                                    parentsArr.push(retVal);
                            } else if (typeof query.live === 'undefined') {
                                if ((typeof limit !== 'undefined' && parentsArr.length < limit) || typeof limit === 'undefined')
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
        const parentID = query.parentID;
        const path = request.path;
        if (typeof query.key === 'undefined') {
            response.status(400).send("Missing API key");
        } else if (query.key) {
            if (query.key !== getAPIKEY()) {
                response.status(400).send("Incorrect API key");
            } else if (query.key === getAPIKEY()) {
                if (path === '/') {
                    if (method === 'GET') {
                        if (parentID.length > 0) {
                            const parentRef = admin.firestore().collection('parents').doc(parentID);
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
                            response.sendStatus(204);
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
                        if (parentID.length > 0) {
                            const data = request.body;
                            const parentRef = admin.firestore().collection('parents').doc(parentID);
                            parentRef.set(data, { merge: true })
                                .then(snapshot => {
                                    const retVal = data;
                                    retVal.parentID = parentID;
                                    response.status(200).send(retVal);
                                })
                                .catch(err => {
                                    response.sendStatus(500).send(err);
                                });
                        }
                    } else if (method === 'DELETE') {
                        if (parentID.length > 0) {
                            const parentRef = admin.firestore().collection('parents').doc(parentID);
                            parentRef.delete()
                                .then(res => {
                                    response.sendStatus(200);
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
                        response.sendStatus(204);
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
    corsHeader(request, response, async () => {
        const query = request.query;
        if (typeof query.key === 'undefined') {
            response.status(400).send('Missing API key');
        } else if (query.key) {
            if (query.key !== getAPIKEY()) {
                response.status(400).send('Incorrect API key');
            } else if (query.key === getAPIKEY()) {
                try {
                    const buyersQuerySnapshot = await admin.firestore().collection('buyers').get();
                    const buyersArray: any = [];
                    if (buyersQuerySnapshot.size > 0) {
                        buyersQuerySnapshot.forEach(async (buyerDoc) => {
                            const retVal = buyerDoc.data();
                            retVal.buyerID = buyerDoc.id;
                            let hasPartialPayment = false;
                            const puppiesData: any[] = [];
                            admin.firestore().collection('puppies').where('buyerID', '==', retVal.buyerID).get()
                                .then(puppiesSnapshot => {
                                    if (puppiesSnapshot.size > 0) {
                                        puppiesSnapshot.forEach(puppyDoc => {
                                            const puppyDataPiece = puppyDoc.data();
                                            puppyDataPiece.puppyID = puppyDoc.id;
                                            puppiesData.push(puppyDataPiece);
                                            if (puppyDataPiece.price !== puppyDataPiece.paidAmount)
                                                hasPartialPayment = true;
                                        });
                                    }
                                    retVal.hasPartialPayment = hasPartialPayment;
                                    retVal.puppies = puppiesData;
                                    buyersArray.push(retVal);
                                    if (buyersArray.length === buyersQuerySnapshot.size) {
                                        response.status(200).send(buyersArray);
                                    }        
                                })
                                .catch(err => {
                                    response.status(500).send(err);
                                });
                        });
                    }
                }
                catch (err) {
                    response.status(500).send(err);
                }
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
                    if (query.testimonialID) {
                        const testimonialID = query.testimonialID;
                        if (typeof testimonialID !== 'undefined') {
                                admin.firestore().collection('testimonials').doc(testimonialID).get()
                                    .then(doc => {
                                        const retVal = doc.data();
                                        response.status(200).send(retVal);
                                    })
                                    .catch(err => {
                                        response.status(500).send(err);
                                    });
                        } else {
                            response.status(500).send('Missing testimonialID');
                        }
                    } else {
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
                    }
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
                        if (data.testimonialID)
                            delete data.testimonialID;
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
                            admin.firestore().collection('contact').add(data)
                                .then(snapshot => {
                                    response.sendStatus(200);
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
                        if (data.waitRequestID)
                            delete data.waitRequestID;
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
                    const waitRequestIDs: Array<string> = request.body.waitRequestIDs;
                    if (typeof waitRequestIDs !== 'undefined' && waitRequestIDs.length > 0) {
                        try {
                            waitRequestIDs.forEach(async (waitRequestID) => {
                                if (typeof waitRequestID !== 'undefined') {
                                    const waitRequestRef = admin.firestore().collection('waitList').doc(waitRequestID);
                                    await waitRequestRef.delete();
                                }
                            });
                            response.sendStatus(200);
                        } catch (err) {
                            response.status(500).send(err);
                        }
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
                        admin.firestore().collection('blogs').get()
                            .then(querySnapshot => {
                                const docs = querySnapshot.docs;
                                let blog: any = {};
                                for (let i = 0, max = docs.length; i < max; i++) {
                                    if (docs[i].id === blogID) {
                                        blog = docs[i].data();
                                        if (typeof docs[i - 1] !== 'undefined') {
                                            blog.nextBlogID = docs[i - 1].id;
                                        }
                                        if (typeof docs[i + 1] !== 'undefined') {
                                            blog.prevBlogID = docs[i + 1].id;
                                        }
                                        response.status(200).send(blog);
                                    }
                                }
                            })
                            .catch(err => {
                                response.status(500).send(err);
                            })
                    }
                } else {
                    admin.firestore().collection('blogs').get()
                        .then(querySnapshot => {
                            if (querySnapshot.size > 0) {
                                let retVal = [] as any;
                                querySnapshot.forEach((doc) => {
                                    const blog = doc.data();
                                    blog.message = blog.message.replace(/(<([^>]+)>)/gm, '');
                                    blog.message = blog.message.replace(/[\S](\.)[\S]/gm, ($0: any) => { return $0.replace('.', '. ') });
                                    blog.blogID = doc.id;
                                    retVal.push(blog);
                                });
                                retVal = retVal.sort((a: any, b: any) => {
                                    return (a.created > b.created ? -1 : a.created < b.created ? 1 : 0);
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

export const aboutDobermans = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const query = request.query;
        const method = request.method;
        if (typeof query.key === 'undefined') {
            response.status(400).send('Missing API key');
        } else {
            if (query.key === getAPIKEY()) {
                if (method === 'GET') {
                    admin.firestore().collection('aboutDobermans').get()
                        .then(querySnapshot => {
                            if (querySnapshot.size > 0) {
                                const retVal = querySnapshot.docs[0].data().aboutDobermans;
                                response.status(200).send(retVal);
                            } else {
                                response.sendStatus(200);
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                } else if (method === 'PUT') {
                    const aboutDobermansData = request.body;
                    admin.firestore().collection('aboutDobermans').get()
                        .then(async (querySnapshot) => {
                            if (querySnapshot.size > 0) {
                                const aboutDobermansID = querySnapshot.docs[0].id;
                                const aboutDobermansRef = admin.firestore().collection('aboutDobermans').doc(aboutDobermansID);
                                aboutDobermansRef.set(aboutDobermansData, { merge: true })
                                    .then(() => {
                                        response.sendStatus(200);
                                    })
                                    .catch(err => {
                                        response.status(500).send(err);
                                    });
                            } else {
                                admin.firestore().collection('aboutDobermans').add(aboutDobermansData) 
                                    .then(() => {
                                        response.sendStatus(200);
                                    })
                                    .catch(err => {
                                        response.status(500).send(err);
                                    });
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        })
                } else {
                    response.status(400).send('Unsupported method');
                }
            } else {
                response.status(404).send('Incorrect API key.');
            }
        }
    });
});