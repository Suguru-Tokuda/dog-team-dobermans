import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-select/dist/css/bootstrap-select.min.css';
import 'nouislider/distribute/nouislider.min.css';
// import 'owl.carousel/dist/assets/owl.carousel.min.css';
// import 'owl.carousel/dist/assets/owl.theme.default.min.css';
import './assets/css/style.default.css';
import 'jquery';
import 'popper.js';
import 'jquery-ui';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'jquery.cookie/jquery.cookie.js';
// // import 'owl.carousel/dist/owl.carousel.min.js';
// // import 'owl.carousel2.thumbs/dist/owl.carousel2.thumbs.min.js';
import 'bootstrap-select/dist/js/bootstrap-select.min.js';
import 'nouislider/distribute/nouislider.min.js';
import 'jquery-countdown/dist/jquery.countdown.min.js';
import 'masonry-layout/dist/masonry.pkgd.min.js';
import 'imagesloaded/imagesloaded.pkgd.min.js';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
