import * as express from 'express';
import BlogService from '../services/BlogService';

const blog = express();

blog.get('/', (request, response) => {
    BlogService.getAllBlogs()
        .then(res => {
            response.status(200).send(res);
        })
        .catch(err => { 
            response.status(500).send(err);
        });
});

blog.get('/getByID', (request, response) => {
    const blogID: any = request.query.blogID;
    BlogService.getBlogByID(blogID)
        .then(res => {
            response.status(200).send(res);
        })
        .catch(err => { 
            response.status(500).send(err);
        });
});

blog.post('/', (request, response) => {
    const data = request.body;
    BlogService.createBlog(data)
        .then(() => {
            response.status(201).send();
        })
        .catch(err => {
            response.status(500).send(err);
        })
});

blog.put('/', (request, response) => {
    const data = request.body;
    BlogService.updateBlog(data)
        .then(res => {
            response.status(200).send(res);
        })
        .catch(err => {
            response.status(500).send(err);
        });
});

blog.delete('/', (request, response) => {
    const blogID: any = request.query.blogID;
    BlogService.deleteBlog(blogID)
        .then(() => {
            response.status(200).send();
        })
        .catch(err => {
            response.status(500).send(err);
        });
});

export default blog;