import * as express from 'express';
import WaitlistService from '../services/WaitlistService';

const waitlist = express();

waitlist.get('/', (request, response) => {
    const query: any = request.query;

    WaitlistService.getAllWaitRequests(query.recipientID)
        .then(res => {
            response.status(200).send(res);
        })
        .catch(err => {
            response.status(500).send(err);
        });
});

waitlist.get('/getByRange', (request, response) => {
    const query: any = request.query;
    if (query.startIndex !== undefined && query.endIndex !== undefined && query.sortField !== undefined && query.sortDescending !== undefined && query.activeOnly !== undefined) {
        query.startIndex = parseInt(query.startIndex);
        query.endIndex = parseInt(query.endIndex);
        query.sortDescending = query.sortDescending === 'true' ? true : false;
        query.activeOnly = query.activeOnly === 'true' ? true : false;

        WaitlistService.getWaitRequestsByRange(query)
            .then(res => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('Invalid query');
    }
});

waitlist.get('/getByID', (request, response) => {
    const query: any = request.query;
    if (query.waitRequestID) {
        WaitlistService.getWaitRequestByID(query.waitRequestID, query.recipientID)
            .then(res => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('WaitRequestID is required.');
    }
});

waitlist.get('/getByUserID', (request, response) => {
    const query: any = request.query;
    if (query.userID) {
        WaitlistService.getWaitRequestsByUserID(query.userID)
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

waitlist.post('/', (request, response) => {
    const data = request.body;
    if (data) {
        WaitlistService.createWaitRequest(data)
            .then(res => {
                response.status(201).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            })
    } else {
        response.status(400).send('Data is required.');
    }
});

waitlist.post('/createByEmail', (request, response) => {
    const data = request.body;
    if (data) {
        WaitlistService.createWaitRequestByEmail(data)
            .then(res => {
                response.status(201).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            })
    } else {
        response.status(400).send('Data is required.');
    }
});

waitlist.put('/', (request, response) => {
    const data = request.body;
    if (data) {
        WaitlistService.updateWaitRequest(data)
            .then(res => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('Data is required.')
    }
});

waitlist.delete('/', (request, response) => {
    const data = request.body;
    if (data.waitRequestIDs) {
        WaitlistService.deleteWaitRequest(data.waitRequestIDs)
            .then(() => {
                response.status(200).send();
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('WaitRequestIDs are required.')
    }
});

waitlist.get('/messages', (request, response) => {
    const query: any = request.query;
    if (query.waitRequestID) {
        WaitlistService.getMessages(query.waitRequestID, query.recipientID, query.onlyUnread)
            .then(res => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('WaitRequestID is required.');
    }
});

waitlist.post('/messages', (request, response) => {
    const data = request.body;
    if (data) {
        WaitlistService.sendMessage(data)
            .then(res => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('Data is required.');
    }
});

waitlist.put('/messages', (request, response) => {
    const data = request.body;
    if (data) {
        WaitlistService.updateMessage(data)
            .then(res => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('Data is required.');
    }
});

waitlist.post('/messages/markAsRead', (request, response) => {
    const data = request.body;
    if (data) {
        WaitlistService.markMessageAsRead(data)
            .then(res => {
                response.status(200).send();
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('Data is required.');
    }
});

waitlist.get('/messages/unreadByUseID', (request, response) => {
    const query: any = request.query;
    if (query.userID) {
        WaitlistService.getUnreadMessagesByUserID(query.userID, query.limit)
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

waitlist.get('/messages/byUserID', (request, response) => {
    const query: any = request.query;
    if (query.userID) {
        WaitlistService.getMessagesByUserID(query.userID, query.limit)
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

waitlist.get('/messages/byWaitRequest', (request, response) => {
    WaitlistService.getMessagesByWaitRequest()
        .then(res => {
            response.status(200).send(res);
        })
        .catch(err => {
            response.status(500).send(err);
        });
});

waitlist.post('/notify', (request, response) => {
    const data = request.body;
    WaitlistService.notifyUsers(data)
        .then(res => {
            response.status(200).send();
        })
        .catch(err => {
            response.status(500).send(err);
        });
});

export default waitlist;