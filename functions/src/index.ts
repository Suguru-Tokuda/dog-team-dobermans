import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';

admin.initializeApp(functions.config().firease);

const API_KEY = "xVgOiL6lkEvzL5PVekwe2M7zYkYmq7kfCiHPJ4FEEJhc9I2PcgGKCkNpsWt36yAfssyJGIBUBtYQEMEpK7s6TinhLfqUNMOYQatD";
const corsHeader = cors({ origin: true });

// get all puppies
export const puppies = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const query = request.query;
        if (typeof query.key === 'undefined') {
            response.status(400).send("Missing API key");
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
                            retVal.puppyID = doc.id;
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
            response.status(400).send("Missing API key");
        } else if (query.key) {
            if (query.key !== API_KEY) {
                response.status(400).send("Incorrect API key");
            } else if (query.key === API_KEY) {
                const puppyId = query.puppyID;
                if (request.method === 'GET') {
                    if (puppyId.length > 0) {
                        const puppyRef = admin.firestore().collection('puppies').doc(puppyId);
                        puppyRef.get().then(doc => {
                            let retVal: any = {};
                            if (typeof doc.data() !== undefined) {
                                retVal = doc.data();
                                retVal.puppyID = doc.id;
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
                            const retVal = data;
                            retVal.puppyID = snapshot.id;
                            response.status(201).send(retVal);
                        })
                        .catch(err => {
                            response.sendStatus(500).send(err);
                        });
                } else if (request.method === 'PUT') {
                    if (puppyId.length > 0) {
                            const data = request.body;
                            const puppyRef = admin.firestore().collection('puppies').doc(puppyId);
                            puppyRef.set(data, { merge: true })
                                .then(() => {
                                    const retVal = data;
                                    retVal.puppyID = puppyId;
                                    response.status(200).send(retVal);
                                })
                                .catch(err => {
                                    response.sendStatus(500).send(err);
                                });
                        }
                } else if (request.method === 'DELETE') {
                    if (puppyId.length > 0) {
                            const puppyRef = admin.firestore().collection('puppies').doc(puppyId);
                            puppyRef.delete()
                                .then(res => {
                                    response.status(200);
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
            response.status(400).send("Missing API key");
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
                            retVal.parentID = doc.id;
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
        const id = query.parentID;
        const path = request.path;
        if (typeof query.key === 'undefined') {
            response.status(400).send("Missing API key");
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
            if (query.key !== API_KEY) {
                response.status(400).send('Incorrect API key');
            } else if (query.key === API_KEY) {
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
        } else if (query.key === API_KEY) {
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
            } else if (path === '/introductions') {
                if (method === 'PUT') {
                    admin.firestore().collection('aboutUs').get()
                        .then(querySnapshot => {
                            const data = request.body;
                            if (querySnapshot.size > 0) {
                                const aboutUsData = {
                                    introductions: data
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
                                    ourTeam: [],
                                    introductions: data
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
            }
        }
    });
});

export const testimonials = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        // const method = request.method;
        const query = request.query;
        const path = request.path;
        if (typeof query.key === 'undefined') {
                response.status(400).send('Missing API key');
        } else if (query.key === API_KEY) {
            if (path === '/') {
                admin.firestore().collection('testimonials').get()
                    .then(querySnapshot => {
                        const testimonialsArr: any = [];
                        if (querySnapshot.size > 0) {
                            querySnapshot.forEach((doc) => {
                                const testimonial = doc.data();
                                testimonial.testimonialID = doc.id;
                                testimonialsArr.push(testimonial);
                            });
                        }
                        response.status(200).send(testimonialsArr)
                    })
                    .catch(err => {
                        response.status(500).send(err);
                    });
            } else if (path === '/live') {
                admin.firestore().collection('testimonials').get()
                    .then(querySnapshot => {
                        const testimonialsArr: any = [];
                        if (querySnapshot.size > 0) { 
                            querySnapshot.forEach((doc) => {
                                const testimonial = doc.data();
                                testimonial.testimonialID = doc.id;
                                if (testimonial.live === true) {
                                    testimonialsArr.push(testimonial);
                                }
                            });
                        }
                        if (testimonialsArr.length > 0) {
                            response.status(200).send(testimonialsArr)
                        } else {
                            response.status(200).send({});
                        }
                    })
                    .catch(err => {
                        response.status(500).send(err);
                    });
            }
        }
    });
});

export const contactus = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const query = request.query;
        const method = request.method;
        if (typeof query.key === 'undefined') {
            response.status(400).send('Missing API key');
        } else if (query.key === API_KEY) {
            if (method === 'GET') {
                admin.firestore().collection('contactUs').get()
                    .then(querySnapshot => {
                        if (querySnapshot.size > 0) {
                            const docs = querySnapshot.docs;
                            const doc = docs[0];
                            const retVal = doc.data();
                            retVal.contactUsID = doc.id;
                            response.status(200).send(retVal);
                        } else {
                            response.status(200).send({});
                        }
                    })
                    .catch(err => {
                        response.status(500).send(err);
                    });
            } else if (method === 'PUT') {
                admin.firestore().collection('contactUs').get()
                    .then(querySnapshot => {
                        if (querySnapshot.size > 0) {
                            // update
                            const contactUsID = query.contactUsID;
                            const data = request.body;
                            const contactUsRef = admin.firestore().collection('contactUs').doc(contactUsID);
                            contactUsRef.set(data, { merge: true })
                                .then(() => {
                                    const retVal = data;
                                    retVal.contacdtUsID = contactUsID;
                                    response.status(201).send(retVal);
                                })
                                .catch(err => {
                                    response.status(500).send(err);
                                });
                        } else {
                            const data = request.body;
                            // create new
                            admin.firestore().collection('/contactUs').add(data)
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