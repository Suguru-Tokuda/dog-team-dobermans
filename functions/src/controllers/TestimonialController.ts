import * as express from 'express';
import TestimonialService from '../services/TestimonialService';

const testimonial = express();

testimonial.get('/', (request, response) => {
    const query = request.query;
    TestimonialService.getAllTestimonials(query)
        .then(res => {
            response.status(200).send(res);
        })
        .catch(err => {
            response.status(400).send(err);
        });
});

testimonial.get('/getByID', (request, response) => {
    const query: any = request.query;
    if (query && query.testimonialID) {
        TestimonialService.getTestimonialByID(query.testimonialID)
            .then(res => {
                response.status(200).send(res);
            })
            .catch(err => {
                response.status(500).send(err);
            })
    } else {
        response.status(400).send('TestimonialID is required.');
    }
});

testimonial.post('/', (request, response) => {
    const data: any = request.body;
    if (data) {
        TestimonialService.createTestimonial(data)
            .then(res => {
                response.status(201).send();
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('Testimonial data is required.');
    }
});

testimonial.put('/', (request, response) => {
    const data: any = request.body;

    if (data) {
        TestimonialService.updateTestimonial(data)
            .then(res => {
                response.status(200).send();
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('Testimonial data is required.');
    }
});

testimonial.delete('/', (request, response) => {
    const data: any = request.body;

    if (data.testimonialIDs) {
        TestimonialService.deleteTestimonial(data.testimonialIDs)
            .then(res => {
                response.status(200).send();
            })
            .catch(err => {
                response.status(500).send(err);
            });
    } else {
        response.status(400).send('TestimonialIDs are required.');
    }
});

export default testimonial;