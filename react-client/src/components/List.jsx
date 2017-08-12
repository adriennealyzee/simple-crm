import React from 'react';
import ListItem from './ListItem.jsx';
import { Link } from 'react-router-dom';

const List = (props) => {
  return (
    <div>
      <p className="title">Contacts ({ props.friends.length })</p>
      <ul className="collection">
        { props.friends.map( (friend, index) =>
          <Link to={"/friend/:" + friend._id} key={index}><ListItem friend={friend} key={index} /></Link>
        ) }
      </ul>
    </div>
  );
};

List.defaultProps = {
  friends: [],
};

List.propTypes = {
  friends: React.PropTypes.Array,
};

export default List;
