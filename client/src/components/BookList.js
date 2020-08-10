import React from 'react';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';

const getBooksQuery = gql`
 {
  books{
    name
    id
  }
 }
`;

function BookList() {
  console.log(getBooksQuery.data);
  return (
    <div>
      <ul id="book-list">
        <li>Book name</li>
      </ul>
    </div>
  );
}

export default graphql(getBooksQuery)(BookList);
