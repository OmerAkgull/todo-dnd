import React, { useState } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";


type Quote = {
  id: string;
  content: string;
};

const initial = Array.from({ length: 10 }, (v, k) => k).map((k) => {
  const custom: Quote = {
    id: `id-${k}`,
    content: `Quote ${k}`,
  };

  return custom;
});

const grid = 8;
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const QuoteItem = styled.div`
  width: 200px;
  border: 1px solid grey;
  margin-bottom: ${grid}px;
  background-color: lightblue;
  padding: ${grid}px;
`;

const RemoveButton = styled.button`
  background-color: red;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
`;

function Quote({ quote, index, onRemove }) {
  return (
    <Draggable draggableId={quote.id} index={index}>
      {(provided) => (
        <QuoteItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {quote.content}
          <RemoveButton onClick={() => onRemove(quote.id)}>Remove</RemoveButton>
        </QuoteItem>
      )}
    </Draggable>
  );
}

const QuoteList = React.memo(function QuoteList({ quotes, onRemove }) {
  return quotes.map((quote, index) => (
    <Quote quote={quote} index={index} key={quote.id} onRemove={onRemove} />
  ));
});

function QuoteApp() {
  const [state, setState] = useState({ quotes: initial });

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const quotes = reorder(
      state.quotes,
      result.source.index,
      result.destination.index
    );

    setState({ quotes });
  }

  function onRemove(id) {
    setState((prevState) => ({
      quotes: prevState.quotes.filter((quote) => quote.id !== id),
    }));
  }

  return (
    <>
    <h1>To-Do</h1>
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <QuoteList quotes={state.quotes} onRemove={onRemove} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
    </>
  );
}

export default QuoteApp;