var express = require("express");
var router = express.Router();
const axios = require("axios");
const DButils = require("../../modules/DButils");

const api_domain = "https://api.spoonacular.com/recipes";
const apiKey="fac92578114e4448951e41d45f36a575";

router.post("/addToFavorites", async (req, res, next) => {
  try{
    if(req.user_id){
      const users = await DButils.execQuery("SELECT user_id FROM users");
      if (!users.find((x) => x.user_id === req.user_id)){
        throw { status: 401, message: "Unauthorized user" };
      }
      try{
        await getRecipeInfo(req.body.recipe_id);
        } catch(error){
          if(error.response.status==404){
            throw { status: 404, message: "recipe not found" };
          }
        }
        let dupCheck = (await DButils.execQuery(`SELECT * FROM FavoritesRecipes WHERE recipe_id = '${req.body.recipe_id}' AND user_id='${req.user_id}'`))
        if(dupCheck.length!=0){
          res.status(401).send("this recipe is already a favourite");
        }
        else{
          DButils.execQuery(`INSERT INTO FavoritesRecipes VALUES (${req.user_id},${req.body.recipe_id})`);
          res.status(200).send({ message: "Recipe added to favorites successfully", success: true });
        }
    }
    else{
      throw { status: 401, message: "Guests cannot add recipes to favourites" };
    }
  } catch (error) {
    next(error);
  }
});


router.get("/Information/:recipeID", async (req, res, next) => {
  try {
    const recipe_id=req.params.recipeID;
    let recipe;
    try{
    recipe = await getRecipeInfo(recipe_id);
    } catch(error){
      if(error.response.status==404){
        throw { status: 404, message: "recipe not found" };
      }
      throw(error);
    }
    const info_recipe=await getPreveuInfo(recipe.data,req);
    info_recipe.ingredients=recipe.data.extendedIngredients;
    info_recipe.instructions=recipe.data.instructions;
    info_recipe.servings=recipe.data.servings;
    res.status(200).send({ data: info_recipe });
    if(req.user_id){
      let dupCheck = (await DButils.execQuery(`SELECT * FROM recipesWatched WHERE recipe_Watched = '${info_recipe.id}' AND user_id='${req.user_id}'`));
      if(dupCheck.length===0){
        DButils.execQuery(`INSERT INTO recipesWatched VALUES (${req.user_id},${info_recipe.id},DEFAULT)`);
      }
    }
  } catch (error) {
    next(error);
  }
});
router.get('/3Random', async(req, res,next) => {
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
    const info_recipes =await Promise.all(recipes.map((recipe) => {
        return getPreveuInfo(recipe,req);
      }));
      res.status(200).send({info_recipes});

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
router.get("/search/query/:searchQuery",async(req, res, next)=>{
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
    if(search_response.data.results.length==0){
      throw { status: 404, message: "No recipes found" };
    }
    let recipes = await Promise.all(
      search_response.data.results.map((recipe_raw) =>
        getRecipeInfo(recipe_raw.id)
      )
    );
    recipes = recipes.map((recipe) => recipe.data);
    const info_recipes = await Promise.all(recipes.map((recipe) => {
      return getPreveuInfo(recipe,req);
    }));
    res.status(200).send({info_recipes});
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
router.get('/recipeByID', async (req, res, next) => {
  try{
    let recipe = (await DButils.execQuery(`SELECT * FROM PersonalRecipes WHERE recipe_id = '${req.body.recipe_id}'`))
    if(recipe.length===0){
      res.status(401).send("no recipe found");
    }
    else{
      res.status(200).send(recipe);
    }
  }
  catch(error){
    next(error)
  }
});


function getRecipeInfo(id) {
  return axios.get(`${api_domain}/${id}/information`, {
    params: {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey
    }
  });
}

async function getPreveuInfo(recipe, req) {
  const preveu= {
    id: recipe.id,
    image: recipe.image,
    title: recipe.title,
    vegetarian: recipe.vegetarian,
    vegan: recipe.vegan,
    glutenFree: recipe.glutenFree,
    like: recipe.aggregateLikes,
    readyInMinutes: recipe.readyInMinutes,
  };
  if(req.user_id){
    let watched = await isWatched(recipe,req)
    let favorite = await isFavorite(recipe,req)
    preveu.watched=watched;
    preveu.favorite=favorite;
  }
  return preveu;
}
async function isWatched(recipe,req){
  let isWatched = await DButils.execQuery(`SELECT * FROM recipesWatched WHERE recipe_Watched = ${recipe.id} AND user_id=${req.user_id}`);
  if(isWatched.length==0){
    return false;
  }
  else{
    return true;
  }
}

async function isFavorite(recipe,req){
  let isFavorite=await DButils.execQuery(`SELECT * FROM FavoritesRecipes WHERE recipe_id = ${recipe.id} AND user_id=${req.user_id}`);
  if(isFavorite.length==0){
    return false;
  }
  else{
    return true;
  }
}



module.exports = router;
