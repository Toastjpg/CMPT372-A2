import RecipeListItem from "./RecipeListItem";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

function RecipeList({ recipes, onDelete, onEdit }) {
  function getContent() {
    if (recipes.length === 0) {
      return (
        <h2 className="text-muted text-center mt-4">No Recipes Available</h2>
      );
    }

    return (
      <Row xs={3} className="g-3">
        {recipes.map((obj) => (
          <Col key={obj.recipe_id}>
            <RecipeListItem recipe={obj} onDelete={onDelete} onEdit={onEdit} />
          </Col>
        ))}
      </Row>
    );
  }

  return getContent();
}

export default RecipeList;
