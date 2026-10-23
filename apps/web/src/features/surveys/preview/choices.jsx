import React from 'react';
import Questions from './questions.jsx';
export default function Choices({ question = 2 }) {
  return <Questions question={question} />;
}
