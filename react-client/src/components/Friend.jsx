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
        <Info photo={this.state.info.facebook.photo} name={this.state.info.name} googledInfo={this.state.googledInfo} />
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
      <div className="row">
        <div className="col padding15">
          <img src={props.photo} className="circle" />
        </div>
        <div className="col">
          <h4 className="title small-height marginBottom5">
            { props.name }
          </h4>
          <span className="small grey small-height">
            { props.googledInfo.title }, { props.googledInfo.company }
          </span>
          <br></br>
          <span className="small small-height">
            { props.googledInfo.location }
          </span>
        </div>
      </div>
      <div className="row">
        {props.googledInfo.linkedin && <p className="small-height"><a href={ props.googledInfo.linkedin } >LinkedIn</a></p>}
        {props.googledInfo.facebook && <p className="small-height"><a href={ props.googledInfo.facebook } target="_blank">Facebook</a></p>}
        {props.googledInfo.twitter && <p className="small-height"><a href={ props.googledInfo.twitter } target="_blank">Twitter</a></p>}
        {props.googledInfo.instagram && <p className="small-height"><a href={ props.googledInfo.instagram } target="_blank">Instagram</a></p>}
        {props.googledInfo.behance && <p className="small-height"><a href={ props.googledInfo.behance } target="_blank">Behance</a></p>}
        {props.googledInfo.crunchbase && <p className="small-height"><a href={ props.googledInfo.linkedin } target="_blank">Crunchbase</a></p>}
    </div>
  </div>
  )
};

const Notes = (props) => {
  return (
    <div>
      <h5>Notes</h5>
      { props.notes.map((note, index) =>
        <div key={index}>
          <span className="small grey">{note.date}</span>
          <p className="squeezed-top-margin">{note.text}</p>
          </div>)
      }
    </div>
  )
};

export default Friend;
