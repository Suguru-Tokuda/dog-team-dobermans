import FirebaseService from "./FirebaseService";

const admin = FirebaseService.getFirebaseAdmin();

export default class HomepageContentService {

    static getHomepageContents() {
        return new Promise((res, rej) => {
            admin.firestore().collection('homepageContents').get()
                .then((querySnapshot: { size: number; docs: { data: () => unknown; }[]; }) => {
                    if (querySnapshot.size > 0) {
                        res(querySnapshot.docs[0].data());
                    } else {
                        rej();
                    }
                })
                .catch((err: any) => {
                    rej(err);
                });
        });
    }

    static createHomepageContent(data: any) {
        return new Promise((res, rej) => {
            admin.firestore().collection('homepageContents').get()
                .then(async (querySnapshot: { size: number; docs: { id: any; }[]; }) => {
                    if (querySnapshot.size > 0) {
                        const homepageContentID = querySnapshot.docs[0].id;
                        const homepageContentRef = admin.firestore().collection('homepageContents').doc(homepageContentID);
                        homepageContentRef.set(data, { merge: true })
                            .then(() => {
                                res(true);
                            })
                            .catch((err: any) => {
                                rej(err);
                            });
                    } else {
                        admin.firestore().collection('homepageContents').add(data)
                            .then(() => {
                                res(true);
                            })
                            .catch((err: any) => {
                                rej(err);
                            });
                    }
                })
                .catch(() => {
                    admin.firestore().collection('homepageContents').add(data)
                        .then(() => {
                            res(true);
                        })
                        .catch((err: any) => {
                            rej(err);
                        });
                });
        });
    }

    static getPuppyMessage() {
        return new Promise((res, rej) => {
            admin.firestore().collection('homepageContents').get()
            .then((querySnapshot: any) => {
                if (querySnapshot.size > 0) {
                    res(querySnapshot.docs[0].data().puppyMessage);
                }
            })
            .catch((err: any) => {
                rej(err);
            });
        });
    }
}