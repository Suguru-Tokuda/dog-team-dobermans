import FirebaseService from './FirebaseService';

const admin = FirebaseService.getFirebaseAdmin();

export default class UserService {
    static getAllUsers(query: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const snapshot = await admin.firestore().collection('buyers').get();
                const retVal: any = [];
                if (snapshot.size > 0) {
                    for (const doc of snapshot.docs) {
                        const user = doc.data();
                        user.userID = doc.id;
                        const puppiesQuerySnapshot = await admin.firestore().collection('puppies').where('userID', '==', doc.id).get();
                        const puppiesArray: any = [];
                        let hasPartialPayment = false;

                        if (puppiesQuerySnapshot.size > 0) {
                            for (const puppyDoc of puppiesQuerySnapshot.docs) {
                                const puppyToPush = puppyDoc.data();
                                puppyToPush.puppyID = puppyDoc.id;
                                if (puppyToPush.price !== puppyToPush.paidAmount)
                                    hasPartialPayment = true;
                                puppiesArray.push(puppyToPush);
                            }
                        }

                        user.puppies = puppiesArray;
                        user.hasPartialPayment = hasPartialPayment;
                        retVal.push(user);
                    }
                    retVal.sort((a: any, b: any) => {
                        return a.firstName > b.firstName ? 1 : a.firstName < b.firstName ? -1 : 0;
                    });
                }
                resolve(retVal);
            } catch (err) {
                reject(err);
            }
        });
    }

    static searchUsers(searchKeywords: string) {
        return new Promise((resolve, reject) => {
            const searchKeywordsArr = searchKeywords.toLowerCase().split(' ');
            admin.firestore().collection('buyers').get()
                .then(querySnapshot => {
                    const retVal: any = [];
                    if (querySnapshot.size > 0) {
                        querySnapshot.forEach((doc) => {
                            const user = doc.data();
                            user.userID = doc.id;
                            let foundCount = 0;
                            searchKeywordsArr.forEach((searchKeyword: string) => {
                                if (typeof user.firstName !== 'undefined' && user.firstName.toLowerCase().indexOf(searchKeyword) !== -1)
                                    foundCount++;
                                if (typeof user.lastName !== 'undefined' && user.lastName.toLowerCase().indexOf(searchKeyword) !== -1)
                                    foundCount++;
                                if (typeof user.email !== 'undefined' && user.email.toLowerCase().indexOf(searchKeyword) !== -1)
                                    foundCount++;
                                if (typeof user.state !== 'undefined' && user.state.toLowerCase().indexOf(searchKeyword) !== -1)
                                    foundCount++;
                                if (typeof user.city !== 'undefined' && user.city.toLowerCase().indexOf(searchKeyword) !== -1)
                                    foundCount++;
                            });
                            if (foundCount > 0)
                                retVal.push(user)
                        });
                    }
                    resolve(retVal);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static checkEmailAvailability(email: string, userID: string = '') {
        return new Promise((resolve, reject) => {
            if (email && userID) {
                admin.firestore().collection('buyers').where('email', '==', email).get()
                    .then(querySnapshot => {
                        if (querySnapshot.size === 0) {
                            resolve(true);
                        } else {
                            const userIDCheck = querySnapshot.docs[0].id;
                            if (userID === userIDCheck)
                                resolve(true);
                            else {
                                resolve(false);
                            }
                        }
                    })
                    .catch(err => {
                        reject(err);
                    });
            } else if (email) {
                admin.firestore().collection('buyers').where('email', '==', email).get()
                    .then(querySnapshot => {
                        resolve(querySnapshot.size === 0);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }
        });
    }

    static getUserByID(userID: string) {
        return new Promise((resolve, reject) => {
            const buyerRef = admin.firestore().collection('buyers').doc(userID);
            buyerRef.get()
                .then(doc => {
                    let retVal: any = {};
                    if (typeof doc.data() !== undefined) {
                        retVal = doc.data();
                        retVal.userID = doc.id;
                    }
                    resolve(retVal);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static createUser(data: any) {
        return new Promise((resolve, reject) => {
            const { userID, firstName, lastName, email, phone, state, city } = data;
            data.statusID = 1;
            delete data.userID;

            data.lastModified = new Date().toISOString();

            if (firstName && lastName && email && phone && state && city) {
                data.registrationCompleted = true;
            } else {
                data.registrationCompleted = false;
            }

            // specifies the userID on create.
            admin.firestore().collection('buyers').doc(userID).set(data, { merge: true })
                .then(snapshot => {
                    const retVal = data;
                    resolve(retVal);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static updateUser(data: any) {
        return new Promise((resolve, reject) => {
            const { userID, firstName, lastName, email, phone, state, city } = data;
            delete data.userID;

            data.lastModified = new Date().toISOString();

            if (firstName && lastName && email && phone && state && city) {
                data.registrationCompleted = true;
            }

            // specifies the userID on create.
            admin.firestore().collection('buyers').doc(userID).set(data, { merge: true })
                .then(snapshot => {
                    const retVal = data;
                    resolve(retVal);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static deleteUser(userID: string) {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('buyers').doc(userID).set({statusID: 2}, {merge: true})
                .then(() => {
                    resolve(true);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}