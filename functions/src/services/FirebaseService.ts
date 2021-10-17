import * as admin from "firebase-admin";

// admin.initializeApp(functions.config().firebase);
admin.initializeApp()

export default class FirebaseService {

    static getFirebaseAdmin() {
        return admin;
    } 

}
