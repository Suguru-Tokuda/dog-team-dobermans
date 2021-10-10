import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';

import HomepageContentController from './controllers/HomepageContentController';
import PuppyController from './controllers/PuppyController';
import ParentController from './controllers/ParentController';
import UserController from './controllers/UserController';
import AboutUsController from './controllers/AboutUsController';
import TestimonialController from './controllers/TestimonialController';
import WaitlistController from './controllers/WaitlistController';
import BlogController from './controllers/BlogController';

const main = express();
main.use(cors({origin: "*"}))

main.use('/homepageContents', HomepageContentController);
main.use('/puppies', PuppyController);
main.use('/parents', ParentController);
main.use('/users', UserController);
main.use('/aboutUs', AboutUsController);
main.use('/testimonials', TestimonialController);
main.use('/blogs', BlogController);
main.use('/waitlist', WaitlistController);

exports.api = functions.https.onRequest(main);
