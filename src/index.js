import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import allReducer from './reducers';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'bootstrap-select/dist/css/bootstrap-select.min.css';
import 'nouislider/distribute/nouislider.min.css';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import 'toastr/build/toastr.min.css';
import './assets/css/style.default.css';
import 'cropperjs/dist/cropper.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import './index.css';
import 'jquery';
import 'popper.js';
import 'jquery-ui';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'jquery.cookie/jquery.cookie.js';
import 'owl.carousel/dist/owl.carousel.js';
import 'owl.carousel2.thumbs/dist/owl.carousel2.thumbs.js';
import 'bootstrap-select/dist/js/bootstrap-select.min.js';
import 'nouislider/distribute/nouislider.min.js';
import 'jquery-countdown/dist/jquery.countdown.min.js';
import 'masonry-layout/dist/masonry.pkgd.min.js';
import 'imagesloaded/imagesloaded.pkgd.min.js';
import 'ladda/dist/ladda-themeless.min.css';
import 'react-image-crop/dist/ReactCrop.css';

const store = createStore(
    allReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
, document.getElementById('root')
);
serviceWorker.unregister();
