import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';

admin.initializeApp(functions.config().firease);

const API_KEY = "AIzaSyAECZwk3f30Nd3kcViscEEADiWW01VI9xs";
const corsHeader = cors({ origin: true });

// get all puppies
export const puppies = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const query = request.query;
        if (typeof query.key === 'undefined') {
            response.status(400).send("Missing api key");
        } else if (query.key) {
            if (query.key !== API_KEY) {
                response.status(400).send("Incorrect API key");
            } else if (query.key === API_KEY) {
                admin.firestore().collection('puppies').get()
                .then(querySnapshot => {
                    const puppyArr: any = [];
                    if (querySnapshot.size > 0) {
                        querySnapshot.forEach((doc) => {
                            const retVal = doc.data();
                            retVal.puppyId = doc.id;
                            puppyArr.push(retVal);
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
            response.status(400).send("Missing api key");
        } else if (query.key) {
            if (query.key !== API_KEY) {
                response.status(400).send("Incorrect API key");
            } else if (query.key === API_KEY) {
                const id = query.puppyId;
                if (request.method === 'GET') {
                    if (id.length > 0) {
                        const puppyRef = admin.firestore().collection('puppies').doc(id);
                        puppyRef.get().then(doc => {
                            let retVal: any = {};
                            if (typeof doc.data() !== undefined) {
                                retVal = doc.data();
                                retVal.puppyId = doc.id;
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
                    admin.firestore().collection('/puppies').add(data)
                        .then(snapshot => {
                            response.status(201).json({ id: snapshot.id, data: data });
                        })
                        .catch(err => {
                            response.sendStatus(500).send(err);
                        });
                } else if (request.method === 'PUT') {
                    if (id.length > 0) {
                            const data = request.body;
                            const puppyRef = admin.firestore().collection('puppies').doc(id);
                            puppyRef.set(data, { merge: true })
                                .then(snapshot => {
                                    response.status(200).json({ id: id, data: data });
                                })
                                .catch(err => {
                                    response.sendStatus(500).send(err);
                                });
                        }
                } else if (request.method === 'DELETE') {
                    if (id.length > 0) {
                            const puppyRef = admin.firestore().collection('puppies').doc(id);
                            puppyRef.delete()
                                .then(res => {
                                    response.status(200).json({ id: id });
                                })
                                .catch(err => {
                                    response.sendStatus(500).send(err);
                                });
                        } else {
                        response.status(400).send('Invalid Id');
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
            response.status(400).send("Missing api key");
        } else if (query.key) {
            if (query.key !== API_KEY) {
                response.status(400).send("Incorrect API key");
            } else if (query.key === API_KEY) {
                admin.firestore().collection('parents').get()
                .then(querySnapshot => {
                    const parentsArr: any = [];
                    if (querySnapshot.size > 0) {
                        querySnapshot.forEach((doc) => {
                            const retVal = doc.data();
                            retVal.parentId = doc.id;
                            parentsArr.push(retVal);
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
        const id = query.parentId;
        const path = request.path;
        if (typeof query.key === 'undefined') {
            response.status(400).send("Missing api key");
        } else if (query.key) {
            if (query.key !== API_KEY) {
                response.status(400).send("Incorrect API key");
            } else if (query.key === API_KEY) {
                if (path === '/') {
                    if (method === 'GET') {
                        if (id.length > 0) {
                            const parentRef = admin.firestore().collection('parents').doc(id);
                            parentRef.get()
                                .then(doc => {
                                    let retVal: any = {};
                                    if (typeof doc.data() !== undefined) {
                                        retVal = doc.data();
                                        retVal.parentId = doc.id;
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
                                response.status(201).json({ id: snapshot.id, data: data });
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
                                    response.status(200).json({ id: id, data: data });
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
                                    response.status(200).json({ id: id });
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
        const id = query.buyerId;
        if (typeof query.key === 'undefined') {
            response.status(400).send("Missing api key");
        } else if (query.key === API_KEY) {
            if (path === '/') {
                if (method === 'GET') {
                    if (id.length > 0) {
                        const buyerRef = admin.firestore().collection('buyers').doc(id);
                        buyerRef.get()
                            .then(doc => {
                                let retVal: any = {};
                                if (typeof doc.data() !== undefined) {
                                    retVal = doc.data();
                                    retVal.buyerId = doc.id;
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
                            retVal.buyerId = snapshot.id;
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
                const searchKeyword = query.searchKeyword.toLowerCase();
                admin.firestore().collection('buyers').get()
                    .then(querySnapshot => {
                        const buyersArr: any = [];
                        if (querySnapshot.size > 0) {
                            querySnapshot.forEach((doc) => {
                                const retVal = doc.data();
                                retVal.buyerId = doc.id;
                                let found = false;
                                if (typeof retVal.firstName !== 'undefined' && searchKeyword.indexOf(retVal.firstName.toLowerCase()) !== -1)
                                        found = true;
                                if (typeof retVal.lastName !== 'undefined' && searchKeyword.indexOf(retVal.lastName.toLowerCase()) !== -1)
                                        found = true;
                                if (typeof retVal.email !== 'undefined' && searchKeyword.indexOf(retVal.email.toLowerCase() !== -1))
                                        found = true;
                                if (typeof retVal.state !== 'undefined' && searchKeyword.indexOf(retVal.state.toLowerCase() !== -1))
                                        found = true;
                                if (typeof retVal.city !== 'undefined' && searchKeyword.indexOf(retVal.city.toLowerCase() !== -1))
                                        found = true;
                                if (found === true)
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
            response.status(400).send('Missing api key');
        } else if (query.key) {
            if (query.key !== API_KEY) {
                response.status(400).send('Incorrect API key');
            } else if (query.key === API_KEY) {
                admin.firestore().collection('buyers').get()
                    .then(querySnapshot => {
                        const buysersArr: any = [];
                        if (querySnapshot.size > 0) {
                            querySnapshot.forEach((doc) => {
                                const retVal = doc.data();
                                retVal.buyerId = doc.id;
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