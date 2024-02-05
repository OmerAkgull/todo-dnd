import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

type Quote = {
  id: string;
  content: string;
};

const initial = Array.from({ length: 0 }, (k) => k).map((k) => {
  const custom: Quote = {
    id: `id-${k}`,
    content: `Quote ${k}`,
  };

  return custom;
});

const grid = 8;
const reorder = (
  list: Quote[],
  startIndex: number,
  endIndex: number
): Quote[] => {
  const result: Quote[] = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const QuoteItem = styled.div`
  width: 400px;
  border: 2px solid black;
  margin-bottom: ${grid}px;
  padding: ${grid}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: black;
  background-color: white;
  border-radius: 5px;
  @media (max-width: 600px) {
    width: 330px;
  }
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

const EditButton = styled.button`
  background-color: #1980d4;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  &:hover {
    box-shadow: rgba(17, 17, 26, 0.2) 0px 1px 0px,
      rgba(17, 17, 26, 0.2) 0px 8px 24px, rgba(17, 17, 26, 0.2) 0px 16px 48px;
    background-color: #1150da;
  }

  &:active {
    box-shadow: rgba(17, 17, 26, 0.3) 0px 1px 0px,
      rgba(17, 17, 26, 0.3) 0px 4px 8px, rgba(17, 17, 26, 0.3) 0px 16px 32px;
    background-color: #1c5bb9;
  }
`;

const TodoInput = styled.input`
  width: 400px;
  height: 40px;
  margin-bottom: 0.5rem;
  border: 1px solid lightgrey;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  @media (max-width: 600px) {
    width: 250px;
  }
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

const EditInput = styled.input`
  width: 70%;
  border: 2px solid black;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  margin-left: 15%;
`;

const Footer = styled.footer`
  background-color: rgba(0, 0, 0, 0.377) !important;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  color: white;
  text-align: center;
`;

const GithubIcon = styled(FontAwesomeIcon)`
  font-size: 1.5rem;
  cursor: pointer;
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: white;
`;

type QuoteProps = {
  quote: {
    id: string;
    content: string;
  };
  index: number;
  onRemove: (id: string) => void;
  onClick: () => void;
};

function Quote({ quote, index, onRemove, onClick }: QuoteProps) {
  return (
    <Draggable draggableId={quote.id} index={index}>
      {(provided) => (
        <QuoteItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {quote.content}
          <div>
            <EditButton onClick={onClick}>
              <FontAwesomeIcon icon={faPenToSquare} />
            </EditButton>
            <RemoveButton onClick={() => onRemove(quote.id)}>
              {" "}
              <FontAwesomeIcon icon={faTrash} />
            </RemoveButton>
          </div>
        </QuoteItem>
      )}
    </Draggable>
  );
}
// type QuoteListProps = {
//   quotes: {
//     id: string;
//     content: string;
//   }[];
//   onRemove: (id: string) => void;
//   onClick: () => void;
// };

// const QuoteList = React.memo(function QuoteList({
//   quotes,
//   onRemove,
//   onClick,
// }: QuoteListProps) {
//   return quotes.map((quote, index) => (
//     <Quote
//       quote={quote}
//       index={index}
//       key={quote.id}
//       onRemove={onRemove}
//       onClick={onClick}
//     />
//   ));
// });

function QuoteApp() {
  const [state, setState] = useState({ quotes: initial });
  const [todo, setTodo] = useState("");
  const [show, setShow] = useState(false);
  const [editTodo, setEditTodo] = useState("");
  const [currentId, setCurrentId] = useState("");

  const showModal = (id: string) => {
    setShow(true);
    setCurrentId(id);
  };

  const hideModal = () => {
    setShow(false);
  };

  useEffect(() => {
    const savedToDos = localStorage.getItem("quotes");
    if (savedToDos && savedToDos !== "null" && savedToDos !== "") {
      try {
        const parsedQuotes = JSON.parse(savedToDos);
        if (Array.isArray(parsedQuotes)) {
          setState({ quotes: parsedQuotes });
        } else {
          console.warn("Invalid quotes data in localStorage");
          saveToDos(initial);
          setState({ quotes: initial });
        }
      } catch (error) {
        console.warn("Invalid quotes data in localStorage", error);
        saveToDos(initial);
        setState({ quotes: initial });
      }
    } else {
      saveToDos(initial);
      setState({ quotes: initial });
    }
  }, []);

  function saveToDos(quotes: Quote[]): void {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  function onDragEnd(result: DropResult): void {
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
    saveToDos(quotes);
  }

  function onRemove(id: string) {
    setState((prevState) => {
      const quotes = prevState.quotes.filter((quote) => quote.id !== id);
      saveToDos(quotes);
      return { quotes };
    });
  }

  function handleAddTodo() {
    if (todo.trim() !== "") {
      const newTodo = {
        id: `id-${state.quotes.length}`,
        content: todo.trim(),
      };

      setState((prevState) => {
        const quotes = [...prevState.quotes, newTodo];
        saveToDos(quotes);
        return { quotes };
      });

      setTodo("");
    }
  }

  function EditTodo() {
    if (editTodo.trim() !== "") {
      let findTodo: Quote | undefined = state?.quotes?.find(
        (item) => item.id === currentId
      );
      if (findTodo) {
        findTodo.content = editTodo;
        setState(state);
        setEditTodo("");
        setShow(false);
      } else {
        console.warn("Todo not found for id:", currentId);
      }
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
              {state?.quotes?.map((quote, index) => {
                return (
                  <Draggable
                    draggableId={quote.id}
                    index={index}
                    key={quote?.id}
                  >
                    {(provided) => (
                      <QuoteItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {quote.content}
                        <div>
                          <EditButton onClick={() => showModal(quote?.id)}>
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </EditButton>
                          <RemoveButton onClick={() => onRemove(quote.id)}>
                            {" "}
                            <FontAwesomeIcon icon={faTrash} />
                          </RemoveButton>
                        </div>
                      </QuoteItem>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Modal show={show} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit To-Do</Modal.Title>
        </Modal.Header>
        <EditInput
          value={editTodo}
          onChange={(e) => setEditTodo(e.target.value)}
        ></EditInput>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideModal}>
            Close
          </Button>
          <Button variant="primary" onClick={EditTodo}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer>
        Created by Omer Akgul{" "}
        <StyledLink href="https://github.com/OmerAkgull" target="blank">
          <GithubIcon icon={faGithub} />
        </StyledLink>
      </Footer>
    </>
  );
}

export default QuoteApp;
