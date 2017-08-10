import React from 'react';
import ListItem from './ListItem.jsx';
import { Link } from 'react-router-dom';

const List = (props) => {
  return (
    <div>
      <h4>List ({ props.items.length })</h4>
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
