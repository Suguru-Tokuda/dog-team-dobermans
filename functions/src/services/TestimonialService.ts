import FirebaseService from "./FirebaseService";
import EmailService from "./EmailService";
import ConfigService from "./ConfigService";

const admin = FirebaseService.getFirebaseAdmin();

export default class TestimonialService {
    static getAllTestimonials(data: any) {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('testimonials').get()
                .then(querySnapshot => {
                    const testimonialsArr: any = [];
                    if (querySnapshot.size > 0) {
                        querySnapshot.forEach((doc) => {
                            const testimonial = doc.data();
                            testimonial.testimonialID = doc.id;
                            if (typeof data.approved !== 'undefined' && data.approved === 'true') {
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

                    resolve(testimonialsArr);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static getTestimonialByID(testimonialID: string) {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('testimonials').doc(testimonialID).get()
                .then(doc => {
                    const retVal = doc.data();
                    resolve(retVal);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static createTestimonial(data: any) {
        return new Promise(async (resolve, reject) => {
            try {
                await admin.firestore().collection('testimonials').add(data)
                const { firstName, lastName, dogName, email } = data;
                await this.notifyNewTestimonial(firstName, lastName, dogName, email);
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }

    static updateTestimonial(data: any) {
        return new Promise((resolve, reject) => {
            const { testimonialID } = data;
            if (data.testimonialID)
                delete data.testimonialID;
            const testimonialRef = admin.firestore().collection('testimonials').doc(testimonialID);
            testimonialRef.set(data, { merge: true })
                .then(() => {
                    const retVal = data;
                    retVal.testimonialID = testimonialID;
                    resolve(retVal);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static deleteTestimonial(testimonialIDs: [string]) {
        return new Promise((resolve, reject) => {
            testimonialIDs.forEach(async (testimonialID: string) => {
                try {
                    const testimonialRef = admin.firestore().collection('testimonials').doc(testimonialID);
                    await testimonialRef.set({statusID: 2}, {merge: true});
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            });
        });
    }

    static notifyNewTestimonial (firstName: string, lastName: string, dogName: string, email: string) {
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

            EmailService.sendEmail(ConfigService.getBreederEmail(), 'New Testimonial Submitted', htmlBody)
                .then(() => {
                    resolve(1);
                })
                .catch(() => {
                    reject();
                });
        });
    }
}