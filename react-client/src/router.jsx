import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import App from './index.jsx';
import Friend from './components/Friend.jsx';

//TODO urgent: Routes are not protected by auth

const Router = () => (
    <HashRouter>
      <body className="HolyGrail">
      <div>
        <Route exact path="/" component={App} />
        <Route path="/friend/:id" component={Friend} />
      </div>
      </body>
    </HashRouter>
);

ReactDOM.render(<Router />, document.getElementById('app'));
