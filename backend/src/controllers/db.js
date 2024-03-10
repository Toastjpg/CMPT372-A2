const { Pool } = require('pg')

let pool = new Pool({
  // connectionString: 'postgres://postgres:root@localhost:5432/recipe-app'
  user: 'postgres',
  host: 'postgres',
  password: 'root',
  database: 'recipe-app'
})

async function init() {
  const q = `
    CREATE TABLE if NOT EXISTS recipes (
      recipe_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      recipe_name VARCHAR(255) NOT NULL,
      directions TEXT,
      last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE if NOT EXISTS ingredients (
      ingredient_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      ingredient_name VARCHAR(255) NOT NULL
    );

    CREATE TABLE if NOT EXISTS recipe_to_ingredient (
      recipe_id UUID REFERENCES recipes(recipe_id) ON DELETE CASCADE,
      ingredient_id UUID REFERENCES ingredients(ingredient_id) ON DELETE CASCADE,
      PRIMARY KEY (recipe_id, ingredient_id)
    );
  `
  await pool.query(q)
}

async function getRecipes() {
  try {
    const q = 'SELECT * FROM recipes'
    const res = await pool.query(q)
    return res.rows
  }
  catch (e) {
    throw e
  }
}

async function getIngredients(recipe_id) {
  try {
    const getIngredientQuery = `
      SELECT * FROM ingredients
      WHERE ingredient_id IN
      (SELECT ingredient_id FROM recipe_to_ingredient WHERE recipe_id = $1)
    `
    const res = await pool.query(getIngredientQuery, [recipe_id])
    return res.rows
  }
  catch (e) {
    throw e
  }
}

// TODO: Potentially edit this to not add duplicate ingredients
async function addRecipe(recipe_name, directions, ingredients) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const insertRecipeQuery = 'INSERT INTO recipes (recipe_name, directions) VALUES ($1, $2) RETURNING recipe_id'
    const recipeResult = await client.query(insertRecipeQuery, [recipe_name, directions])
    const recipe_id = recipeResult.rows[0].recipe_id

    // TODO this inserts all the ingredients for each recipe -> regardless if they alr exist in table
    for (const ingredient_name of ingredients) {
      const insertIngredientsQuery = 'INSERT INTO ingredients (ingredient_name) VALUES ($1) RETURNING ingredient_id'
      let ingredientResult = await client.query(insertIngredientsQuery, [ingredient_name])
      let ingredient_id = ingredientResult.rows[0].ingredient_id

      const insertMappingsTable = 'INSERT INTO recipe_to_ingredient (recipe_id, ingredient_id) VALUES ($1, $2)'
      await client.query(insertMappingsTable, [recipe_id, ingredient_id])
    }

    await client.query('COMMIT')
    return recipe_id
  }
  catch (e) {
    await client.query('ROLLBACK')
    throw e
  }
  finally {
    client.release()
  }
}

async function editRecipe(recipe_id, recipe_name, directions, ingredients) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const updateRecipeQuery = `
      UPDATE recipes SET recipe_name = $1, directions = $2, last_modified = CURRENT_TIMESTAMP
      WHERE recipe_id = $3
      RETURNING *
    `
    const updateResult = await client.query(updateRecipeQuery, [recipe_name, directions, recipe_id])

    if (updateResult.rows.length === 0) {
      throw new Error('Recipe not found')
    }

    const deleteOldIngredients = `
      DELETE FROM ingredients
      WHERE ingredient_id IN (SELECT ingredient_id FROM recipe_to_ingredient WHERE recipe_id = $1)
    `
    await client.query(deleteOldIngredients, [recipe_id]);

    // Add updated ingredients
    for (const ingredient_name of ingredients) {
      const insertIngredientsQuery = 'INSERT INTO ingredients (ingredient_name) VALUES ($1) RETURNING ingredient_id'
      let ingredientResult = await client.query(insertIngredientsQuery, [ingredient_name])
      let ingredient_id = ingredientResult.rows[0].ingredient_id

      const insertMappingsTable = 'INSERT INTO recipe_to_ingredient (recipe_id, ingredient_id) VALUES ($1, $2)'
      await client.query(insertMappingsTable, [recipe_id, ingredient_id])
    }

    await client.query('COMMIT')
    return recipe_id
  }
  catch (e) {
    await client.query('ROLLBACK')
    throw e
  }
  finally {
    client.release()
  }
}

async function deleteRecipe(recipe_id) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Delete recipe -> will cascade to mappings table
    const deleteRecipeQuery = 'DELETE FROM recipes WHERE recipe_id = $1'
    await client.query(deleteRecipeQuery, [recipe_id])

    // Delete ingredients that are not in mapping table -> not referenced in any existing recipe
    const deleteIngredientQuery = `
      DELETE FROM ingredients
      WHERE ingredient_id NOT IN (SELECT ingredient_id FROM recipe_to_ingredient)
    `
    await client.query(deleteIngredientQuery);

    await client.query('COMMIT')
  }
  catch (e) {
    await client.query('ROLLBACK')
    throw e
  }
  finally {
    client.release()
  }
}

module.exports = {
  init,
  getRecipes,
  getIngredients,
  addRecipe,
  editRecipe,
  deleteRecipe
}