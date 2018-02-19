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
          console.log('res.data', res.data);
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
    const tagList = this.state.currentUser.meta ? Object.entries(this.state.currentUser.meta.tags).map(([key,value])=>{
      return (
        <div>{key} ({value.toString()})</div>
      );
    }) : 'No tags';

    // TODO: make the conditional rendering neater
    if (isLoggedIn) {
      return (
        <div className="HolyGrail-body">
          <main className="HolyGrail-content">
            <p>Connected with Facebook. <a href="">Connect Gmail.</a></p>
            {/*<p>Hello { this.state.currentUser.local.name }!</p>*/}

            <List friends={this.state.friends} />
          </main>
          <nav className="HolyGrail-nav">
            <h3>Categories</h3>
            { tagList }
          </nav>
        </div>
      )
    }
    return <div><GuestGreeting /></div>
  }
}

const GuestGreeting = () => {
  return (
    <div>
      <p>FriendForce helps you manage your contacts.</p>
      <a href="/auth/facebook"><img src="https://i.stack.imgur.com/LKMP7.png" width="72px" height="33px" /></a>
      <p><a href="/auth/google">Sign In with Google</a></p>
    </div>
  );
};

// ReactDOM.render(<App />, document.getElementById('app'));

export default App;