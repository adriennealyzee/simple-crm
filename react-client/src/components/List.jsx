import React from 'react';
import ListItem from './ListItem.jsx';
import { Link } from 'react-router-dom';

const List = (props) => {
  return (
    <div>
      <h4>List ({ props.items.length })</h4>
      { props.items.map( (item, index) =>
        <Link to={"/friend/:" + item.facebook.id} >
          <ListItem item={item} key={index} />
        </Link>
      ) }
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
