import FirebaseService from "./FirebaseService";

const admin = FirebaseService.getFirebaseAdmin();

export default class ContactService {
    static getContact() {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('contact').get()
                .then(querySnapshot => {
                    let retVal: any = {};
                    if (querySnapshot.size > 0) {
                        const docs = querySnapshot.docs;
                        const doc = docs[0];
                        retVal = doc.data();
                        retVal.contactID = doc.id;
                    }
                    resolve(retVal);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static updateContact(data: any) {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('contact').get()
                .then(querySnapshot => {
                    if (querySnapshot.size > 0) {
                        // update
                        const contactID = data.contactID;
                        const contactRef = admin.firestore().collection('contact').doc(contactID);
                        delete data.contactID;
                        contactRef.set(data, { merge: true })
                            .then(() => {
                                const retVal = data;
                                retVal.contactUsID = contactID;
                                resolve(retVal);
                            })
                            .catch(err => {
                                reject(err);
                            });
                    } else {
                        // create new
                        admin.firestore().collection('contact').add(data)
                            .then(snapshot => {
                                resolve(true);
                            })
                            .catch(err => {
                                reject(err);
                            });
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}