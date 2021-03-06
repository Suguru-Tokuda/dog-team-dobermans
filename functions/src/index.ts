import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as nodemailer from 'nodemailer';
import * as api from '../src/api.json';
import * as config from '../src/config.json';

admin.initializeApp(functions.config().firebase);

const corsHeader = cors({ origin: true });
const isProd = true;

function getAPIKEY() {
    const parsedJSON = JSON.parse(JSON.stringify(api));
    return parsedJSON.API_KEY;
}

function getConfig() {
    const parsedJSON = JSON.parse(JSON.stringify(config));
    return parsedJSON;
}

function getPublicBaseURL() {
    const configJson = getConfig();

    if (isProd) {
        return configJson.baseURL.prod.public;
    } else {
        return configJson.baseURL.dev.public;
    }
}

function getAdminBaseURL() {
    const configJson = getConfig();

    if (isProd) {
        return configJson.baseURL.prod.admin;
    } else {
        return configJson.baseURL.dev.admin;
    }
}

function getBreederEmail() {
    const configJSON = getConfig();

    if (isProd) {
        return configJSON.breederEmail.prod;
    } else {
        return configJSON.breederEmail.dev;
    }
}

function getBreederID() {
    const configJSON = getConfig();

    return configJSON.breederID;
}

function stripHTML(str: string) {
    let retVal = str;

    if (retVal) {
        retVal = retVal.replace(/(<([^>]+)>)/gi, '')
        retVal.replace(/&#?[a-z0-9]+;/g, ' ');
    }

    return retVal;
}

function notifyNewTestimonial(firstName: string, lastName: string, dogName: string, email: string) {
    return new Promise((resolve, reject) => {
        const htmlBody = `
                    <!DOCTYPE html>
                        <body>
                            <h3>New Testimonial</h3>
                            <br /><br />
                            <table>
                                <tr>
                                    <th style="text-align: left;">First name</th>
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
                                    <th style="text-align: left;">Dog name</th>
                                    <td>${dogName}</td>
                                </tr>
                            </table>
                        </body>
                    </html>
        `;

        sendEmail(getBreederEmail(), 'New Testimonial Submitted', htmlBody)
            .then(() => {
                resolve(1);
            })
            .catch(() => {
                reject();
            });
    });
}

async function sendNotificationForWaitList(firstName: string, lastName: string, email: string, phone: string, message: string, puppyID: string, color: string, waitRequestID: string) {
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
    const adminBaseURL = getAdminBaseURL();

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

        sendEmail(getBreederEmail(), `New Puppy Request Created from ${firstName} ${lastName}`, htmlBody)
            .then(() => {
                resolve(1);
            })
            .catch(() => {
                reject();
            });
    });
}

function sendWaitRequestConfirmationEmail(email: string, firstName: string, lastName: string, waitRequestID: string) {
    return new Promise((res, rej) => {

        if (email && firstName && lastName && waitRequestID) {
            let htmlBody: string = '';
            const publicBaseURL = getPublicBaseURL();

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

            sendEmail(email, subject, htmlBody)
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

function sendNotificationForWaitListMessage(email: string, sender: any, recipient: any, waitRequestID: string, toBreeder: boolean) {
    return new Promise((res, rej) => {
        if (email && sender && waitRequestID) {
            let htmlBody: string = '';
            const publicBaseURL = getPublicBaseURL();
            const adminBaseURL = getAdminBaseURL();

            if (toBreeder === false) {
                htmlBody = `
                    <!DOCTYPE html>
                        <body>
                            <p>Hello ${recipient.firstName},</p>
                            <p>You received a new message from the breeder.</p>
                            <p>Please click the following link to read the message.</p>
                            <p><a href="${publicBaseURL}puppy-request/${waitRequestID}">${publicBaseURL}puppy-requests/${waitRequestID}</a></p>
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
                            <p>Please click the following link to read the message.</p>
                            <p><a href="${adminBaseURL}wait-list/${waitRequestID}">${adminBaseURL}/wait-list/${waitRequestID}</a></p>
                            <br /><br />
                            Dog Team Dobermans
                        </body>
                    </html>
                `;
            }

            const subject = `New Message from ${sender.firstName} ${sender.lastName}`;

            sendEmail(email, subject, htmlBody)
                .then(() => {
                    res(1);
                })
                .catch((err) => {
                    rej(err);
                })
        }
    });
}

function sendEmail(email: string, subject: string, htmlBody: string) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: getConfig().office.user,
            pass: getConfig().office.pass
        }
    });

    const options = {
        sender: getConfig().office.user,
        from: getConfig().office.user,
        to: email,
        subject: subject,
        html: htmlBody
    };

    return transporter.sendMail(options);
}

export const homepageContents = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const query = request.query;
        const method = request.method;
        const path = request.path;
        if (typeof query.key === 'undefined') {
            response.status(400).send('Missing API key');
        } else {
            if (query.key !== getAPIKEY()) {
                response.status(400).send('Incorrect API key');
            } else if (query.key === getAPIKEY()) {
                if (path === '/') {
                    if (method === 'GET') {
                        admin.firestore().collection('homepageContents').get()
                            .then(querySnapshot => {
                                if (querySnapshot.size > 0) {
                                    response.status(200).send(querySnapshot.docs[0].data());
                                } else {
                                    response.sendStatus(200);
                                }
                            })
                            .catch(err => {
                                response.status(500).send(err);
                            });
                    } else if (method === 'PUT') {
                        const homepageContentData = request.body;
                        admin.firestore().collection('homepageContents').get()
                            .then(async (querySnapshot) => {
                                if (querySnapshot.size > 0) {
                                    const homepageContentID = querySnapshot.docs[0].id;
                                    const homepageContentRef = admin.firestore().collection('homepageContents').doc(homepageContentID);
                                    homepageContentRef.set(homepageContentData, { merge: true })
                                        .then(() => {
                                            response.sendStatus(200);
                                        })
                                        .catch(err => {
                                            response.status(500).send(err);
                                        });
                                } else {
                                    admin.firestore().collection('homepageContents').add(homepageContentData)
                                        .then(() => {
                                            response.sendStatus(200);
                                        })
                                        .catch(err => {
                                            response.status(500).send(err);
                                        });
                                }
                            })
                            .catch(() => {
                                admin.firestore().collection('homepageContents').add(homepageContentData)
                                    .then(() => {
                                        response.sendStatus(200);
                                    })
                                    .catch(err => {
                                        response.status(500).send(err);
                                    });
                            });
                    } else {
                        response.status(404).send('Unsupported method');
                    }
                } else if (path === '/puppyMessage') {
                    admin.firestore().collection('homepageContents').get()
                        .then(querySnapshot => {
                            if (querySnapshot.size > 0) {
                                response.status(200).send(querySnapshot.docs[0].data().puppyMessage);
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                }
            }
        }
    });
});

// get all puppies
export const puppies = functions.https.onRequest((request, response) => {
    corsHeader(request, response, async () => {
        const query = request.query;
        const path = request.path;
        if (typeof query.key === 'undefined') {
            response.status(400).send("Missing API key");
        } else if (query.key) {
            if (query.key !== getAPIKEY()) {
                response.status(400).send("Incorrect API key");
            } else if (query.key === getAPIKEY()) {
                if (path === '/') {
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
                                            console.log(err);
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
                            response.status(200).send(puppyArr);
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                } else if (path === '/getByBuyerID') {
                    const buyerID = query.buyerID;
                    if (typeof buyerID !== 'undefined' && buyerID.length > 0) {
                        admin.firestore().collection('puppies').where('buyerID', '==', buyerID).get()
                            .then(querySnapshot => {
                                const puppiesArray: any[] = [];
                                for (const puppyDoc of querySnapshot.docs) {
                                    const puppyToPush = puppyDoc.data();
                                    puppyToPush.puppyID = puppyDoc.id;
                                    puppiesArray.push(puppyToPush);
                                }
                                response.status(200).send(puppiesArray);
                            })
                            .catch(err => {
                                response.status(500).send(err);
                            });
                    } else {
                        response.status(404).send('Missing buyerID')
                    }
                } else if (path === '/processTransaction') {
                    const transactionData = request.body;
                    const puppyRef = admin.firestore().collection('puppies').doc(transactionData.puppyID);
                    const buyerRef = admin.firestore().collection('buyers').doc(transactionData.buyerID);
                    await puppyRef.get()
                        .then(async (snapshot) => {
                            const puppyData = snapshot.data();
                            if (typeof puppyData !== 'undefined') {
                                puppyData.buyerID = transactionData.buyerID;
                                puppyData.paidAmount += transactionData.paidAmount;
                                puppyData.sold = true;
                                if (puppyData.soldDate === null)
                                    puppyData.soldDate = new Date();
                                await puppyRef.set(puppyData, { merge: true });
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                    await buyerRef.get()
                        .then(async (snapshot) => {
                            const buyerData = snapshot.data();
                            if (typeof buyerData !== 'undefined') {
                                if (buyerData.puppyIDs.indexOf(transactionData.puppyID) === -1) {
                                    buyerData.puppyIDs.push(transactionData.puppyID);
                                    await buyerRef.set(buyerData, { merge: true });
                                }
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                    response.sendStatus(200);
                } else if (path === '/cancelTransaction') {
                    const puppyID = query.puppyID;
                    const puppyRef = admin.firestore().collection('puppies').doc(puppyID);
                    puppyRef.get()
                        .then(async (puppySnapshot) => {
                            const puppyData = puppySnapshot.data();
                            if (typeof puppyData !== 'undefined') {
                                const buyerID = puppyData.buyerID;
                                puppyData.buyerID = null;
                                puppyData.paidAmount = 0;
                                puppyData.sold = false;
                                puppyData.soldDAte = null;
                                const buyerRef = admin.firestore().collection('buyers').doc(buyerID);
                                await buyerRef.get()
                                    .then(async (buyerSnapshot) => {
                                        const buyerData = buyerSnapshot.data();
                                        if (typeof buyerData !== 'undefined') {
                                            const index = buyerData.puppyIDs.indexOf(puppyID);
                                            if (index !== -1) {
                                                buyerData.puppyIDs.splice(index, 1);
                                                await buyerRef.set(buyerData, { merge: true });
                                            }
                                        }
                                    })
                                    .catch(err => {
                                        response.status(500).send(err);
                                    });
                                await puppyRef.set(puppyData, { merge: true });
                                response.sendStatus(200);
                            } else {
                                response.status(500).send('There was an error in getting puppy data');
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        })
                }
            }
        }
    });
});

// puppy CRUD
export const puppy = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const query = request.query;
        const path = request.path;
        if (typeof query.key === 'undefined') {
            response.status(400).send("Missing API key");
        } else if (query.key) {
            if (query.key !== getAPIKEY()) {
                response.status(400).send("Incorrect API key");
            } else if (query.key === getAPIKEY()) {
                const puppyID = query.puppyID;
                if (request.method === 'GET') {
                    if (typeof puppyID !== 'undefined' && puppyID.length > 0) {
                        const puppyRef = admin.firestore().collection('puppies').doc(puppyID);
                        puppyRef.get().then(async (doc) => {
                            let retVal: any = {};
                            if (typeof doc.data() !== 'undefined') {
                                retVal = doc.data();
                                retVal.puppyID = doc.id;
                                /* get dad and mom info */
                                const dadID = retVal.dadID;
                                const momID = retVal.momID;
                                try {
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
                                } catch (err) {
                                    console.log(err);
                                }
                            }
                            response.status(200).send(retVal);
                        })
                            .catch(err => {
                                response.status(500).send(err);
                            });
                    } else {
                        response.status(204);
                    }
                } else if (request.method === 'POST') {
                    const data = request.body;
                    if (path === '/') {
                        admin.firestore().collection('puppies').add(data)
                            .then(snapshot => {
                                const retVal = data;
                                retVal.puppyID = snapshot.id;
                                response.status(201).send(retVal);
                            })
                            .catch(err => {
                                response.status(500).send(err);
                            });
                    }
                } else if (request.method === 'PUT') {
                    if (typeof puppyID !== 'undefined' && puppyID.length > 0) {
                        const data = request.body;
                        const puppyRef = admin.firestore().collection('puppies').doc(puppyID);
                        puppyRef.set(data, { merge: true })
                            .then(() => {
                                const retVal = data;
                                retVal.puppyID = puppyID;
                                response.status(200).send(retVal);
                            })
                            .catch(err => {
                                response.sendStatus(500).send(err);
                            });
                    }
                } else if (request.method === 'DELETE') {
                    if (typeof puppyID !== 'undefined' && puppyID.length > 0) {
                        const puppyRef = admin.firestore().collection('puppies').doc(puppyID);
                        puppyRef.delete()
                            .then(() => {
                                response.sendStatus(200);
                            })
                            .catch(err => {
                                response.sendStatus(500).send(err);
                            });
                    } else {
                        response.status(400).send('Invalid ID');
                    }
                }
            }
        }
    });
});

// get all parents
export const parents = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const query = request.query;
        if (typeof query.key === 'undefined') {
            response.status(400).send("Missing API key");
        } else if (query.key) {
            if (query.key !== getAPIKEY()) {
                response.status(400).send("Incorrect API key");
            } else if (query.key === getAPIKEY()) {
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
        const parentID = query.parentID;
        const path = request.path;
        if (typeof query.key === 'undefined') {
            response.status(400).send("Missing API key");
        } else if (query.key) {
            if (query.key !== getAPIKEY()) {
                response.status(400).send("Incorrect API key");
            } else if (query.key === getAPIKEY()) {
                if (path === '/') {
                    if (method === 'GET') {
                        if (parentID.length > 0) {
                            const parentRef = admin.firestore().collection('parents').doc(parentID);
                            parentRef.get()
                                .then(doc => {
                                    let retVal: any = {};
                                    if (typeof doc.data() !== undefined) {
                                        retVal = doc.data();
                                        retVal.parentID = doc.id;
                                    }
                                    response.status(200).send(retVal);
                                })
                                .catch(err => {
                                    response.status(500).send(err);
                                });
                        } else {
                            response.sendStatus(204);
                        }
                    } else if (method === 'POST') {
                        const data = request.body;
                        admin.firestore().collection('parents').add(data)
                            .then(snapshot => {
                                const retVal = data;
                                retVal.parentID = snapshot.id;
                                response.status(201).send(retVal);
                            })
                            .catch(err => {
                                response.sendStatus(500).send(err);
                            });
                    } else if (method === 'PUT') {
                        if (parentID.length > 0) {
                            const data = request.body;
                            const parentRef = admin.firestore().collection('parents').doc(parentID);
                            parentRef.set(data, { merge: true })
                                .then(snapshot => {
                                    const retVal = data;
                                    retVal.parentID = parentID;
                                    response.status(200).send(retVal);
                                })
                                .catch(err => {
                                    response.sendStatus(500).send(err);
                                });
                        }
                    } else if (method === 'DELETE') {
                        if (parentID.length > 0) {
                            const parentRef = admin.firestore().collection('parents').doc(parentID);
                            parentRef.delete()
                                .then(res => {
                                    response.sendStatus(200);
                                })
                                .catch(err => {
                                    response.sendStatus(500).send(err);
                                });
                        }
                    }
                }
            }
        }
    });
});

// buyer CRUD
export const buyer = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const method = request.method;
        const query = request.query;
        const path = request.path;
        const id = query.buyerID;
        if (typeof query.key === 'undefined') {
            response.status(400).send("Missing API key");
        } else if (query.key === getAPIKEY()) {
            if (path === '/') {
                if (method === 'GET') {
                    if (id.length > 0) {
                        const buyerRef = admin.firestore().collection('buyers').doc(id);
                        buyerRef.get()
                            .then(doc => {
                                let retVal: any = {};
                                if (typeof doc.data() !== undefined) {
                                    retVal = doc.data();
                                    retVal.buyerID = doc.id;
                                }
                                response.status(200).send(retVal);
                            })
                            .catch(err => {
                                response.status(500).send(err);
                            });
                    } else {
                        response.sendStatus(204);
                    }
                } else if (method === 'POST') {
                    const data = request.body;
                    const userID = data.userID;
                    const { firstName, lastName, email, phone, state, city } = data;
                    delete data.userID;

                    data.lastModified = new Date().toISOString();

                    if (firstName && lastName && email && phone && state && city) {
                        data.registrationCompleted = true;
                    }

                    // specifies the userID on create.
                    admin.firestore().collection('buyers').doc(userID).set(data, { merge: true })
                        .then(snapshot => {
                            const retVal = data;
                            response.status(201).json(retVal);
                        })
                        .catch(err => {
                            response.sendStatus(500).send(err);
                        });
                } else if (method === 'PUT') {
                    const data = request.body;
                    const userID = data.userID;
                    const { firstName, lastName, email, phone, state, city } = data;
                    delete data.userID;

                    data.lastModified = new Date().toISOString();

                    if (firstName && lastName && email && phone && state && city) {
                        data.registrationCompleted = true;
                    }

                    // specifies the userID on create.
                    admin.firestore().collection('buyers').doc(userID).set(data, { merge: true })
                        .then(snapshot => {
                            const retVal = data;
                            response.status(201).json(retVal);
                        })
                        .catch(err => {
                            response.sendStatus(500).send(err);
                        });
                    // if (id.length > 0) {
                    //     const data = request.body;
                    //     const buyerRef = admin.firestore().collection('buyers').doc(id);
                    //     buyerRef.set(data, { merge: true })
                    //         .then(snapshot => {
                    //             response.status(200).json({id: id, data: data});
                    //         })
                    //         .catch(err => {
                    //             response.sendStatus(500).send(err);
                    //         });
                    // }
                } else if (method === 'DELETE') {
                    if (id.length > 0) {
                        const buyerRef = admin.firestore().collection('buyers').doc(id);
                        buyerRef.delete()
                            .then(res => {
                                response.status(200).json({ id: id });
                            })
                            .catch(err => {
                                response.sendStatus(500).send(err);
                            });
                    }
                }
            } else if (path === '/search') {
                const searchKeywords = query.searchKeywords.toLowerCase().split(' ');
                admin.firestore().collection('buyers').get()
                    .then(querySnapshot => {
                        const buyersArr: any = [];
                        if (querySnapshot.size > 0) {
                            querySnapshot.forEach((doc) => {
                                const retVal = doc.data();
                                retVal.buyerID = doc.id;
                                let foundCount = 0;
                                searchKeywords.forEach((searchKeyword: string) => {
                                    if (typeof retVal.firstName !== 'undefined' && retVal.firstName.toLowerCase().indexOf(searchKeyword) !== -1)
                                        foundCount++;
                                    if (typeof retVal.lastName !== 'undefined' && retVal.lastName.toLowerCase().indexOf(searchKeyword) !== -1)
                                        foundCount++;
                                    if (typeof retVal.email !== 'undefined' && retVal.email.toLowerCase().indexOf(searchKeyword) !== -1)
                                        foundCount++;
                                    if (typeof retVal.state !== 'undefined' && retVal.state.toLowerCase().indexOf(searchKeyword) !== -1)
                                        foundCount++;
                                    if (typeof retVal.city !== 'undefined' && retVal.city.toLowerCase().indexOf(searchKeyword) !== -1)
                                        foundCount++;
                                });
                                if (foundCount > 0)
                                    buyersArr.push(retVal)
                            });
                            response.status(200).send(buyersArr);
                        } else {
                            response.status(200).send([]);
                        }
                    })
                    .catch(err => {
                        response.status(500).send(err);
                    });
            } else if (path === '/check-email-availability') {
                if (method === 'POST') {
                    const data = request.body;
                    if (data.email && data.buyerID) {
                        admin.firestore().collection('buyers').where('email', '==', data.email).get()
                            .then(querySnapshot => {
                                if (querySnapshot.size === 0) {
                                    response.status(200).send(true);
                                } else {
                                    const buyerIDToCheck = querySnapshot.docs[0].id;
                                    if (data.buyerID === buyerIDToCheck)
                                        response.status(200).send(true);
                                    response.status(200).send(false);
                                }
                            })
                            .catch(err => {
                                response.status(500).send(err);
                            });
                    } else if (data.email) {
                        admin.firestore().collection('buyers').where('email', '==', data.email).get()
                            .then(querySnapshot => {
                                response.status(200).send(querySnapshot.size === 0);
                            })
                            .catch(err => {
                                response.status(500).send(err);
                            });
                    }
                } else {
                    response.status(400).send('Unsupported method');
                }
            }
        }
    });
});

export const buyers = functions.https.onRequest((request, response) => {
    corsHeader(request, response, async () => {
        const query = request.query;
        if (typeof query.key === 'undefined') {
            response.status(400).send('Missing API key');
        } else if (query.key) {
            if (query.key !== getAPIKEY()) {
                response.status(400).send('Incorrect API key');
            } else if (query.key === getAPIKEY()) {
                try {
                    const buyersQuerySnapshot = await admin.firestore().collection('buyers').get();
                    const buyersArray: any = [];
                    if (buyersQuerySnapshot.size > 0) {
                        for (const buyerDoc of buyersQuerySnapshot.docs) {
                            const buyerToPush = buyerDoc.data();
                            buyerToPush.buyerID = buyerDoc.id;
                            const puppiesQuerySnapshot = await admin.firestore().collection('puppies').where('buyerID', '==', buyerDoc.id).get();
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
                            buyerToPush.puppies = puppiesArray;
                            buyerToPush.hasPartialPayment = hasPartialPayment;
                            buyersArray.push(buyerToPush);
                        }
                        buyersArray.sort((a: any, b: any) => {
                            return a.firstName > b.firstName ? 1 : a.firstName < b.firstName ? -1 : 0;
                        });
                        response.status(200).send(buyersArray);
                    }
                }
                catch (err) {
                    response.status(500).send(err);
                }
            }
        }
    });
});

export const aboutUs = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const query = request.query;
        const method = request.method;
        const path = request.path;
        if (typeof query.key === 'undefined') {
            response.status(400).send('Missing API key');
        } else if (query.key === getAPIKEY()) {
            if (path === '/') {
                if (method === 'GET') {
                    admin.firestore().collection('aboutUs').get()
                        .then(querySnapshot => {
                            const aboutUsArr: any = [];
                            if (querySnapshot.size > 0) {
                                querySnapshot.forEach((doc) => {
                                    const retVal = doc.data();
                                    retVal.aboutUsID = doc.id;
                                    aboutUsArr.push(retVal);
                                });
                            }
                            if (aboutUsArr.length > 0) {
                                response.status(200).send(aboutUsArr[0]);
                            } else {
                                response.status(200).send({});
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                }
            } else if (path === '/missionStatements') {
                if (method === 'PUT') {
                    admin.firestore().collection('aboutUs').get()
                        .then(querySnapshot => {
                            const data = request.body;
                            if (querySnapshot.size > 0) {
                                const aboutUsData = {
                                    missionStatements: data
                                };
                                const aboutUsID = querySnapshot.docs[0].id;
                                const aboutUsRef = admin.firestore().collection('aboutUs').doc(aboutUsID);
                                aboutUsRef.set(aboutUsData, { merge: true })
                                    .then(() => {
                                        response.sendStatus(200);
                                    })
                                    .catch(err => {
                                        response.status(500).send(err);
                                    });
                            } else {
                                const aboutUsData = {
                                    ourTeam: [],
                                    missionStatements: data
                                };
                                admin.firestore().collection('aboutUs').add(aboutUsData)
                                    .then(() => {
                                        response.status(201).send(aboutUsData);
                                    })
                                    .catch(err => {
                                        response.status(500).send(err);
                                    });
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                }
            } else if (path === '/ourTeam') {
                if (method === 'PUT') {
                    admin.firestore().collection('aboutUs').get()
                        .then(querySnapshot => {
                            const data = request.body;
                            if (querySnapshot.size > 0) {
                                const aboutUsData = {
                                    ourTeam: data
                                };
                                const aboutUsID = querySnapshot.docs[0].id;
                                const aboutUsRef = admin.firestore().collection('aboutUs').doc(aboutUsID);
                                aboutUsRef.set(aboutUsData, { merge: true })
                                    .then(() => {
                                        response.sendStatus(200);
                                    })
                                    .catch(err => {
                                        response.sendStatus(500).send(err);
                                    });
                            } else {
                                const aboutUsData = {
                                    ourTeam: data,
                                    introductions: []
                                };
                                admin.firestore().collection('aboutUs').add(aboutUsData)
                                    .then(() => {
                                        response.status(201).send(aboutUsData);
                                    })
                                    .catch(err => {
                                        response.status(500).send(err);
                                    });
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                }
            } else {
                response.status(404);
            }
        }
    });
});

export const testimonials = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const query = request.query;
        const path = request.path;
        const method = request.method;
        if (typeof query.key === 'undefined') {
            response.status(400).send('Missing API key');
        } else if (query.key === getAPIKEY()) {
            if (path === '/') {
                if (method === 'GET') {
                    if (query.testimonialID) {
                        const testimonialID = query.testimonialID;
                        if (typeof testimonialID !== 'undefined') {
                            admin.firestore().collection('testimonials').doc(testimonialID).get()
                                .then(doc => {
                                    const retVal = doc.data();
                                    response.status(200).send(retVal);
                                })
                                .catch(err => {
                                    response.status(500).send(err);
                                });
                        } else {
                            response.status(500).send('Missing testimonialID');
                        }
                    } else {
                        admin.firestore().collection('testimonials').get()
                            .then(querySnapshot => {
                                const testimonialsArr: any = [];
                                if (querySnapshot.size > 0) {
                                    querySnapshot.forEach((doc) => {
                                        const testimonial = doc.data();
                                        testimonial.testimonialID = doc.id;
                                        if (typeof query.approved !== 'undefined' && query.approved === 'true') {
                                            if (testimonial.approved === true) {
                                                testimonialsArr.push(testimonial);
                                            }
                                        } else {
                                            testimonialsArr.push(testimonial);
                                        }
                                    });
                                }
                                testimonialsArr.sort((a: any, b: any) => {
                                    return a.created > b.created ? 1 : a.created < b.created ? -1 : 0;
                                });
                                response.status(200).send(testimonialsArr)
                            })
                            .catch(err => {
                                response.status(500).send(err);
                            });
                    }
                } else if (method === 'POST') {
                    const data = request.body;
                    admin.firestore().collection('testimonials').add(data)
                        .then(async () => {
                            const { firstName, lastName, dogName, email } = data;
                            await notifyNewTestimonial(firstName, lastName, dogName, email);
                            response.sendStatus(201);
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                } else if (method === 'PUT') {
                    const testimonialID = query.testimonialID;
                    if (typeof testimonialID !== 'undefined' && testimonialID.length > 0) {
                        const data = request.body;
                        if (data.testimonialID)
                            delete data.testimonialID;
                        const testimonialRef = admin.firestore().collection('testimonials').doc(testimonialID);
                        testimonialRef.set(data, { merge: true })
                            .then(() => {
                                const retVal = data;
                                retVal.testimonialID = testimonialID;
                                response.status(200).send(retVal);
                            })
                            .catch(err => {
                                response.sendStatus(500).send(err);
                            });
                    } else {
                        response.status(400).send('Missing testimonialID');
                    }
                } else if (method === 'DELETE') {
                    const testimonialIDs = request.body.testimonialIDs;
                    if (typeof testimonialIDs !== 'undefined' && testimonialIDs.length > 0) {
                        testimonialIDs.forEach(async (testimonialID: string) => {
                            try {
                                const testimonialRef = admin.firestore().collection('testimonials').doc(testimonialID);
                                await testimonialRef.delete();
                            } catch (err) {
                                response.status(500).send(err);
                            }
                        });
                        response.sendStatus(200);
                    } else {
                        response.status(400).send('Missing testimonialID');
                    }
                } else {
                    response.status(400).send('Unsupported method');
                }
            } else {
                response.status(400).send('Unsupported path');
            }
        }
    });
});

export const contact = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const query = request.query;
        const method = request.method;
        if (typeof query.key === 'undefined') {
            response.status(400).send('Missing API key');
        } else if (query.key === getAPIKEY()) {
            if (method === 'GET') {
                admin.firestore().collection('contact').get()
                    .then(querySnapshot => {
                        if (querySnapshot.size > 0) {
                            const docs = querySnapshot.docs;
                            const doc = docs[0];
                            const retVal = doc.data();
                            retVal.contactID = doc.id;
                            response.status(200).send(retVal);
                        } else {
                            response.status(200).send({});
                        }
                    })
                    .catch(err => {
                        response.status(500).send(err);
                    });
            } else if (method === 'PUT') {
                admin.firestore().collection('contact').get()
                    .then(querySnapshot => {
                        if (querySnapshot.size > 0) {
                            // update
                            const contactID = query.contactID;
                            const data = request.body;
                            const contactRef = admin.firestore().collection('contact').doc(contactID);
                            contactRef.set(data, { merge: true })
                                .then(() => {
                                    const retVal = data;
                                    retVal.contactUsID = contactID;
                                    response.status(201).send(retVal);
                                })
                                .catch(err => {
                                    response.status(500).send(err);
                                });
                        } else {
                            const data = request.body;
                            // create new
                            admin.firestore().collection('contact').add(data)
                                .then(snapshot => {
                                    response.sendStatus(200);
                                })
                                .catch(err => {
                                    response.sendStatus(500).send(err);
                                });
                        }
                    })
                    .catch(err => {
                        response.status(500).send(err);
                    });
            }
        }
    });
});

export const waitList = functions.https.onRequest((request, response) => {
    corsHeader(request, response, async () => {
        const query = request.query;
        const method = request.method;
        const path = request.path;

        if (typeof query.key === 'undefined') {
            response.status(400).send('Missing API key');
        } else if (query.key === getAPIKEY()) {
            if (path === '/') {
                if (method === 'GET') {
                    const recipientID = query.recipientID;
                    
                    if (query.waitRequestID && query.waitRequestID.length > 0) {
                        const waitRequestID = query.waitRequestID;
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
                                response.status(200).send(retVal);
                            })
                            .catch(err => {
                                response.status(500).send(err);
                            });
                    } else {
                        admin.firestore().collection('waitList').get()
                            .then(async querySnapshot => {
                                if (querySnapshot.size > 0) {
                                    const retVal = [] as any;

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

                                    response.status(200).send(retVal);
                                } else {
                                    response.status(200).send([]);
                                }
                            })
                            .catch(err => {
                                response.status(500).send(err);
                            });
                    }
                } else if (method === 'POST') {
                    const data = request.body;
                    data.statusID = 1;

                    admin.firestore().collection('waitList').add(data)
                        .then(async (snapshot) => {
                            try {
                                const waitRequestID = snapshot.id;
                                const { userID, color, puppyID, message } = data;
                                const buyerDoc = await admin.firestore().collection('buyers').doc(userID).get();
                                const buyerData: any = buyerDoc.data();
                                const { firstName, lastName, email, phone } = buyerData;

                                await sendNotificationForWaitList(firstName, lastName, email, phone, message, puppyID, color, waitRequestID);
                            } catch (err) {
                                console.log(err);
                            }
                            response.sendStatus(201);
                        })
                        .catch((err => {
                            response.status(500).send(err);
                        }));
                } else if (method === 'PUT') {
                    const waitRequestID = query.waitRequestID;
                    if (typeof waitRequestID !== 'undefined' && waitRequestID.length > 0) {
                        const data = request.body;
                        if (data.waitRequestID)
                            delete data.waitRequestID;

                        if (data.statusID === undefined)
                            data.statusID = 1;

                        const waitRequestRef = admin.firestore().collection('waitList').doc(waitRequestID);
                        waitRequestRef.set(data, { merge: true })
                            .then(() => {
                                const retVal = data;
                                retVal.waitRequestID = waitRequestID;
                                response.status(200).send(retVal);
                            })
                            .catch(err => {
                                response.sendStatus(500).send(err);
                            });
                    } else {
                        response.status(400).send('Missing waitRequestID');
                    }
                } else if (method === 'DELETE') {
                    const waitRequestIDs: Array<string> = request.body.waitRequestIDs;
                    if (typeof waitRequestIDs !== 'undefined' && waitRequestIDs.length > 0) {
                        try {
                            waitRequestIDs.forEach(async (waitRequestID) => {
                                if (typeof waitRequestID !== 'undefined') {
                                    const waitRequestRef = admin.firestore().collection('waitList').doc(waitRequestID);
                                    try {
                                        await waitRequestRef.set({ statusID: 2 }, { merge: true });
                                    } catch (err) {
                                        console.log(err);
                                    }
                                }
                            });
                            response.sendStatus(200);
                        } catch (err) {
                            response.status(500).send(err);
                        }
                    } else {
                        response.status(400).send('Invalid ID');
                    }
                } else {
                    response.status(400).send('Unsupported method');
                }
            } else if (path === '/getByUserID') {
                if (method === 'GET') {
                    const { userID } = query;
                    const waitListRef = admin.firestore().collection('waitList');

                    try {
                        const waitListItems = await waitListRef.where('userID', '==', userID).get();
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

                        response.status(200).send(retVal);
                    } catch (err) {
                        response.status(500).send(err);
                    }
                }
            } else if (path === '/notify') {
                if (method === 'POST') {
                    const data = request.body;
                    const waitRequestIDs = data.waitRequestIDs;
                    for (let i = 0, max = waitRequestIDs.length; i < max; i++) {
                        const waitRequestID = waitRequestIDs[i];
                        const waitRequestRef = admin.firestore().collection('waitList').doc(waitRequestID);
                        await waitRequestRef.get()
                            .then(async (doc) => {
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
                                    
                                    const messageBody = stripHTML(body);
                                    
                                    const messageData: any = {
                                        senderID: getBreederID(),
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

                                    await sendNotificationForWaitListMessage(recipient.email, senderObj, recipient, waitRequestID, false);
                                } else {
                                    if (body.indexOf('[FIRST_NAME]') !== -1) {
                                        body = body.replace(/\[FIRST_NAME\]/gm, waitRequest.firstName);
                                    }
    
                                    if (body.indexOf('[LAST_NAME]') !== -1) {
                                        body = body.replace(/\[LAST_NAME\]/gm, waitRequest.lastName);
                                    }

                                    await sendEmail(waitRequest.email, data.subject, body)
                                        .catch(err => {
                                            console.log(err);
                                        });
                                }
                            })
                            .catch(err => {
                                response.status(500).send(err);
                            });
                    }
                    response.sendStatus(200);
                } else {
                    response.status(400).send('Unsupported method');
                }
            } else if (path.indexOf('/message') !== -1) {
                if (path === '/messages') {
                    if (method === 'GET') {
                        // get messages for the recipientID and waitRequestID
                        const { waitRequestID, recipientID, onlyUnread } = query;
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

                            response.status(200).send(messages);
                        } catch (err) {
                            response.status(500).send(err);
                        }
                    } else if (method === 'POST') {
                        const { senderID, recipientID, waitRequestID, messageBody, isBreeder } = request.body;

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

                                await sendNotificationForWaitListMessage(recipient.email, senderObj, recipient, waitRequestID, false);
                            } else if (isBreeder === false) {
                                const recipientObj = {
                                    firstName: 'Bob',
                                    lastName: 'Johnson'
                                };

                                await sendNotificationForWaitListMessage(getBreederEmail(), sender, recipientObj, waitRequestID, true);
                            }

                            response.status(201).send(messageData);
                        } catch (err) {
                            response.status(500).send(err);
                        }
                    } else if (method === 'PUT') {
                        const messageID = query.messageID;
                        const messageBody = query.messageBody;

                        const messagesRef = admin.firestore().collection('messages').doc(messageID);

                        const data = { messabeBody: messageBody, lastModified: new Date().toISOString() };
                        messagesRef.set(data, { merge: true })
                            .then(() => {
                                response.sendStatus(200);
                            })
                            .catch(err => {
                                response.status(500).send(err);
                            });
                    }
                } else if (path === '/messages/update') {
                    // upate a message that's already been sent.
                    const { messageID } = query;
                    const messagesRef = admin.firestore().collection('messages').doc(messageID);

                    try {
                        const message = await messagesRef.get();
                        const messageData: any = {
                            senderID: query.messageID,
                            recipientID: query.recipientID,
                            waitRequestID: query.waitRequestID,
                            messageBody: query.messageBody,
                            lastModified: new Date(),
                            statusID: query.statusID
                        };

                        if (message.data()) {
                            messagesRef.set(messageData, { merge: true })
                                .then(() => {
                                    messageData.messageID = messageID;

                                    response.status(200).send(messageData);
                                })
                                .catch(err => {
                                    response.status(500).send(err);
                                });
                        }
                    } catch (err) {
                        response.status(400).send(err);
                    }
                } else if (path === '/messages/markAsRead') {
                    if (method === 'POST') {
                        const data = request.body;
                        const { messageIDs } = data;

                        for (let i = 0, max = messageIDs.length; i < max; i++) {
                            const messageRef = admin.firestore().collection('messages').doc(messageIDs[i]);

                            try {
                                await messageRef.set({ read: true }, { merge: true });
                            } catch (err) {
                                response.status(500).send(err);
                            }
                        }

                        response.sendStatus(204);
                    }
                } else if (path === '/messages/getUnreadMessagesByUserID') {
                    if (method === 'GET') {
                        const messsagesRef = admin.firestore().collection('messages');
                        const userID = query.userID;
                        const limit = query.limit;

                        if (userID) {
                            messsagesRef.where('recipientID', '==', userID).get()
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

                                    response.status(200).send(messages);
                                })
                                .catch(err => {
                                    response.status(500).send(err);
                                })
                        } else {
                            response.status(400).send('UserID needs to be sent to get messages.');
                        }
                    }
                } else if (path === '/messages/getByUserID') {
                    if (method === 'GET') {
                        const messsagesRef = admin.firestore().collection('messages');
                        const userID = query.userID;
                        const limit = query.limit;

                        if (userID) {
                            messsagesRef.where('recipientID', '==', userID).get()
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

                                    response.status(200).send(messages);
                                })
                                .catch(err => {
                                    response.status(500).send(err);
                                })
                        } else {
                            response.status(400).send('UserID needs to be sent to get messages.');
                        }
                    }
                } else if (path === '/messages/byWaitRequest') {
                    // gets all latest messages grouped by waitRequestID
                    if (method === 'GET') {
                        const messagesRef = admin.firestore().collection('messages');

                        messagesRef.orderBy('sentDate').get()
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

                                response.status(200).send(messages);
                            })
                            .catch(err => {
                                response.status(500).send(err);
                            });
                    }
                }
            } else if (path === '/createByEmail') {
                /* check if there's a user by email first.
                    If there's no user, then create a new user.
                */
                const data = request.body;
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

                    await sendNotificationForWaitList(firstName, lastName, email, phone, message, puppyID, color, puppyRequestData.waitRequestID);
                    await sendWaitRequestConfirmationEmail(email, firstName, lastName, puppyRequestData.waitRequestID);

                    response.status(200).send(puppyRequestData);
                } catch (err) {
                    response.status(400).send(err);
                }
            }
        }
    });
});

export const blogs = functions.https.onRequest((request, response) => {
    corsHeader(request, response, async () => {
        const query = request.query;
        const method = request.method;
        if (typeof query.key === 'undefined') {
            response.status(400).send('Missing API key');
        } else if (query.key === getAPIKEY()) {
            const blogID = query.blogID;
            let blogRef;
            if (typeof blogID !== 'undefined' && blogID.length > 0) {
                blogRef = admin.firestore().collection('blogs').doc(blogID);
            }
            if (method === 'GET') {
                if (typeof blogID !== 'undefined' && blogID.length > 0) {
                    if (typeof blogRef !== 'undefined') {
                        admin.firestore().collection('blogs').get()
                            .then(querySnapshot => {
                                const docs = querySnapshot.docs;
                                let blog: any = {};
                                for (let i = 0, max = docs.length; i < max; i++) {
                                    if (docs[i].id === blogID) {
                                        blog = docs[i].data();
                                        if (typeof docs[i - 1] !== 'undefined') {
                                            blog.nextBlogID = docs[i - 1].id;
                                        }
                                        if (typeof docs[i + 1] !== 'undefined') {
                                            blog.prevBlogID = docs[i + 1].id;
                                        }
                                        response.status(200).send(blog);
                                    }
                                }
                            })
                            .catch(err => {
                                response.status(500).send(err);
                            })
                    }
                } else {
                    admin.firestore().collection('blogs').get()
                        .then(querySnapshot => {
                            if (querySnapshot.size > 0) {
                                let retVal = [] as any;
                                querySnapshot.forEach((doc) => {
                                    const blog = doc.data();
                                    blog.message = blog.message.replace(/(<([^>]+)>)/gm, '');
                                    blog.message = blog.message.replace(/[\S](\.)[\S]/gm, ($0: any) => { return $0.replace('.', '. ') });
                                    blog.blogID = doc.id;
                                    retVal.push(blog);
                                });
                                retVal = retVal.sort((a: any, b: any) => {
                                    return (a.created > b.created ? -1 : a.created < b.created ? 1 : 0);
                                });
                                response.status(200).send(retVal);
                            } else {
                                response.status(200).send([]);
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                }
            } else if (method === 'PUT') {
                const data = request.body;
                if (typeof blogRef !== 'undefined') {
                    blogRef.set(data, { merge: true })
                        .then(() => {
                            const retVal = data;
                            retVal.blogID = blogID;
                            response.status(200).send(retVal);
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                } else {
                    data.created = new Date().toISOString();
                    admin.firestore().collection('blogs').add(data)
                        .then(() => {
                            response.sendStatus(201);
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                }
            } else if (method === 'DELETE') {
                if (typeof blogRef !== 'undefined') {
                    blogRef.delete()
                        .then(() => {
                            response.sendStatus(200);
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                } else {
                    response.sendStatus(500);
                }
            } else {
                response.status(400).send('Unsupported method');
            }
        }
    });
});

export const aboutDobermans = functions.https.onRequest((request, response) => {
    corsHeader(request, response, () => {
        const query = request.query;
        const method = request.method;
        if (typeof query.key === 'undefined') {
            response.status(400).send('Missing API key');
        } else {
            if (query.key === getAPIKEY()) {
                if (method === 'GET') {
                    admin.firestore().collection('aboutDobermans').get()
                        .then(querySnapshot => {
                            if (querySnapshot.size > 0) {
                                const retVal = querySnapshot.docs[0].data().aboutDobermans;
                                response.status(200).send(retVal);
                            } else {
                                response.sendStatus(200);
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        });
                } else if (method === 'PUT') {
                    const aboutDobermansData = request.body;
                    admin.firestore().collection('aboutDobermans').get()
                        .then(async (querySnapshot) => {
                            if (querySnapshot.size > 0) {
                                const aboutDobermansID = querySnapshot.docs[0].id;
                                const aboutDobermansRef = admin.firestore().collection('aboutDobermans').doc(aboutDobermansID);
                                aboutDobermansRef.set(aboutDobermansData, { merge: true })
                                    .then(() => {
                                        response.sendStatus(200);
                                    })
                                    .catch(err => {
                                        response.status(500).send(err);
                                    });
                            } else {
                                admin.firestore().collection('aboutDobermans').add(aboutDobermansData)
                                    .then(() => {
                                        response.sendStatus(200);
                                    })
                                    .catch(err => {
                                        response.status(500).send(err);
                                    });
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        })
                } else {
                    response.status(400).send('Unsupported method');
                }
            } else {
                response.status(404).send('Incorrect API key.');
            }
        }
    });
});