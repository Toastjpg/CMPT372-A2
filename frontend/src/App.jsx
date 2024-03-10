import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import RecipeList from "./components/RecipeList";
import CreateForm from "./components/CreateForm";

import { useEffect, useState } from "react";

function App() {
  // NOTE: This works? but triggers a rerender
  // const [recipes, setRecipes] = useState([]);

  // useEffect(() => {
  //   // NOTE: Getting data from this use effect will cause app to rerender again
  //   // Because of the setState being called -> will trigger rerender
  //   // useEffect function runs after initial render
  //   const items = localStorage.getItem("recipes");

  //   if (items) {
  //     const recipeList = JSON.parse(items);
  //     setRecipes(recipeList);
  //   }
  // }, []);

  // function addRecipe(newRecipe) {
  //   const newList = [...recipes, newRecipe];
  //   setRecipes(newList);
  //   localStorage.setItem("recipes", JSON.stringify(newList));
  // }

  const [recipes, setRecipes] = useState(() => {
    const items = localStorage.getItem("recipes");

    if (items === null) return [];

    return JSON.parse(items);
  });

  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  function addRecipe(newRecipe) {
    const newList = [...recipes, newRecipe];
    setRecipes(newList);
  }

  function deleteRecipe(id) {
    setRecipes((currentRecipes) => {
      return currentRecipes.filter((recipe) => recipe.id !== id);
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
            <RecipeList recipes={recipes} onDelete={deleteRecipe}></RecipeList>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
