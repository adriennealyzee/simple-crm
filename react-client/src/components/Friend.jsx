import React from 'react';
import axios from 'axios';
import Notes from './Notes.jsx';
import UserInfo from './UserInfo.jsx';

// TODO: refactor so you can directly access routes

class Friend extends React.Component {
  constructor(props) {
    super(props);
    const { params } = this.props.match;
    const { id } = params;
    this.state = {
      friendId: id.split(':')[1], // TODO Refactor to do cleaner query?
      info: { facebook: { photo: '' } },
      googledInfo: {},
      notes: [{ date: Date(), text:'Note1' }],
      currentNote: '',
      infoLoaded: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    // Get all information about friendId
    axios.get('/friendinfo/?id=' + this.state.friendId)
      .then((res) => {
        this.setState({ info: res.data });
        let q = this.state.info.name.split(" ").join("%20");
        let url = '/scrapecleaner?person=' + q;
        return axios.get(url)
          .then((googledInfo) => {
            this.setState({ googledInfo: googledInfo.data, infoLoaded: true });
          })
      })
      .catch((err) => {
        console.log('err getting friend info: ', err);
      });

    axios.get('/notes', { params: { friendId: this.state.friendId } })
      .then((res) => {
        this.setState({ notes: res.data });
      })
      .catch((err) => {
        console.log('err getting notes: ', err);
      });
  }

  handleChange(e) {
    // var newState = { friendId: this.state.friendId, info: this.state.info };
    let newState = {};
    newState[e.target.id] = e.target.value;
    this.setState({ currentNote: e.target.value });
  }

  handleClick(e) {
    e.preventDefault();
    const { notes } = this.state;
    notes.push({ date: Date(), text: this.state.currentNote });
    this.setState({ notes });
    // Make an axios request to post 'notes'
    axios.post('/addnote', { date: Date(), text: this.state.currentNote, friendId: this.state.friendId })
      .then((res) => {
        this.setState({ currentNote: '' }); // Clear notes

        // Get the notes and update the state
        axios.get('/notes', { params: { friendId: this.state.friendId } })
          .then((res) => {
            this.setState({ notes: res.data });
          })
          .catch((err) => {
            console.log('err getting notes: ', err);
          })
      })
      .catch((err) => {
        console.log("err posting to /addnote: ", err);
      });
  }

  render() {
    return (
      <div>
        <UserInfo photo={this.state.info.facebook.photo} name={this.state.info.name} googledInfo={this.state.googledInfo} />
        <div><Notes notes={this.state.notes} /></div>
        <div>
          <textarea type="text" onChange={this.handleChange} id="currentNote" value={this.state.currentNote} />
          <p><button onClick={this.handleClick}>Post</button></p>
        </div>
      </div>
    )
  }
}

export default Friend;
