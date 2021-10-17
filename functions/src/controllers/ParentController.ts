import * as express from 'express';
import ParentService from '../services/ParentService';

const parent = express();

parent.get('/', (request, response) => {
    const query = request.query;
    ParentService.getAllParents(query)
        .then(res => {
            response.status(200).send(res);
        })
        .catch(err => {
            response.status(500).send(err);
        });
});

parent.get('/getByID', (request, response) => {
    const query: any = request.query;

    if (query.parentID) {
        ParentService.getParentByID(query.parentID)
            .then(res => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            })
    } else {
        response.status(400).send('ParentID is required.');
    }
});

parent.post('/', (request, response) => {
    const data = request.body;
    if (data) {
        ParentService.createParent(data)
            .then(res => {
                response.status(201).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('Data is required.');
    }
});

parent.put('/', (request, response) => {
    const data: any = request.body;
    if (data) {
        ParentService.updateParent(data)
            .then(res => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            })
    } else {
        response.status(400).send('ParentID and data is required');
    }
});

parent.delete('/', (request, response) => {
    const query: any = request.query;
    if (query.parentID) {
        ParentService.deleteParent(query.parentID)
            .then(res => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('ParentID is required.');
    }
});

export default parent;