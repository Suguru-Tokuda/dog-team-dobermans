import * as express from 'express';
import ContactService from '../services/ContactService';

const contact = express();

contact.get('/', (request, response) => {
    ContactService.getContact()
        .then(res => {
            response.status(200).send(res);
        })
        .catch(err => {
            response.status(500).send(err);            
        });
});

contact.put('/', (request, response) => {
    const data = request.body;

    if (data && Object.keys(data).length > 0) {
        ContactService.updateContact(data)
            .then(res => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('Data is required to update.');
    }
});

export default contact;