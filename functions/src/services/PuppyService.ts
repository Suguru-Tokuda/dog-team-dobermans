import FirebaseService from "./FirebaseService";

const admin = FirebaseService.getFirebaseAdmin();

export default class PuppyService {
    static getAllPuppies(query: any) {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('puppies').get()
                .then(async querySnapshot => {
                    let limit: any = undefined;
                    if (query.limit !== undefined)
                        limit = parseInt(query.limit);

                    const puppyArr: any = [];

                    if (querySnapshot.size > 0) {
                        for (const doc of querySnapshot.docs) {
                            const retVal = doc.data();
                            retVal.puppyID = doc.id;

                            if (query.includeBuyer === "true" && retVal.buyerID !== null) {
                                try {
                                    const buyerDoc = await admin.firestore().collection('buyers').doc(retVal.buyerID).get();
                                    retVal.buyer = buyerDoc.data();
                                    retVal.buyer.buyerID = buyerDoc.id;
                                } catch (err) {
                                    reject(err);
                                }
                            }

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
                        }
                    }

                    puppyArr.sort((a: any, b: any) => {
                        return a.dateOfBirth < b.dateOfBirth ? 1 : a.dateOfBirth > b.dateOfBirth ? -1 : 0;
                    });

                    resolve(puppyArr);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static getPuppyByID(puppyID: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const snapshot = await admin.firestore().collection('puppies').doc(puppyID).get();
    
                const retVal = snapshot.data();
                if (retVal) {
                    retVal.puppyID = snapshot.id;
                    /* get dad and mom info */
                    const dadID = retVal.dadID;
                    const momID = retVal.momID;

                    const dadDoc = await admin.firestore().collection('parents').doc(dadID).get();
                    retVal.dad = dadDoc.data();
                    retVal.dad.dadID = dadID;
                    const momDoc = await admin.firestore().collection('parents').doc(momID).get();
                    retVal.mom = momDoc.data();
                    retVal.mom.momID = momID;

                    if (retVal.buyerID !== null) {
                        const buyerDoc = await admin.firestore().collection('buyers').doc(retVal.buyerID).get();
                        retVal.buyer = buyerDoc.data();
                        retVal.buyer.buyerID = buyerDoc.id;
                    }

                    resolve(retVal);
                } else {
                    reject('Puppy was not found.');
                }
            } catch (err) {
                reject (err);
            }
        });
    }

    static getPuppiesByBuyerID(buyerID: string) {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('puppies').where('buyerID', '==', buyerID).get()
            .then(querySnapshot => {
                const puppiesArray: any[] = [];
                for (const puppyDoc of querySnapshot.docs) {
                    const puppyToPush = puppyDoc.data();
                    puppyToPush.puppyID = puppyDoc.id;
                    puppiesArray.push(puppyToPush);
                }
                resolve(puppiesArray);
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    static createPuppy(data: any) {
        return new Promise((resolve, reject) => {
            data.statusID = 1;

            admin.firestore().collection('puppies').add(data)
                .then(snapshot => {
                    const retVal = data;
                    retVal.puppyID = snapshot.id;
                    resolve(retVal);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static updatePuppy(data: any) {
        return new Promise((resolve, reject) => {
            const puppyRef = admin.firestore().collection('puppies').doc(data.puppyID);
            puppyRef.set(data, { merge: true })
                .then(() => {
                    const retVal = data;
                    retVal.puppyID = data.puppyID;
                    resolve(retVal);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static deletePuppy(puppyID: string) {
        return new Promise(async (resolve, reject) => {
            const ref = admin.firestore().collection('puppies').doc(puppyID);

            try {
                const snapshot = await ref.get();
                const retVal: any = snapshot.data();

                retVal.statusID = 2;

                await ref.set(retVal, {merge: true});
                retVal.puppyID = snapshot.id;

                resolve(retVal);
            } catch (err) {
                reject(err);
            }
        });
    }

    static processPuppyTransaction(transactionData: any) {
        return new Promise(async (resolve, reject) => {
            const puppyRef = admin.firestore().collection('puppies').doc(transactionData.puppyID);
            const buyerRef = admin.firestore().collection('buyers').doc(transactionData.buyerID);

            try {
                const puppySnapshot = await puppyRef.get();
                const buyerSnapshot = await buyerRef.get();

                const puppyData = puppySnapshot.data();
                const buyerData = buyerSnapshot.data();

                if (puppyData) {
                    puppyData.buyerID = transactionData.buyerID;
                    puppyData.paidAmount += transactionData.paidAmount;
                    puppyData.sold = true;

                    if (puppyData.soldDate === null)
                        puppyData.soldDate = new Date();
                    await puppyRef.set(puppyData, { merge: true });
                }

                if (buyerData) {
                    if (buyerData.puppyIDs.indexOf(transactionData.puppyID) === -1) {
                        buyerData.puppyIDs.push(transactionData.puppyID);
                        await buyerRef.set(buyerData, { merge: true });
                    }
                }

                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }

    static cancelTransaction(puppyID: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const puppyRef = admin.firestore().collection('puppies').doc(puppyID);
                const puppySnapshot = await puppyRef.get();
                const puppyData = puppySnapshot.data();

                if (puppyData) {
                    const buyerID = puppyData.buyerID;
                    puppyData.buyerID = null;
                    puppyData.paidAmount = 0;
                    puppyData.sold = false;
                    puppyData.soldDAte = null;
                    
                    const buyerRef = admin.firestore().collection('buyers').doc(buyerID);
                    const buyerSnapshot = await buyerRef.get();
                    const buyerData = buyerSnapshot.data();

                    if (buyerData) {
                        const index = buyerData.puppyIDs.indexOf(puppyID);
                        if (index !== -1) {
                            buyerData.puppyIDs.splice(index, 1);
                            await buyerRef.set(buyerData, { merge: true });
                        }
                    } else {
                        reject('Buyer was not found.');
                    }

                    await puppyRef.set(puppyData, { merge: true });

                    resolve(200);
                } else {
                    reject('Puppy was not found.')
                }
            } catch (err) {
                reject(err);
            }
        });
    }
}