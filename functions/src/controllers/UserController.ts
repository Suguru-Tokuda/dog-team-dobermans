import * as express from 'express';
import UserService from '../services/UserService';

const user = express();

user.get('/', (request, response) => {
    const query: any = request.query;

    UserService.getAllUsers(query)
        .then(res => {
            response.status(200).send(res);
        })
        .catch(err => {
            response.status(500).send(err);
        });
});

user.post('/search', (request, response) => {
    const data = request.body;

    if (data.searchKeywords) {
        UserService.searchUsers(data.searchKeywords)
            .then(res => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('Search keywords string is required.');
    }
});

user.post('/getEmailAvailability', (request, response) => {
    const data = request.body;

    if (data) {
        UserService.checkEmailAvailability(data.email, data.userID)
            .then(res => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('User search data is required.');
    }
});

user.get('/getByID', (request, response) => {
    const query: any = request.query;

    if (query.userID) {
        UserService.getUserByID(query.userID)
            .then(res => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('UserID is required.');
    }
});

user.post('/', (request, response) => {
    const data = request.body;

    if (data) {
        UserService.createUser(data)
            .then(res => {
                response.status(201).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('User data is required.');
    }
});

user.put('/', (request, response) => {
    const data = request.body;

    if (data) {
        UserService.updateUser(data)
            .then(res => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('User data is required.');
    }
});

user.delete('/', (request, response) => {
    const query: any = request.query;

    if (query.userID) {
        UserService.deleteUser(query.userID)
            .then(res => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('UserID is required.');
    }
});

export default user;