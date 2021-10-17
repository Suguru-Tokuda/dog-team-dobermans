import HomepageContentService from "../services/HomepageContentService";
import * as express from "express";

const homepage = express();

homepage.get('/', (request, response) => {
    HomepageContentService.getHomepageContents()
        .then((res: any) => {
            if (res) {
                response.status(200).send(res);
            } else {
                response.status(404);
            }
        })
        .catch((err: any) => {
            response.status(500).send(err);
        });
});

homepage.put('/', (request, response) => {
    const data = request.body;
    HomepageContentService.createHomepageContent(data)
        .then((res) => {
            if (res)
                response.status(201).send();
        })
        .catch((err) => {
            response.status(500).send(err);
        });
});

homepage.get('/puppyMessage', (request, response) => {
    HomepageContentService.getPuppyMessage()
        .then(res => {
            response.status(200).send(res);
        })
        .catch(err => {
            response.status(500).send(err);
        })
});


export default homepage;