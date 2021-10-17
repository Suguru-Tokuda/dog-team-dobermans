import * as express from 'express';
import AboutUsService from '../services/AboutUsService';

const aboutUs = express();

aboutUs.get('/', (request, response) => {
    AboutUsService.getAboutUs()
        .then(res => {
            response.status(200).send(res);
        })
        .catch(err => {
            response.status(500).send(err);
        });
});

aboutUs.put('/missionStatements', (request, response) => {
    const data = request.body;

    if (data) {
        AboutUsService.updateMissionStatements(data)
            .then(res => {
                response.status(200).send();
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('Mission statement data is required.');
    }
});

aboutUs.put('/ourTeam', (request, response) => {
    const data = request.body;

    if (data) {
        AboutUsService.updateOurTeam(data)
            .then(res => {
                response.status(200).send();
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('Our team data is required.');
    }
});

aboutUs.get('/aboutDobermans', (request, response) => {
    AboutUsService.getAboutDobermans()
        .then(res => {
            response.status(200).send(res);
        })
        .catch(err => {
            response.status(500).send(err);
        });
});

aboutUs.put('/aboutDobermans', (request, response) => {
    const data = request.body;

    if (data) {
        AboutUsService.updateAboutDobermans(data)
            .then(res => {
                response.status(200).send();
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('About Dobermans data is required.');
    }
});

export default aboutUs;