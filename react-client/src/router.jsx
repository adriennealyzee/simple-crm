import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './index.jsx';
import Friend from './components/Friend.jsx';


const Router = () => (
    <BrowserRouter>
      <div>
        <Route exact path="/" component={App} />
        <Route path="/friend/:id" component={Friend} />
      </div>
    </BrowserRouter>
);

ReactDOM.render(<Router />, document.getElementById('app'));
