import { Buyer } from "../models/buyer.model";
import { Puppy } from "../models/puppy.model";
import SortService from "./SortService";
import FirebaseService from "./FirebaseService";
import UtilService from "./UtilService";
import { Parent } from "../models/parent.model";

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
                    const userIDs: string[] = [];
                    const users: any[] = [];

                    if (querySnapshot.size > 0) {
                        for (const doc of querySnapshot.docs) {
                            const retVal = doc.data();
                            retVal.puppyID = doc.id;

                            if (query.includeBuyer === "true" && retVal.buyerID !== null) {
                                if (userIDs.indexOf(retVal.buyerID) !== -1)
                                    userIDs.push(retVal.buyerID);
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

                    if (userIDs.length > 0 && query.includeBuyer === 'true') {
                        const usersSnapshot = await admin.firestore().collection('buyers').where(admin.firestore.FieldPath.documentId(), 'in', userIDs).get();
                        for (const userDoc of usersSnapshot.docs) {
                            const user = userDoc.data();
                            user.userID = userDoc.id;
                            users.push(user);
                        }

                        puppyArr.forEach((puppy: any) => {
                            puppy.buyer = users.filter(user => user.userID === puppy.buyerID)[0];
                        });
                    }

                    SortService.quickSort(puppyArr, 'dateOfBirth', true);

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
    
                const retVal: Puppy = snapshot.data() as Puppy;
                if (retVal) {
                    retVal.puppyID = snapshot.id;
                    /* get dad and mom info */
                    const dadID = retVal.dadID;
                    const momID = retVal.momID;

                    const parents = await UtilService.getContentByID('parents', [dadID, momID], 'parentID', true);

                    if (parents && parents.length) {
                        retVal.dad = parents.filter(p => p.parentID === dadID)[0] as Parent;
                        retVal.mom = parents.filter(p => p.parentID === momID)[0] as Parent;
                    }

                    if (retVal.buyerID !== null) {
                        const buyerDoc = await admin.firestore().collection('buyers').doc(retVal.buyerID).get();
                        retVal.buyer = buyerDoc.data() as Buyer;
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