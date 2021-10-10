import FirebaseService from "./FirebaseService";

const admin = FirebaseService.getFirebaseAdmin();

export default class BlogService {
    static getAllBlogs() {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('blogs').get()
                .then(querySnapshot => {
                    let retVal = [] as any;
                    if (querySnapshot.size > 0) {
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
                    }

                    resolve(retVal);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static getBlogByID(blogID: string) {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('blogs').doc(blogID).get()
                .then(querySnapshot => {
                    const blog: any = querySnapshot.data();
                    blog.blogID = querySnapshot.id;

                    resolve(blog);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static createBlog(data: any) {
        return new Promise((resolve, reject) => {
            data.created = new Date().toISOString();
                admin.firestore().collection('blogs').add(data)
                    .then(() => {
                        resolve(true);
                    })
                    .catch(err => {
                        reject(err);
                    });
        });
    }

    static updateBlog(data: any) {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('blogs').doc(data.blogID).set(data, { merge: true })
                .then(() => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static deleteBlog(blogID: string) {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('blogs').doc(blogID).set({statusID: 2}, { merge: true })
                .then(() => {
                    resolve(true);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}