import React from 'react';
import ListItem from './ListItem.jsx';

const List = (props) => (
  <div>
    <h4>List ({ props.items.length })</h4>
    { props.items.map( (item, index) => <ListItem item={item} key={index} />) }
  </div>
);

List.defaultProps = {
  items: [],
};

List.propTypes = {
  items: React.PropTypes.Array,
};

export default List;
