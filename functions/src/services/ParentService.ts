import FirebaseService from "./FirebaseService";

const admin = FirebaseService.getFirebaseAdmin();

export default class ParentService {
    static getAllParents(query: any) {
        return new Promise((resolve, reject) => {
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
                resolve(parentsArr);
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    static getParentByID(parentID: string) {
        return new Promise((resolve, reject) => {
            const parentRef = admin.firestore().collection('parents').doc(parentID);
            parentRef.get()
                .then(doc => {
                    let retVal: any = {};
                    if (typeof doc.data() !== undefined) {
                        retVal = doc.data();
                        retVal.parentID = doc.id;
                    }
                    resolve(retVal);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static createParent(data: any) {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('parents').add(data)
            .then(snapshot => {
                const retVal = data;
                retVal.parentID = snapshot.id;
                resolve(retVal);
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    static updateParent(data: any) {
        return new Promise((resolve, reject) => {
            const parentRef = admin.firestore().collection('parents').doc(data.parentID);
            parentRef.set(data, { merge: true })
                .then(snapshot => {
                    const retVal = data;
                    retVal.parentID = data.parentID;
                    resolve(retVal);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static deleteParent(parentID: string) {
        return new Promise((resolve, reject) => {
            const parentRef = admin.firestore().collection('parents').doc(parentID);
            parentRef.set({ statusID: 2}, { merge: true })
                .then(res => {
                    resolve(true);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}