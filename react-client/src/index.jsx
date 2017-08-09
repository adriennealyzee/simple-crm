import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import List from './components/List.jsx';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: ['Hello', 'Bye'],
    };
  }

  componentDidMount() {
    axios.get('/allmypeople')
      .then((res) => {
        console.log('res', res);
        console.log('Received contacts!');
      });
    // $.ajax({
    //   url: '/items',
    //   success: (data) => {
    //     this.setState({
    //       items: data,
    //     });
    //   },
    //   error: (err) => {
    //     console.log('err', err);
    //   },
    // });
  }

  render() {
    return (
      <div>
        <h1>Login</h1>
        <a href="/auth/facebook">Login with Facebook</a>
        <List items={this.state.items} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
