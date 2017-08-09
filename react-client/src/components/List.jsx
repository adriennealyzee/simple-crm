import React from 'react';
import ListItem from './ListItem.jsx';

const List = (props) => (
  <div>
    <h4>List</h4>
    There are { props.items.length } items.
    { props.items.map(item => <ListItem item={item} />)}
  </div>
);

List.defaultProps = {
  items: [],
};

List.propTypes = {
  items: React.PropTypes.Array,
};

export default List;
