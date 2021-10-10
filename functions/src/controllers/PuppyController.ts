import PuppyService from '../services/PuppyService';
import * as express from 'express';

const puppy = express();

puppy.get('/', (request, response) => {
    const query = request.query;
    PuppyService.getAllPuppies(query)
        .then(res => {
            response.status(200).send(res);
        })
        .catch(err => {
            response.status(500).send(err);
        });
});

puppy.get('/getByBuyerID', (request, response) => {
    const query: any = request.query;

    if (query.buyerID) {
        PuppyService.getPuppiesByBuyerID(query.buyerID)
            .then(res => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('BuyerID is required.');
    }
});

puppy.get('/getByID', (request, response) => {
    const query: any = request.query;

    if (query.buyerID) {
        PuppyService.getPuppyByID(query.buyerID)
            .then(res => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('PuppyID is required.');
    }
});

puppy.post('/', (request, response) => {
    const data = request.body;

    if (data) {
        PuppyService.createPuppy(data)
            .then(res => {
                response.status(201).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('No data posted.');
    }
});

puppy.put('/', (request, response) => {
    const query: any = request.query;
    const data = request.body;

    if (query.puppyID && data) {
        PuppyService.updatePuppy(data)
            .then(res => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('PuppyID and data are required.');
    }
});

puppy.delete('/', (request, response) => {
    const query: any = request.query;

    if (query.puppyID) {
        PuppyService.deletePuppy(query.puppyID)
            .then(res => {
                response.status(200).send();
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('PuppyID is required.');
    }
});

puppy.post('/processTransaction', (request, response) => {
    const data = request.body;

    if (data) {
        PuppyService.processPuppyTransaction(data)
            .then(res => {
                response.status(201).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            })
    } else {
        response.status(500).send('Data is required.');
    }
});

puppy.post('/cancelTransaction', (request, response) => {
    const query: any = request.query;

    if (query.puppyID) {
        PuppyService.cancelTransaction(query.puppyID)
            .then((res: any) => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(500).send('PuppyID is required.');
    }
});

export default puppy;