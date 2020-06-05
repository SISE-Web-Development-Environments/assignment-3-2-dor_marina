var express = require("express");
var router = express.Router();
const axios = require("axios");

const api_domain = "https://api.spoonacular.com/recipes";

router.get("/", (req, res) => res.send("im here"));

router.get("/Information", async (req, res, next) => {
  try {
    const recipe = await getRecipeInfo(req.query.recipe_id);
    res.send({ data: recipe.data });
  } catch (error) {
    next(error);
  }
});

router.get('/get3Random', async(req, res,next) => {
  try {
    const random_response = await axios.get(`${api_domain}/random`, {
      params: {
        number : 3,
        apiKey: process.env.spooncular_apiKey,
      }
    });
    let recipes = random_response.data.recipes;
    recipes.map(async(recipe) => {
      while (recipe.instructions === undefined) {
        recipe = await axios.get(`${api_domain}/random`,  {
          params: {
            number: 1,
            apiKey: process.env.spooncular_apiKey,
          },
        });
        recipe = recipe.data.recipes[0];
      }
    });
    const info_recipes = recipes.map((recipe) => {
        return getPreveuInfo(recipe);
      });
    res.send({info_recipes});

  } catch (error) {
    next(error);
  }
});

router.get('/get3RandomVer2', async(req, res,next) => {
  try {
    const random_response = await axios.get(`${api_domain}/random`, {
      params: {
        number : 3,
        apiKey: process.env.spooncular_apiKey,
      }
    });
    let recipes = await Promise.all(
      random_response.data.recipes.map((recipe_raw) =>
        getRecipeInfo(recipe_raw.id)
      )
    );
    recipes = recipes.map((recipe) => recipe.data);
    res.send({ data: recipes });

  } catch (error) {
    next(error);
  }
});

//#region example1 - make serach endpoint
router.get("/search", async (req, res, next) => {
  try {
    const { query, cuisine, diet, intolerances, number } = req.query;
    const search_response = await axios.get(`${api_domain}/search`, {
      params: {
        query: query,
        cuisine: cuisine,
        diet: diet,
        intolerances: intolerances,
        number: number,
        instructionsRequired: true,
        apiKey: process.env.spooncular_apiKey
      }
    });
    let recipes = await Promise.all(
      search_response.data.results.map((recipe_raw) =>
        getRecipeInfo(recipe_raw.id)
      )
    );
    recipes = recipes.map((recipe) => recipe.data);
    res.send({ data: recipes });
  } catch (error) {
    next(error);
  }
});
//#endregion

function getRecipeInfo(id) {
  return axios.get(`${api_domain}/${id}/information`, {
    params: {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey
    }
  });
}
function getPreveuInfo(recipe) {
  return {
    id: recipe.id,
    image: recipe.image,
    title: recipe.title,
    vegetarian: recipe.vegetarian,
    vegan: recipe.vegan,
    glutenFree: recipe.glutenFree,
    like: recipe.aggregateLikes,
    readyInMinutes: recipe.readyInMinutes,
  };
}



module.exports = router;
