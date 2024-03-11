import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function CreateForm({ addRecipe }) {
  const [showForm, setShowForm] = useState(false);

  // Variables for form fields
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [directions, setDirections] = useState("");

  function clearFields() {
    setName("");
    setIngredients([""]);
    setDirections("");
  }

  function validateFields() {
    // validate non empty input
    if (!name || !directions) {
      alert("All form fields must be filled.");
      return false;
    }

    // validate character lengths
    if (name.length > 255) {
      alert("Name must be less than 255 characters.");
      return false;
    }

    if (ingredients.length === 0) {
      alert("A recipe must have at least 1 ingredient.");
      return false;
    }

    // validate ingredient list is non empty strings and less than 255 chars
    if (ingredients.some((ingredient) => !ingredient)) {
      alert("Ingredient names cannot be empty.");
      return false;
    }

    if (ingredients.some((ingredient) => ingredient.length > 255)) {
      alert("Ingredient names must be less than 255 characters.");
      return false;
    }

    return true;
  }

  function handleClose() {
    clearFields();
    setShowForm(false);
  }

  function handleOpen() {
    setShowForm(true);
  }

  function handleSubmit() {
    if (validateFields()) {
      // passes form data to app to make the post req call
      addRecipe({
        recipe_name: name,
        ingredients: ingredients,
        directions: directions,
      });

      clearFields();
      handleClose();
    }
  }

  function handleIngredientChange(index, value) {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  }

  function handleAddIngredient() {
    setIngredients([...ingredients, ""]);
  }

  function handleRemoveIngredient(index) {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
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
              {ingredients.map((ingredient, index) => (
                <div key={index} className="m-2">
                  <Row className="justify-content-between">
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder={`Enter ingredient #${index + 1}`}
                        value={ingredient}
                        onChange={(e) =>
                          handleIngredientChange(index, e.target.value)
                        }
                      />
                    </Col>
                    <Col xs="auto me-3">
                      <Button
                        variant="outline-danger"
                        className="ml-2"
                        onClick={() => handleRemoveIngredient(index)}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
              <Row>
                <Col className="ms-2">
                  <Button
                    variant="outline-success"
                    onClick={handleAddIngredient}
                  >
                    + Add Ingredient
                  </Button>
                </Col>
              </Row>
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
