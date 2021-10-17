import FirebaseService from "./FirebaseService";

const admin = FirebaseService.getFirebaseAdmin();

export default class AboutUsService {
    static getAboutUs() {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('aboutUs').get()
                .then(querySnapshot => {
                    let retVal: any = {};

                    if (querySnapshot.size > 0) {
                        retVal = querySnapshot.docs[0].data();
                        retVal.aboutUsID = querySnapshot.docs[0].id;
                    }

                    resolve(retVal);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static updateMissionStatements(data: any) {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('aboutUs').get()
                .then(querySnapshot => {
                    if (querySnapshot.size > 0) {
                        const aboutUsData = {
                            missionStatements: data
                        };
                        const aboutUsID = querySnapshot.docs[0].id;
                        const aboutUsRef = admin.firestore().collection('aboutUs').doc(aboutUsID);
                        aboutUsRef.set(aboutUsData, { merge: true })
                            .then(() => {
                                resolve(true);
                            })
                            .catch(err => {
                                reject(err);
                            });
                    } else {
                        const aboutUsData = {
                            ourTeam: [],
                            missionStatements: data
                        };
                        admin.firestore().collection('aboutUs').add(aboutUsData)
                            .then(() => {
                                resolve(aboutUsData);
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

    static updateOurTeam(data: any) {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('aboutUs').get()
                .then(querySnapshot => {
                    if (querySnapshot.size > 0) {
                        const aboutUsData = {
                            ourTeam: data
                        };
                        const aboutUsID = querySnapshot.docs[0].id;
                        const aboutUsRef = admin.firestore().collection('aboutUs').doc(aboutUsID);
                        aboutUsRef.set(aboutUsData, { merge: true })
                            .then((res) => {
                                resolve(res);
                            })
                            .catch(err => {
                                reject(err);
                            });
                    } else {
                        const aboutUsData = {
                            ourTeam: data,
                            introductions: []
                        };
                        admin.firestore().collection('aboutUs').add(aboutUsData)
                            .then(() => {
                                resolve(aboutUsData);
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

    static getAboutDobermans() {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('aboutDobermans').get()
                .then(querySnapshot => {
                    let retVal: any = {};
                    if (querySnapshot.size > 0) {
                        retVal = querySnapshot.docs[0].data().aboutDobermans;
                    }
                    resolve(retVal);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static updateAboutDobermans(data: any) {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('aboutDobermans').get()
                .then(async (querySnapshot) => {
                    if (querySnapshot.size > 0) {
                        const aboutDobermansID = querySnapshot.docs[0].id;
                        const aboutDobermansRef = admin.firestore().collection('aboutDobermans').doc(aboutDobermansID);
                        aboutDobermansRef.set(data, { merge: true })
                            .then(() => {
                                resolve(true);
                            })
                            .catch(err => {
                                reject(err);
                            });
                    } else {
                        admin.firestore().collection('aboutDobermans').add(data)
                            .then(() => {
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