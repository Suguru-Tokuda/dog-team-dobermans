import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as formidable from 'formidable';
// import * as path from 'path';
// import * as os from 'os';

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
                            puppyArr.push({
                                id: doc.id,
                                data: doc.data()
                            });
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
                const id = query.id;
                if (request.method === 'GET') {
                    if (id.length > 0) {
                        const puppyRef = admin.firestore().collection('puppies').doc(id);
                        puppyRef.get().then(doc => {
                            response.status(200).send(doc.data());
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

export const puppyPictures = functions.https.onRequest(async (request, response) => {
    corsHeader(request, response, async () => {
        const form = new formidable.IncomingForm();
        return new Promise((resolve, reject) => {
            form.parse(request, function(err, fields, files) {
                const file = files.fileToUpload;
                console.log(file);
            });
        });
        // const pictures = request.body;
        // console.log(request.body);
        // if (pictures.length > 0) {
        //     const bucket = admin.storage().bucket();
        //     for (let i = 0, max = pictures.length; i < max; i++) {
        //         console.log('=========');
        //         console.log(os.tmpdir());
        //         console.log('=========');
        //         console.log('=========');
        //         console.log(pictures[i]);
        //         console.log('=========');
        //         const tempFilePath = path.join(`${os.tmpdir()}/puppies`, pictures[i].name);
        //         bucket.upload(tempFilePath, {
        //             destination: 'puppies',
        //             metadata: {
        //                 contentType: 'image/jpeg'
        //             }
        //         })
        //         .then(res => {
        //             console.log(res);
        //         })
        //         .catch(err => {
        //             console.log(err);
        //         });
        //     }
        // } else {
        //     response.status(400).send('No data included');
        // }
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
                            parentsArr.push({
                                id: doc.id,
                                data: doc.data()
                            });
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
        const id = query.id;
        if (typeof query.key === 'undefined') {
            response.status(400).send("Missing api key");
        } else if (query.key) {
            if (query.key !== API_KEY) {
                response.status(400).send("Incorrect API key");
            } else if (query.key === API_KEY) {
                if (method === 'GET') {
                    if (id.length > 0) {
                        const parentRef = admin.firestore().collection('parents').doc(id);
                        parentRef.get()
                            .then(doc => {
                                response.status(200).send(doc.data());
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
    });
});