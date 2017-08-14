import React from 'react';
import axios from 'axios';

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

        console.log('name', this.state.info.name);
        let q = this.state.info.name.split(" ").join("%20");
        let url = '/scrapecleaner?person=' + q;
        return axios.get(url)
          .then((googledInfo) => {
            // let newInfo = this.state.info;
            // newInfo['googledInfo'] = googledInfo.data;
            // console.log('newInfo', newInfo);

            console.log('googledInfo', googledInfo.data);
            this.setState({ googledInfo: googledInfo.data, infoLoaded: true });
            console.log('googledInfoState', this.state.googledInfo)
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
    console.log('this.state.currentNote', this.state.currentNote);
  }

  handleClick(e) {
    e.preventDefault();
    const { notes } = this.state;
    notes.push({ date: Date(), text: this.state.currentNote });
    this.setState({ notes })
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
        <h3>{ this.state.info.name }</h3>
        <img src={this.state.info.facebook.photo} />
        <div>
          <Info googledInfo={this.state.googledInfo} />
        </div>
        <div><Notes notes={this.state.notes} /></div>
        <div>
          <textarea type="text" onChange={this.handleChange} id="currentNote" value={this.state.currentNote} />
          <p><button onClick={this.handleClick}>Post</button></p>
        </div>
      </div>
    )
  }
}

const Loading = () => {
  return ( <div>Loading</div> )
};

const Info = (props) => {
  return(
    <div>
      <p className="small grey">{ props.googledInfo.title }, { props.googledInfo.company }</p>
      <p>{ props.googledInfo.location }</p>
      {props.googledInfo.linkedin && <p className="small-height"><a href={ props.googledInfo.linkedin }>LinkedIn</a></p>}
      {props.googledInfo.facebook && <p className="small-height"><a href={ props.googledInfo.facebook }>Facebook</a></p>}
      {props.googledInfo.twitter && <p className="small-height"><a href={ props.googledInfo.twitter }>Twitter</a></p>}
      {props.googledInfo.instagram && <p className="small-height"><a href={ props.googledInfo.instagram }>Instagram</a></p>}
      {props.googledInfo.behance && <p className="small-height"><a href={ props.googledInfo.behance }>Behance</a></p>}
      {props.googledInfo.crunchbase && <p className="small-height"><a href={ props.crunchbase.linkedin }>Crunchbase</a></p>}
    </div>
  )
};

const Notes = (props) => {
  return (
    <div>
      <h4>Notes</h4>
      { props.notes.map((note, index) =>
        <div key={index}>
          <span className="small">{note.date}</span>
          <p className="squeezed-top-margin">{note.text}</p>
          </div>)
      }
    </div>
  )
};

export default Friend;
