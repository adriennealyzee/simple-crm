import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import List from './components/List.jsx';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      currentUser: '',
    };
  }

  componentWillMount() {
    axios.get('/currentuser')
      .then((res) => {
        if (res.data) {
          this.setState({currentUser: res.data});
        }
      })
      .catch((err) => {
        console.log('err getting current user: ', err);
      });


    axios.get('/allmypeople')
      .then((friends) => {
        this.setState({ items: friends.data });
      })
      .catch((err) => {
          console.log('err user not logged in', err)
        }
      );
  }

  render() {
    // TODO: make the conditional rendering neater
    if (!this.state.currentUser || !this.state.items) {
      return (
        <div>
          <h1>Login</h1>
          <a href="/auth/facebook">Login with Facebook</a>
        </div>
      );
    } else {
      return (
        <div>
          <p>Logged in with Facebook.</p>
          Hello { this.state.currentUser.local.name }!
          <List items={this.state.items} />
        </div>
      )
    }
  }

}

// ReactDOM.render(<App />, document.getElementById('app'));

export default App;