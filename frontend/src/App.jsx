import axios from "axios";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import RecipeList from "./components/RecipeList";
import CreateForm from "./components/CreateForm";

import { useEffect, useState } from "react";

function App() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/recipes/all")
      .then((res) => {
        setRecipes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function addRecipe(newRecipe) {
    axios({
      method: "post",
      url: "http://localhost:3000/recipes",
      data: newRecipe,
    })
      .then((res) => {
        const newList = [...recipes, res.data];
        setRecipes(newList);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function deleteRecipe(id) {
    axios({
      method: "delete",
      url: "http://localhost:3000/recipes/" + id,
    })
      .then((res) => {
        setRecipes((currentRecipes) => {
          return currentRecipes.filter((recipe) => recipe.recipe_id !== id);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // TODO
  function editRecipe(id, newRecipe) {
    // calls put request and passes the data to end point
    console.log("calling put request to edit");
    // replace local object with the returned one

    axios({
      method: "put",
      url: "http://localhost:3000/recipes/" + id,
      data: newRecipe,
    })
      .then((res) => {
        // replace the recipe obj with the returned one from res.data
        const updated = res.data;
        setRecipes((currentRecipes) => {
          return currentRecipes.map((recipe) => {
            return recipe.recipe_id === updated.recipe_id ? updated : recipe;
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <Container>
        <Row className="py-4 mb-4 border-bottom border-3 border-light justify-content-between">
          <Col xs="auto" className="text-left">
            <h1>🍳 Recipe App</h1>
          </Col>
          <Col xs="auto" className="text-right">
            <CreateForm addRecipe={addRecipe}></CreateForm>
          </Col>
        </Row>

        <Row>
          <Col>
            <RecipeList
              recipes={recipes}
              onDelete={deleteRecipe}
              onEdit={editRecipe}
            ></RecipeList>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
