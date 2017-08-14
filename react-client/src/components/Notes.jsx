import React from 'react';

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

export default Notes;