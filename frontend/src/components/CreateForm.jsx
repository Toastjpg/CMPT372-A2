import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function CreateForm({ addRecipe }) {
  const [showForm, setShowForm] = useState(false);

  // Variables for form fields
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [directions, setDirections] = useState("");

  function clearFields() {
    setName("");
    setIngredients("");
    setDirections("");
  }

  function handleClose() {
    clearFields();
    setShowForm(false);
  }

  function handleOpen() {
    setShowForm(true);
  }

  function handleSubmit() {
    // validate input
    if (!name || !ingredients || !directions) {
      alert("All form fields must be filled.");
    } else {
      addRecipe({
        id: Date.now(),
        name: name,
        ingredients: ingredients,
        directions: directions,
      });

      clearFields();
      handleClose();
    }
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        className="mt-3 border-2"
        variant="outline-light"
      >
        + New Recipe
      </Button>

      <Modal size="lg" show={showForm} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Recipe</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Recipe Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter recipe name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="ingredients">
              <Form.Label className="mt-2">Ingredients</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter ingredients list"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="directions">
              <Form.Label className="mt-2">Directions</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter directions to prepare dish"
                value={directions}
                onChange={(e) => setDirections(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Cancel
          </Button>

          <Button variant="success" onClick={handleSubmit}>
            Add Recipe
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateForm;
