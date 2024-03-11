const express = require('express')
let app = express()

const db = require('./src/controllers/db')
const cors = require('cors')
const path = require('path')

const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/', express.static(path.join(__dirname, '/static')))

app.get('/recipes/all', async (req, res) => {
  try {
    const recipes = await db.getRecipes()
    res.status(200).json(recipes)
  }
  catch (error) {
    console.error('Error on GET /recipes/all :', error.message)
    res.status(404).json({ error: 'Recipes not found: the table doesnt exist lol' })
  }
})

app.get('/ingredients/:recipe_id', async (req, res) => {
  const recipe_id = req.params.recipe_id

  try {
    const ingredients = await db.getIngredients(recipe_id)
    res.status(200).json(ingredients)
  }
  catch (error) {
    console.error('Error on GET /ingredients/:recipe_id :', error.message)
    res.status(404).json({ error: 'Invalid recipe_id' })
  }
})

app.post('/recipes', async (req, res) => {
  const { recipe_name, directions, ingredients } = req.body

  try {
    const result = await db.addRecipe(recipe_name, directions, ingredients)
    res.status(201).json(result)
  }
  catch (error) {
    console.error('Error on POST /recipes : ', error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.put('/recipes/:recipe_id', async (req, res) => {
  const recipe_id = req.params.recipe_id
  const { recipe_name, directions, ingredients } = req.body

  try {
    const result = await db.editRecipe(recipe_id, recipe_name, directions, ingredients)
    res.status(200).json(result)
  }
  catch (error) {
    console.error('Error on PUT /recipes/:recipe_id : ', error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }

})

app.delete('/recipes/:recipe_id', async (req, res) => {
  const recipe_id = req.params.recipe_id

  try {
    await db.deleteRecipe(recipe_id)
    res.status(200).json({ message: 'Recipe deleted successfully' })
  }
  catch (error) {
    console.error('Error on DELETE /recipes/:recipe_id : ', error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

async function initDb() {
  await db.init()
}

// This starts up the server
initDb().then(() => {
  app.listen(port, '0.0.0.0')
  console.log(`Server is running on http://localhost:${port}`)
})
