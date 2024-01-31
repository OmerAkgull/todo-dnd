import React, { useState } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";

type Quote = {
  id: string;
  content: string;
};

const initial = Array.from({ length: 0 }, (v, k) => k).map((k) => {
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
  width: 315px;
  border: 1px solid grey;
  margin-bottom: ${grid}px;
  background-color: #6b6a6a;
  color: white;
  padding: ${grid}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RemoveButton = styled.button`
  background-color: #be1313;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  &:hover {
    box-shadow: rgba(17, 17, 26, 0.2) 0px 1px 0px,
      rgba(17, 17, 26, 0.2) 0px 8px 24px, rgba(17, 17, 26, 0.2) 0px 16px 48px;
    background-color: #a31313;
  }

  &:active {
    box-shadow: rgba(17, 17, 26, 0.3) 0px 1px 0px,
      rgba(17, 17, 26, 0.3) 0px 4px 8px, rgba(17, 17, 26, 0.3) 0px 16px 32px;
    background-color: #8a1313;
  }
`;

const TodoInput = styled.input`
  width: 315px;
  height: 40px;
  margin-bottom: 0.5rem;
  border: 1px solid lightgrey;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
`;
const AddButton = styled.button`
  margin-left: 0.5rem;
  padding: 0.5rem 1.5rem;
  border-radius: 10%;
  cursor: pointer;
  border: none;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px,
    rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px;
  &:hover {
    box-shadow: rgba(17, 17, 26, 0.2) 0px 1px 0px,
      rgba(17, 17, 26, 0.2) 0px 8px 24px, rgba(17, 17, 26, 0.2) 0px 16px 48px;
    background-color: #007bff;
    color: #fff;
  }
  &:active {
    box-shadow: rgba(17, 17, 26, 0.3) 0px 1px 0px,
      rgba(17, 17, 26, 0.3) 0px 4px 8px, rgba(17, 17, 26, 0.3) 0px 8px 16px,
      rgba(17, 17, 26, 0.3) 0px 16px 32px;
    background-color: #0062cc;
    color: #fff;
  }
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
  const [todo, setTodo] = useState("");

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

  function handleAddTodo() {
    if (todo.trim() !== "") {
      const newTodo = {
        id: `id-${state.quotes.length}`,
        content: todo.trim(),
      };

      setState((prevState) => ({
        quotes: [...prevState.quotes, newTodo],
      }));

      setTodo("");
    }
  }

  return (
    <>
      <h1>To-Do List</h1>
      <TodoInput
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      ></TodoInput>
      <AddButton onClick={handleAddTodo}>Add</AddButton>
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
