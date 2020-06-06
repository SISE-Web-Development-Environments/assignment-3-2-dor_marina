var express = require("express");
var router = express.Router();
const axios = require("axios");

const api_domain = "https://api.spoonacular.com/recipes";
const apiKey="fac92578114e4448951e41d45f36a575";

router.get("/", (req, res) => res.send("im here"));

router.get("/Information/:recipeID", async (req, res, next) => {
  try {
    const recipe_id=req.params.recipeID;
    const recipe = await getRecipeInfo(recipe_id);
    const info_recipe=getPreveuInfo(recipe.data);
    info_recipe.ingredients=recipe.data.extendedIngredients;
    info_recipe.instructions=recipe.data.instructions;
    info_recipe.servings=recipe.data.servings;
    res.send({ data: info_recipe });
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
router.get("/search/:searchQuery",async(req, res, next)=>{
  try{
    const Query=req.params.searchQuery;
    let parameters={};
    parameters.query=Query;
    parameters.instructionsRequired=true;
    parameters.apiKey=process.env.spooncular_apiKey;
    if(req.query["cuisine"]){
      parameters.cuisine=req.query["cuisine"];
    }
    if(req.query["diet"]){
      parameters.cuisine=req.query["diet"];
    }
    if(req.query["intolerances"]){
      parameters.cuisine=req.query["intolerances"];
    }
    if(req.query["numOfRecipes"]){
      parameters.number=req.query["numOfRecipes"];
    }
    else{
      parameters.number=5;
    }
    const search_response = await axios.get(`${api_domain}/search`, {
      params: parameters
    });
    let recipes = await Promise.all(
      search_response.data.results.map((recipe_raw) =>
        getRecipeInfo(recipe_raw.id)
      )
    );
    recipes = recipes.map((recipe) => recipe.data);
    const info_recipes = recipes.map((recipe) => {
      return getPreveuInfo(recipe);
    });
    res.send({info_recipes});
  }
  catch(error){
    next(error);
  }
});

//#region example1 - make serach endpoint
// router.get("/search", async (req, res, next) => {
//   try {
//     const { query, cuisine, diet, intolerances, number } = req.query;
//     const search_response = await axios.get(`${api_domain}/search`, {
//       params: {
//         query: query,
//         cuisine: cuisine,
//         diet: diet,
//         intolerances: intolerances,
//         number: number,
//         instructionsRequired: true,
//         apiKey: process.env.spooncular_apiKey
//       }
//     });
//     let recipes = await Promise.all(
//       search_response.data.results.map((recipe_raw) =>
//         getRecipeInfo(recipe_raw.id)
//       )
//     );
//     recipes = recipes.map((recipe) => recipe.data);
//     res.send({ data: recipes });  } catch (error) {
//     next(error);
//   }
// });


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

  function didUserWatchedThisRecipe(id){
    
  }
}



module.exports = router;
