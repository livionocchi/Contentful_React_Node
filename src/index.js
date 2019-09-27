import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import LANG_IT from "./translations/it";
import locale_it from 'react-intl/locale-data/it';
import {IntlProvider, addLocaleData} from "react-intl";

import './styles/main.scss';
import App from './views/App';

addLocaleData([...locale_it]);
const messages = {
    'it': LANG_IT
};

const routing = (
  <IntlProvider locale='it' messages={messages['it']}>
    <Router>
      <App />
    </Router>
  </IntlProvider>
)

ReactDOM.render(routing, document.getElementById('root'));
