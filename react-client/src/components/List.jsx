import React from 'react';
import ListItem from './ListItem.jsx';
import { Link } from 'react-router-dom';

const List = (props) => {
  return (
    <div>
      <p className="title">List ({ props.items.length })</p>
      <ul className="collection">
        { props.items.map( (item, index) =>
          <Link to={"/friend/:" + item._id} key={index}><ListItem item={item} key={index} /></Link>
        ) }
      </ul>
    </div>
  );
};

List.defaultProps = {
  items: [],
};

List.propTypes = {
  items: React.PropTypes.Array,
};

export default List;
