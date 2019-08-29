import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firease);

// get all puppies
export const puppies = functions.https.onRequest((request, response) => {
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
});

// puppy CRUD
export const puppy = functions.https.onRequest((request, response) => {
    const id = request.url.replace('/', '');
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
});

// get all parents
export const parents = functions.https.onRequest((request, response) => {
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
});

// parent CRUD
export const parent = functions.https.onRequest((request, response) => {
    const method = request.method;
    const id = request.url.replace('/', '');
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
});