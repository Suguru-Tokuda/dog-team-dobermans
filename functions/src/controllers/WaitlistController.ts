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

waitlist.post('/getByRange', (request, response) => {
    const data: any = request.body;
    if (data.startIndex !== undefined && data.endIndex !== undefined && data.sortField !== undefined && data.sortDescending !== undefined && data.activeOnly !== undefined && data.startDate && data.endDate) {
        WaitlistService.getWaitRequestsByRange(data)
            .then(res => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('Invalid data');
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

waitlist.post('/getByIDs', (request, response) => {
    const data: any = request.body;

    if (data.waitRequestIDs && data.waitRequestIDs.length > 0) {
        WaitlistService.getWaitRequestByIDs(data.waitRequestIDs)
            .then(res => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('WaitRequestIDs are required.');
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