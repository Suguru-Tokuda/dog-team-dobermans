import FirebaseService from "./FirebaseService";
import EmailService from "./EmailService";
import ConfigService from "./ConfigService";
import UtilService from "./UtilService";
import SortService from "./SortService";
import SearchService from "./SearchService";

const admin = FirebaseService.getFirebaseAdmin();

export default class WaitlistService {
    static getAllWaitRequests(recipientID: string) {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('waitList').get()
                .then(async querySnapshot => {
                    const retVal: any = [];

                    if (querySnapshot.size > 0) {

                        for (const waitRequestDoc of querySnapshot.docs) {
                            const waitRequest = waitRequestDoc.data();
                            waitRequest.waitRequestID = waitRequestDoc.id;

                            if (waitRequest.puppyID) {
                                try {
                                    const puppyDoc = await admin.firestore().collection('puppies').doc(waitRequest.puppyID).get();
                                    const puppyData: any = puppyDoc.data();
                                    waitRequest.puppyName = puppyData.name;
                                } catch (err) {
                                    console.log(err);
                                }
                            }

                            waitRequest.numberOfUnreadMessages = 0;
                            waitRequest.hasUnRepliedMessage = false;

                            if (waitRequest.userID) {
                                try {
                                    const userDoc = await admin.firestore().collection('buyers').doc(waitRequest.userID).get();
                                    const userData: any = userDoc.data();

                                    const { firstName, lastName, email, phone, city, state } = userData;

                                    waitRequest.firstName = firstName;
                                    waitRequest.lastName = lastName;
                                    waitRequest.email = email;
                                    waitRequest.phone = phone;
                                    waitRequest.city = city;
                                    waitRequest.state = state;
                                    
                                    const messagesRef = admin.firestore().collection('messages');
                                    const snapshot = await messagesRef.where('waitRequestID', '==', waitRequest.waitRequestID).get();

                                    if (snapshot.size > 0 && recipientID) {
                                        const messages = [];
                                        const allMessages = [];

                                        for (const messageDoc of snapshot.docs) {
                                            const message = messageDoc.data();
                                            message.messageID = messageDoc.id;

                                            if (message.read === false && message.recipientID === recipientID) {
                                                waitRequest.numberOfUnreadMessages++;
                                            }

                                            if (message.recipientID === recipientID)
                                                messages.push(message);

                                            allMessages.push(message);
                                        }

                                        messages.sort((a: any, b: any) => {
                                            const sentDateA = new Date(a.sentDate);
                                            const sentDateB = new Date(b.sentDate);

                                            return sentDateA > sentDateB ? -1 : sentDateA > sentDateB ? 1 : 0;
                                        });

                                        allMessages.sort((a: any, b: any) => {
                                            const sentDateA = new Date(a.sentDate);
                                            const sentDateB = new Date(b.sentDate);

                                            return sentDateA > sentDateB ? -1 : sentDateA > sentDateB ? 1 : 0;
                                        });

                                        if (messages.length > 0) {
                                            waitRequest.lastMessageFromUser = messages[0];
                                        }

                                        if (allMessages[0].recipientID === recipientID)
                                            waitRequest.hasUnRepliedMessage = true;                                                    
                                    }
                                } catch (err) {
                                    console.log(err);
                                }
                            }

                            retVal.push(waitRequest);
                        }

                        retVal.sort((a: any, b: any) => {
                            return a.created > b.created ? -1 : (a.created < b.created ? 1 : 0);
                        });
                    }

                    resolve(retVal);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    
    static getWaitRequestsByRange(data: any) {
        return new Promise(async (resolve, reject) => {
            try {
                /* can be sorted by: color, created, lastModified, message, notified, firstName, lastName, email */
                /* Get all wait requests and users (sorted by userID) first. */
                const { startIndex, endIndex, activeOnly, searchText, recipientID } = data;
                let { sortField, sortDescending } = data;
                let totalItems: number;
    
                const users: any[] = [];
                let waitRequests: any[] = [];
                let userObj: any;
                let waitRequestObj: any;
    
                const userSnapshot = await admin.firestore().collection('buyers').get();
                const waitRequestSnapshot = await admin.firestore().collection('waitList').get();
    
                for (const user of userSnapshot.docs) {
                    userObj = user.data();
                    userObj.userID = user.id;
                    users.push(userObj);
                }
    
                /* quicksort */
                SortService.quickSort(users, 'userID', false);
    
                /* Iterate wait list and assign user value */
                for (const waitRequest of waitRequestSnapshot.docs) {
                    waitRequestObj = waitRequest.data();
                    waitRequestObj.waitRequestID = waitRequest.id;
                    waitRequestObj.numberOfUnreadMessages = 0;
                    waitRequestObj.lastMessageFromUser = null;
                    waitRequestObj.hasUnRepliedMessage = false;

                    if (activeOnly === true && waitRequestObj.statusID === 2)
                        continue;
    
                    if (waitRequestObj.userID) {
                        const userIndex = SearchService.binarySearch(users, waitRequestObj.userID, 'userID');
                        if (userIndex !== -1) {
                            userObj = users[userIndex];
                            waitRequestObj.user = userObj;
                            waitRequestObj.firstName = userObj.firstName;
                            waitRequestObj.lastName = userObj.lastName;
                            waitRequestObj.email = userObj.email;
                            waitRequestObj.city = userObj.city;
                            waitRequestObj.state = userObj.state;
                            waitRequestObj.phone = userObj.phone;
                        }
                    }
    
                    waitRequests.push(waitRequestObj);
                }

                /* if there is searchText available, filter for it */
                if (searchText) {
                    const searchTextArr: string[] = searchText.toLowerCase().split(' ');
                    const uniqueKeywords: string[] = [];

                    for (const keyword of searchTextArr) {
                        if (uniqueKeywords.indexOf(keyword) === -1)
                            uniqueKeywords.push(keyword);
                    }

                    let foundCount: number;
                    const testCount: number = uniqueKeywords.length;

                    waitRequests = waitRequests.filter(waitRequest => {
                        foundCount = 0;
                        const name = `${waitRequest.firstName.toLowerCase()} ${waitRequest.lastName.toLowerCase()}`;
                        let {waitRequestID, email, city, state} = waitRequest;
                        const {phone} = waitRequest;
                        waitRequestID = waitRequestID.toLowerCase();

                        if (email)
                            email = email.toLowerCase();
                        if (city)
                            city = city.toLowerCase();
                        if (state)                        
                            state = state.toLowerCase();

                        for (const keyword of uniqueKeywords) {
                            if (waitRequestID === keyword)
                                foundCount++;
                            if (name.indexOf(keyword) !== -1 || (email && email.indexOf(keyword) !== -1))
                                foundCount++;
                            if (city && city.indexOf(keyword) !== -1)
                                foundCount++;
                            if (state && state.indexOf(keyword) !== -1)
                                foundCount++;
                            if (phone && phone.indexOf(keyword) !== -1)
                                foundCount++;
                        }

                        return foundCount === testCount;
                    });
                }
    
                /* do quick sort */
                if (!sortField) {
                    sortField = 'created';
                    sortDescending = true;
                }
    
                SortService.quickSort(waitRequests, sortField, sortDescending);
                /* Get the number of total items before slicing */
                totalItems = waitRequests.length;   
                waitRequests = waitRequests.slice(startIndex, endIndex);

                /* Assign messages */
                if (recipientID) {
                    for (const waitRequest of waitRequests) {
                        const messageSnapshot = await admin.firestore().collection('messages').where('waitRequestID', '==', waitRequest.waitRequestID).get();
    
                        if (messageSnapshot.size > 0) {
                            const messages = [];
                            const allMessages = [];
    
                            for (const doc of messageSnapshot.docs) {
                                const message = doc.data();
                                message.messageID = doc.id;
    
                                if (message.read === false && message.recipientID === recipientID)
                                    waitRequest.numberOfUnreadMessages++;
    
                                if (message.recipientID === recipientID)
                                    messages.push(message);
    
                                allMessages.push(message);
                            }
    
                            if (messages.length > 0) {
                                SortService.quickSort(messages, 'sentDate', true);
                                waitRequest.lastMessageFromUser = messages[0];
                            }

                            if (allMessages.length > 0) {
                                SortService.quickSort(allMessages, 'sentDate', true);
                                if (allMessages[0].recipientID === recipientID)
                                    waitRequest.hasUnRepliedMessage = true;
                            }
                        }    
                    }
                }
    
                resolve({
                    waitRequests: waitRequests,
                    totalItems: totalItems
                });
            } catch (err) {
                reject(err);
            }
        });
    }
    

    static getWaitRequestByID(waitRequestID: string, recipientID: string) {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('waitList').doc(waitRequestID).get()
                .then(async doc => {
                    let retVal: any = {};
                    retVal = doc.data();

                    // load puppyName
                    if (retVal.puppyID) {
                        try {
                            const puppyDoc = await admin.firestore().collection('puppies').doc(retVal.puppyID).get();
                            const puppyData: any = puppyDoc.data();
                            puppyData.puppyID = retVal.puppyID;
                            retVal.puppy = puppyData;
                        } catch (err) {
                            console.log(err);
                        }
                    }

                    retVal.numberOfUnreadMessages = 0;
                    retVal.hasUnRepliedMessage = false;

                    // load buyer information
                    if (retVal.userID !== undefined) {
                        try {
                            const userDoc = await admin.firestore().collection('buyers').doc(retVal.userID).get();
                            const userData: any = userDoc.data();

                            const { firstName, lastName, email, phone, state, city } = userData;

                            retVal.firstName = firstName;
                            retVal.lastName = lastName;
                            retVal.email = email;
                            retVal.phone = phone;
                            retVal.state = state;
                            retVal.city = city;

                            const messagesRef = admin.firestore().collection('messages');
                            const snapshot = await messagesRef.where('waitRequestID', '==', waitRequestID).get();

                            const messages = [];

                            if (snapshot.size > 0  && recipientID) {
                                for (const messageDoc of snapshot.docs) {
                                    const message = messageDoc.data();
                                    message.messageID = messageDoc.id;

                                    if (message.read === false && message.recipientID === recipientID) {
                                        retVal.numberOfUnreadMessages++;
                                    }

                                    messages.push(message);
                                }
                                messages.sort((a: any, b: any) => {
                                    const sentDateA = new Date(a.sentDate);
                                    const sentDateB = new Date(b.sentDate);

                                    return sentDateA > sentDateB ? -1 : sentDateA > sentDateB ? 1 : 0;
                                });

                                if (messages[0].recipientID !== recipientID)
                                    retVal.hasUnRepliedMessage = true;
                            }

                            retVal.messages = messages;
                        } catch (err) {
                            console.log(err);
                        }
                    }

                    retVal.waitRequestID = doc.id;
                    resolve(retVal);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static getWaitRequestByIDs(waitRequestIDs: string[]) {
        return new Promise(async (resolve, reject) => {
            try {
                const waitRequestSnapshot = await admin.firestore().collection('waitList').get();
                const userSnapshot = await admin.firestore().collection('buyers').get();
    
                const waitRequests: any[] = [];
                const users: any[] = [];
    
                for (const doc of userSnapshot.docs) {
                    const user = doc.data();
                    user.userID = doc.id;
    
                    const insertIndex = SearchService.getInsertIndex(users, user.userID, 'userID');
                    if (insertIndex !== -1)
                        users.push(user);
                }
    
                for (const doc of waitRequestSnapshot.docs) {
                    if (waitRequestIDs.indexOf(doc.id) !== -1) {
                        const waitRequest = doc.data();
                        waitRequest.waitRequestID = doc.id;
    
                        if (waitRequest.userID) {
                            const index = SearchService.binarySearch(users, waitRequest.userID, 'userID');
    
                            if (index !== -1) {
                                waitRequest.user = users[index];
                                waitRequest.firstName = waitRequest.user.firstName;
                                waitRequest.lastName = waitRequest.user.lastName;
                                waitRequest.email = waitRequest.user.email;
                                waitRequest.city = waitRequest.user.city;
                                waitRequest.state = waitRequest.user.state;
                                waitRequest.phone = waitRequest.user.phone;
                            }
                        }
    
                        waitRequests.push(waitRequest);
                    }
                }
    
                resolve(waitRequests);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getWaitRequestsByUserID(userID: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const waitListItems = await admin.firestore().collection('waitList').where('userID', '==', userID).get();
                const retVal = [];
    
                if (waitListItems.size > 0) {
                    for (const doc of waitListItems.docs) {
                        const waitRequest = doc.data();
    
                        waitRequest.waitRequestID = doc.id;
    
                        if (waitRequest.puppyID) {
                            try {
                                const puppyDoc = await admin.firestore().collection('puppies').doc(waitRequest.puppyID).get();
                                const puppyData: any = puppyDoc.data();
    
                                waitRequest.puppy = puppyData;
                            } catch (err) {
                                console.log(err);
                            }
                        }
    
                        if (waitRequest.userID) {
                            try {
                                const messagesRef = admin.firestore().collection('messages');
                                const snapshot = await messagesRef.where('waitRequestID', '==', waitRequest.waitRequestID).get();
    
                                waitRequest.numberOfUnreadMessages = 0;
    
                                if (snapshot.size > 0) {
                                    for (const messageDoc of snapshot.docs) {
                                        const message = messageDoc.data();
                                        message.messageID = messageDoc.id;
    
                                        if (message.read === false && message.recipientID === userID) {
                                            waitRequest.numberOfUnreadMessages++;
                                        }
                                    }
                                }
                            } catch (err) {
                                console.log(err);
                            }
                        }
    
                        retVal.push(waitRequest);
                    }
                }
                
                resolve(retVal);
            } catch (err) {
                reject(err);
            }
        });
    }

    static createWaitRequest(data: any) {
        return new Promise(async (resolve, reject) => {
            data.statusID = 1;
            try {
                const snapshot = await admin.firestore().collection('waitList').add(data);
                const waitRequestID = snapshot.id;
                const { userID, color, puppyID, message } = data;
                const buyerDoc = await admin.firestore().collection('buyers').doc(userID).get();
                const buyerData: any = buyerDoc.data();
                const { firstName, lastName, email, phone } = buyerData;
    
                await this.sendNotificationForWaitList(firstName, lastName, email, phone, message, puppyID, color, waitRequestID);
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }

    static createWaitRequestByEmail(data: any) { 
        return new Promise(async (resolve, reject) => { 
            /* check if there's a user by email first.
               If there's no user, then create a new user.
            */
            let user: any = {};
            const currentDate = new Date().toISOString();

            try {
                const querySnapshot = await admin.firestore().collection('buyers').where('email', '==', data.email.toLowerCase()).get();

                if (querySnapshot.size > 0) {
                    user = querySnapshot.docs[0].data();
                    const userID = querySnapshot.docs[0].id;

                    user.firstName = data.firstName;
                    user.lastName = data.lastName;
                    user.phone = data.phone;
                    user.city = data.city;
                    user.state = data.state;
                    user.lastModified = currentDate;

                    await admin.firestore().collection('buyers').doc(userID).set(user, { merge: true });

                    user.userID = userID;
                } else {

                    const userInsertData = {
                        email: data.email.toLowerCase(),
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phone: data.phone,
                        city: data.city,
                        state: data.state,
                        createDate: currentDate,
                        lastModified: currentDate,
                        statusID: 1
                    };
                    const userInsertRes = await admin.firestore().collection('buyers').add(userInsertData);

                    user = userInsertData;
                    user.userID = userInsertRes.id;
                }

                // create a puppy request

                const puppyRequestData: any = {
                    color: data.color,
                    message: data.message,
                    puppyID: data.puppyID ? data.puppyID : '',
                    userID: user.userID,
                    statusID: 1,
                    created: currentDate,
                    lastModified: currentDate,
                    notified: null
                };

                const requestInsertRes = await admin.firestore().collection('waitList').add(puppyRequestData);

                puppyRequestData.waitRequestID = requestInsertRes.id;

                const { firstName, lastName, email, phone, } = user;
                const { color, message, puppyID } = puppyRequestData;

                await this.sendNotificationForWaitList(firstName, lastName, email, phone, message, puppyID, color, puppyRequestData.waitRequestID);
                await this.sendWaitRequestConfirmationEmail(email, firstName, lastName, puppyRequestData.waitRequestID);

                resolve(puppyRequestData);
            } catch (err) {
                reject(err);
            }
        });
    }

    static updateWaitRequest(data: any) {
        return new Promise((resolve, reject) => {
            const { waitRequestID } = data;
            if (data.waitRequestID)
                delete data.waitRequestID;

            if (data.statusID === undefined)
                data.statusID = 1;

            admin.firestore().collection('waitList').doc(waitRequestID).set(data, { merge: true })
                .then(() => {
                    const retVal = data;
                    retVal.waitRequestID = waitRequestID;
                    resolve(retVal);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static deleteWaitRequest(waitRequestIDs: [string]) {
        return new Promise((resolve, reject) => {
            try {
                waitRequestIDs.forEach(async (waitRequestID) => {
                    if (typeof waitRequestID !== 'undefined') {
                        const waitRequestRef = admin.firestore().collection('waitList').doc(waitRequestID);
                        await waitRequestRef.set({ statusID: 2 }, { merge: true });
                    }
                });
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getMessages(waitRequestID: string, recipientID: string, onlyUnread: boolean) {
        return new Promise(async (resolve, reject) => {
            const messageRef = admin.firestore().collection('messages');

            try {
                let messages: any[] = [];
                const messageSnapshot = await messageRef.where('waitRequestID', '==', waitRequestID).get();

                if (messageSnapshot.size > 0) {
                    for (const doc of messageSnapshot.docs) {
                        const message = doc.data();
                        let addMessage = true;
                        message.messageID = doc.id;

                        if (recipientID) {
                            if (message.recipientID !== recipientID)
                                addMessage = false;
                        }

                        if (onlyUnread) {
                            if (message.read)
                                addMessage = false;
                        }

                        if (addMessage)
                            messages.push(message);
                    }
                }

                messages = messages.sort((a: any, b: any) => {
                    const dateA = new Date(a.sentDate);
                    const dateB = new Date(b.sentDate);

                    return dateA > dateB ? -1 : dateA < dateB ? 1 : 0;
                });

                resolve(messages);
            } catch (err) {
                reject(err);
            }
        });
    }

    static sendMessage(data: any) {
        return new Promise(async (resolve, reject) => {
            const { senderID, recipientID, waitRequestID, messageBody, isBreeder } = data;

            try {
                // let sender: any, recipient: any, recipientData: any;
                // sender = await admin.firestore().collection('buyers').doc(senderID).get();
                // const senderData: any = sender.data();
                let recipient: any, sender: any;

                if (isBreeder === true) {
                    const recipientRef = await admin.firestore().collection('buyers').doc(recipientID).get();
                    recipient = recipientRef.data();
                } else if (isBreeder === false) {
                    const senderRef = await admin.firestore().collection('buyers').doc(senderID).get();
                    sender = senderRef.data();
                }

                const messageData: any = {
                    senderID: senderID,
                    recipientID: recipientID,
                    waitRequestID: waitRequestID,
                    messageBody: messageBody,
                    sentDate: new Date().toISOString(),
                    lastModified: new Date().toISOString(),
                    read: false,
                    statusID: 1
                };

                const messagesRef = admin.firestore().collection('messages');
                const snapshot = await messagesRef.add(messageData);

                messageData.messageID = snapshot.id;

                // TODO: send a notification email to the recipient.
                // if the recipientID is Bob's, call 
                if (isBreeder === true) {
                    const senderObj = {
                        firstName: 'Robert Johnson (The Doberman Breeder)',
                        lastName: ''
                    };

                    await this.sendNotificationForWaitListMessage(recipient.email, messageBody, senderObj, recipient, waitRequestID, false);
                } else if (isBreeder === false) {
                    const recipientObj = {
                        firstName: 'Bob',
                        lastName: 'Johnson'
                    };

                    await this.sendNotificationForWaitListMessage(ConfigService.getBreederEmail(), messageBody, sender, recipientObj, waitRequestID, true);
                }

                resolve(messageData);
            } catch (err) {
                reject(err);
            }
        });
    }

    static updateMessage(data: any) {
        return new Promise(async (resolve, reject) => {
            const { messageID } = data;
            const messagesRef = admin.firestore().collection('messages').doc(messageID);

            try {
                const message = await messagesRef.get();
                const messageData: any = {
                    senderID: data.messageID,
                    recipientID: data.recipientID,
                    waitRequestID: data.waitRequestID,
                    messageBody: data.messageBody,
                    lastModified: new Date(),
                    statusID: data.statusID
                };

                if (message.data()) {
                    await messagesRef.set(messageData, { merge: true });
                    messageData.messageID = messageID;
                    resolve(messageData);
                } else {
                    reject('Data is required.');
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    static markMessageAsRead(data: any) {
        return new Promise(async (resolve, reject) => {
            const { messageIDs } = data;
            try {
                for (let i = 0, max = messageIDs.length; i < max; i++) {
                    const messageRef = admin.firestore().collection('messages').doc(messageIDs[i]);
                    await messageRef.set({ read: true }, { merge: true });
                }
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getUnreadMessagesByUserID(userID: string, limit: number) {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('messages').where('recipientID', '==', userID).get()
                .then(async snapshot => {
                    let messages: any[] = [];

                    if (snapshot.size > 0) {
                        for (const messageDoc of snapshot.docs) {
                            const message = messageDoc.data();
                            message.messageID = messageDoc.id;

                            if (!message.read) {
                                try {
                                    const userSnapshot = await admin.firestore().collection('buyers').doc(message.senderID).get();
                                    const sender = userSnapshot.data();
                                    message.sender = sender;
                                } catch (err) {
                                    console.log(err);
                                }

                                messages.push(message);
                            }
                        }
                    }

                    messages = messages.sort((a, b) => {
                        const dateA = new Date(a.sentDate);
                        const dateB = new Date(b.sentDate);

                        return dateA < dateB ? 1 : dateA > dateB ? -1 : 0;
                    });

                    let retVal: any[] = [];

                    if (limit) {
                        for (let i = 0, max = limit; i < max; i++) {
                            retVal.push(messages[i]);
                        }
                    } else {
                        retVal = messages;
                    }

                    resolve(messages);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static getMessagesByUserID(userID: string, limit: number) {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('messages').where('recipientID', '==', userID).get()
                .then(async snapshot => {
                    let messages: any[] = [];

                    if (snapshot.size > 0) {
                        for (const messageDoc of snapshot.docs) {
                            const message = messageDoc.data();
                            message.messageID = messageDoc.id;

                            try {
                                const userSnapshot = await admin.firestore().collection('buyers').doc(message.senderID).get();
                                const sender = userSnapshot.data();
                                message.sender = sender;
                            } catch (err) {
                                console.log(err);
                            }

                            messages.push(message);
                        }
                    }

                    messages = messages.sort((a, b) => {
                        const dateA = new Date(a.sentDate);
                        const dateB = new Date(b.sentDate);

                        return dateA < dateB ? 1 : dateA > dateB ? -1 : 0;
                    });

                    let retVal: any[] = [];

                    if (limit) {
                        for (let i = 0, max = limit; i < max; i++) {
                            retVal.push(messages[i]);
                        }
                    } else {
                        retVal = messages;
                    }

                    resolve(messages);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    // gets all latest messages grouped by waitRequest
    static getMessagesByWaitRequest() {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('messages').orderBy('sentDate').get()
                .then(async snapshot => {
                    const waitRequestIDs: string[] = [];
                    let messages: any[] = [];

                    if (snapshot.size > 0) {
                        for (const messageDoc of snapshot.docs) {
                            const message = messageDoc.data();
                            message.messageID = messageDoc.id;

                            if (waitRequestIDs.indexOf(message.waitRequestID) === -1) {
                                try {
                                    const userSnapshot = await admin.firestore().collection('buyers').doc(message.senderID).get();
                                    message.sender = userSnapshot.data();
                                } catch (err) {
                                    console.log(err);
                                }

                                messages.push(message);
                                waitRequestIDs.push(message.waitRequestID);
                            }
                        }
                    }

                    messages = messages.sort((a, b) => {
                        const dateA = new Date(a.sentDate);
                        const dateB = new Date(b.sentDate);

                        return dateA < dateB ? 1 : dateA > dateB ? -1 : 0;
                    });

                    resolve(messages);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static notifyUsers(data: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const waitRequestIDs = data.waitRequestIDs;
                for (let i = 0, max = waitRequestIDs.length; i < max; i++) {
                    const waitRequestID = waitRequestIDs[i];
                    const waitRequestRef = admin.firestore().collection('waitList').doc(waitRequestID);
                    const doc = await waitRequestRef.get();
                    let waitRequest: any = {};
                    waitRequest = doc.data();
                    waitRequest.notified = new Date().toISOString();

                    let body = data.body;

                    await waitRequestRef.set(waitRequest, { merge: true });

                    // Check if the waitRequest has userID
                    if (waitRequest.userID) {
                        const recipientRef = await admin.firestore().collection('buyers').doc(waitRequest.userID).get();
                        const recipient: any = recipientRef.data();

                        if (body.indexOf('[FIRST_NAME]') !== -1) {
                            body = body.replace(/\[FIRST_NAME\]/gm, recipient.firstName);
                        }
                        
                        if (body.indexOf('[LAST_NAME]') !== -1) {
                            body = body.replace(/\[LAST_NAME\]/gm, recipient.lastName);
                        }
                        
                        const messageBody = UtilService.stripHTML(body);
                        
                        const messageData: any = {
                            senderID: ConfigService.getBreederID(),
                            recipientID: waitRequest.userID,
                            waitRequestID: waitRequestID,
                            messageBody: messageBody,
                            sentDate: new Date().toISOString(),
                            lastModified: new Date().toISOString(),
                            statusID: 1
                        };

                        const messagesRef = admin.firestore().collection('messages');
                        await messagesRef.add(messageData);

                        const senderObj = {
                            firstName: 'Robert Johnson (The Doberman Breeder)',
                            lastName: ''
                        };

                        await this.sendNotificationForWaitListMessage(recipient.email, messageBody, senderObj, recipient, waitRequestID, false);
                    } else {
                        if (body.indexOf('[FIRST_NAME]') !== -1) {
                            body = body.replace(/\[FIRST_NAME\]/gm, waitRequest.firstName);
                        }

                        if (body.indexOf('[LAST_NAME]') !== -1) {
                            body = body.replace(/\[LAST_NAME\]/gm, waitRequest.lastName);
                        }

                        await EmailService.sendEmail(waitRequest.email, data.subject, body)
                            .catch(err => {
                                console.log(err);
                            });
                    }
                }
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }

    static sendWaitRequestConfirmationEmail(email: string, firstName: string, lastName: string, waitRequestID: string) {
        return new Promise((res, rej) => {

            if (email && firstName && lastName && waitRequestID) {
                let htmlBody: string = '';
                const publicBaseURL = ConfigService.getPublicBaseURL();

                htmlBody = `
                <!DOCTYPE html>
                    <body>
                        <p>Hello ${firstName},</p>
                        <p>Thank you for submitting a Doberman puppy request. The breeder will be in touch with you when new puppies will be available for you. If you have any questions about your request, you can send messages to the breeder from the link below.</p>
                        <p><a href="${publicBaseURL}puppy-request/${waitRequestID}">${publicBaseURL}puppy-request/${waitRequestID}</a></p>
                        <br/></br/>
                        Dog Team Dobermans
                    </body>
                </html>
            `;

                const subject = `New Doberman Puppy Request Submitted (RequestID: ${waitRequestID})`;

                EmailService.sendEmail(email, subject, htmlBody)
                    .then(() => {
                        res(1);
                    })
                    .catch(() => {
                        rej();
                    });
            } else {
                rej();
            }
        });
    }

    static async sendNotificationForWaitList(firstName: string, lastName: string, email: string, phone: string, message: string, puppyID: string, color: string, waitRequestID: string) {
        let puppyData: any;
        let puppyColor = color;
        let puppyRows: string = '';

        try {
            if (puppyID !== undefined) {
                const puppyDoc = await admin.firestore().collection('puppies').doc(puppyID).get();
                puppyData = puppyDoc.data();
                puppyColor = puppyData.color;
                puppyRows = `
                <tr>
                    <th style="text-align: left;">PuppyID</th>
                    <td>${puppyID}</td>
                </tr>
                <tr>
                    <th style="text-align: left;">Name</th>
                    <td>${puppyData.name}</td>
                </tr>
            `;
            }
        } catch (err) {
            console.log(err);
        }

        const colorPref = (puppyColor === undefined || puppyColor === null || puppyColor === '') ? 'No Preference' : puppyColor;
        const adminBaseURL = ConfigService.getAdminBaseURL();

        return new Promise((resolve, reject) => {
            const htmlBody = `
            <!DOCTYPE html>
                <body>
                    <table>
                        <tr>
                            <th style="text-align: left;">First Name</th>
                            <td>${firstName}</td>
                        </tr>
                        <tr>
                            <th style="text-align: left;">Last Name</th>
                            <td>${lastName}</td>
                        </tr>
                        <tr>
                            <th style="text-align: left;">Email</th>
                            <td><a href="mailto:${email}">${email}</a></td>
                        </tr>
                        <tr>
                            <th style="text-align: left;">Phone</th>
                            <td><a href="tel:${phone}">${phone}</a></td>
                        </tr>
                        <tr>
                            <th style="text-align: left;">Message</th>
                            <td>${message}</td>
                        </tr>
                        ${puppyRows}
                        <tr>
                            <th style="text-align: left;">Color</th>
                            <td>${colorPref}</td>
                        </tr>
                    </table>
                    <br />
                    <p>See details and send messages from this link:</p>
                    <p><a>${adminBaseURL}wait-list/${waitRequestID}</a></p>
                </body>
            </html>
        `;

            EmailService.sendEmail(ConfigService.getBreederEmail(), `New Puppy Request Created from ${firstName} ${lastName}`, htmlBody)
                .then(() => {
                    resolve(1);
                })
                .catch(() => {
                    reject();
                });
        });
    }

    static sendNotificationForWaitListMessage(email: string, message: string, sender: any, recipient: any, waitRequestID: string, toBreeder: boolean) {
        return new Promise((res, rej) => {
            if (email && sender && waitRequestID) {
                let htmlBody: string = '';
                const publicBaseURL = ConfigService.getPublicBaseURL();
                const adminBaseURL = ConfigService.getAdminBaseURL();
                let msg: string = '';

                if (message.length > 10) {
                    msg = `${message.substring(0, Math.floor(message.length / 2))}...`;
                }

                if (toBreeder === false) {
                    htmlBody = `
                    <!DOCTYPE html>
                        <body>
                            <p>Hello ${recipient.firstName},</p>
                            <p>You received a new message from the breeder.</p>
                            <p>${msg}</p>
                            <p>Please click the following link to read the whole message and to reply.</p>
                            <p><a href="${publicBaseURL}puppy-request/${waitRequestID}">${publicBaseURL}puppy-request/${waitRequestID}</a></p>
                            <p>This email is generated automatically. Please do not reply to this message.</p>
                            <br /><br />
                            Dog Team Dobermans
                        </body>
                    </html>
                `;
                } else {
                    htmlBody = `
                    <!DOCTYPE html>
                        <body>
                            <p>You received a new message from ${recipient.firstName} ${recipient.lastName}.</p>
                            <p>${msg}</p>
                            <p>Please click the following link to read the whole message and to reply.</p>
                            <p><a href="${adminBaseURL}wait-list/${waitRequestID}">${adminBaseURL}/wait-list/${waitRequestID}</a></p>
                            <br /><br />
                            Dog Team Dobermans
                        </body>
                    </html>
                `;
                }

                const subject = `New Message from ${sender.firstName} ${sender.lastName}`;

                EmailService.sendEmail(email, subject, htmlBody)
                    .then(() => {
                        res(1);
                    })
                    .catch((err: any) => {
                        rej(err);
                    })
            }
        });
    }

}