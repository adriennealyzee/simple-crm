import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import List from './components/List.jsx';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
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
        this.setState({ friends: friends.data });
      })
      .catch((err) => {
          console.log('err user not logged in', err)
        }
      );
  }

  render() {
    const isLoggedIn = this.state.currentUser && this.state.friends;
    // TODO: make the conditional rendering neater
    if (isLoggedIn) {
      return (
        <div>
          <p>Logged in with Facebook.</p>
          Hello { this.state.currentUser.local.name }!
          <List friends={this.state.friends} />
        </div>
      )
    }
    return <GuestGreeting />
  }
}

const GuestGreeting = () => {
  return (
    <div>
      <p>Simple CRM helps you manage your contacts.</p>
      <a href="/auth/facebook"><img src="https://i.stack.imgur.com/LKMP7.png" width="72px" height="33px" /></a>
    </div>
  );
};

// ReactDOM.render(<App />, document.getElementById('app'));

export default App;