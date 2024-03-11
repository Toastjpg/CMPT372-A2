import axios from "axios";

import { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import "./RecipeListItem.css";

function RecipeListItem({ recipe, onDelete, onEdit }) {
  const [show, setShow] = useState(false);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    recipe_name: "",
    ingredients: [],
    directions: "",
  });

  function handleClose() {
    setShow(false);
    setEditMode(false);
  }

  function handleOpen() {
    // make a get request to fetch the ingredients
    axios
      .get("http://localhost:3000/ingredients/" + recipe.recipe_id)
      .then((res) => {
        setIngredientsList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    setShow(true);
  }

  function handleEdit() {
    setEditMode(true);

    // populate the edit fields with current data
    setEditData({
      recipe_name: recipe.recipe_name,
      ingredients: ingredientsList.map((obj) => {
        return obj.ingredient_name;
      }),
      directions: recipe.directions,
    });
  }

  function handleEditDataChange(field, value) {
    setEditData((prevEditRecipe) => ({
      ...prevEditRecipe,
      [field]: value,
    }));
  }

  function validateEdits() {
    const name = editData.recipe_name;
    const directions = editData.directions;
    const ingredients = editData.ingredients;

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

  function handleEditSubmit() {
    if (validateEdits()) {
      // pass recipe id and editData
      onEdit(recipe.recipe_id, editData);
      handleClose();
    }
  }

  function handleIngredientChange(index, value) {
    const newIngredients = [...editData.ingredients];
    newIngredients[index] = value;
    handleEditDataChange("ingredients", newIngredients);
  }

  function handleAddIngredient() {
    handleEditDataChange("ingredients", [...editData.ingredients, ""]);
  }

  function handleRemoveIngredient(index) {
    const newIngredients = [...editData.ingredients];
    newIngredients.splice(index, 1);
    handleEditDataChange("ingredients", newIngredients);
  }

  function handleDelete(id) {
    if (confirm("Are you sure you want to delete this recipe?") === true) {
      onDelete(id);
      handleClose();
    }
  }

  return (
    <>
      <Card onClick={handleOpen} border="light" className="border-2">
        <Card.Body>
          <Card.Title>{recipe.recipe_name}</Card.Title>
          <p className="text-muted">
            {new Date(recipe.last_modified).toDateString()}
          </p>
        </Card.Body>
      </Card>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          {editMode ? (
            <Modal.Title>
              <Form.Control
                type="text"
                placeholder="Enter recipe name"
                value={editData.recipe_name}
                onChange={(e) =>
                  handleEditDataChange("recipe_name", e.target.value)
                }
              />
            </Modal.Title>
          ) : (
            <Modal.Title>
              <h2>{recipe.recipe_name}</h2>
            </Modal.Title>
          )}
        </Modal.Header>

        <Modal.Body>
          <p>
            Last Modified: {new Date(recipe.last_modified).toLocaleString()}
          </p>

          <Row>
            <h3>Ingredients</h3>
          </Row>
          <Row className="m-2">
            {editMode ? (
              <>
                {editData.ingredients.map((ingredient, index) => (
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
              </>
            ) : (
              <>
                {ingredientsList.map((obj, index) => (
                  <p key={index}>
                    {index + 1}. {obj.ingredient_name}
                  </p>
                ))}
              </>
            )}
          </Row>

          <Row>
            <h3>Directions</h3>
          </Row>
          <Row className="m-2">
            {editMode ? (
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter directions to prepare dish"
                value={editData.directions}
                onChange={(e) =>
                  handleEditDataChange("directions", e.target.value)
                }
              />
            ) : (
              <p className="text-content">{recipe.directions}</p>
            )}
          </Row>
        </Modal.Body>

        {editMode ? (
          <Modal.Footer className="justify-content-end">
            <Button variant="danger" onClick={() => setEditMode(false)}>
              Cancel
            </Button>

            <Button variant="success" onClick={() => handleEditSubmit()}>
              Save
            </Button>
          </Modal.Footer>
        ) : (
          <Modal.Footer className="justify-content-between">
            <div>
              <Button
                variant="secondary"
                className="me-2"
                onClick={handleClose}
              >
                Close
              </Button>
              <Button
                variant="primary"
                className="me-3"
                onClick={() => handleEdit()}
              >
                Edit
              </Button>
            </div>

            <Button
              variant="danger"
              onClick={() => handleDelete(recipe.recipe_id)}
            >
              Delete
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}

export default RecipeListItem;
