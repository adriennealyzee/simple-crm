import React from 'react';

const ListItem = (props) => (
  <div>
    <img src={props.item.facebook.photo} />
    { props.item.name }
  </div>
);

export default ListItem;