import React from 'react';
import axios from 'axios';

class Friend extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    const { params } = this.props.match;
    const { id } = params;
    this.state = {
      friendId: id.split(':')[1],
      info: { facebook: { photo: '' } }
    }; // TODO Refactor to do cleaner late
  }

  componentWillMount() {
    // Get all information about friendId
    axios.get('/friendinfo/?id=' + this.state.friendId)
      .then((res) => {
        console.log('res.data', res.data);
        this.setState({ info: res.data });
      })
      .catch((err) => {
        console.log('err getting friend info: ', err);
      });
  }

  render() {
    return (
      <div>
        <h1>{ this.state.info.name }</h1>
        <img src={this.state.info.facebook.photo} />

      </div>
    )
  }
}

export default Friend;
