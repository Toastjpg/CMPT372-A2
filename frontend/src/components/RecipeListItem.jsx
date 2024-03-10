import { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

import "./RecipeListItem.css";

function RecipeListItem({ recipe, onDelete }) {
  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  function handleOpen() {
    setShow(true);
  }

  function handleDelete(id) {
    if (confirm("Are you sure you want to delete this recipe?") === true) {
      onDelete(id);
    }
  }

  return (
    <>
      <Card onClick={handleOpen} border="light" className="border-2">
        <Card.Body>
          <Card.Title>{recipe.name}</Card.Title>
          <p className="text-muted">{new Date(recipe.id).toDateString()}</p>
        </Card.Body>
      </Card>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h2>{recipe.name}</h2>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Last Modified: {new Date(recipe.id).toLocaleString()}</p>
          <Row>
            <h3>Ingredients</h3>
          </Row>
          <Row>
            <p className="text-content">{recipe.ingredients}</p>
          </Row>
          <Row>
            <h3>Directions</h3>
          </Row>
          <Row>
            <p className="text-content">{recipe.directions}</p>
          </Row>
        </Modal.Body>

        <Modal.Footer className="justify-content-between">
          <Button variant="secondary" onClick={handleClose}>
            Close Recipe
          </Button>
          <Button variant="danger" onClick={() => handleDelete(recipe.id)}>
            Delete Recipe
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RecipeListItem;
