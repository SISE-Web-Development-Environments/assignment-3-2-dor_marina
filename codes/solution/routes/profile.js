var express = require("express");
var router = express.Router();
const DButils = require("../../modules/DButils");

router.use(function requireLogin(req, res, next) {
  if (!req.session.user_id) {
    next({ status: 401, message: "unauthorized" });
  } else {
    next();
  }
});

router.get('/last3watched', async (req, res, next) => {
  try{
  const watched = ( await DButils.execQuery( `SELECT TOP 3 * FROM recipesWatched WHERE user_id = '${req.session.user_id}' ORDER BY watched_at desc`)) 
  if(watched.length ===0){
    res.status(401).send("there is no recipes watched by this user");
  }
  let recipes=[];
  let i=0;
  while(i<watched.length){
    recipes[i] = ( await DButils.execQuery( `SELECT * FROM recipes WHERE recipe_id = '${watched[i].recipe_Watched}'`));
    i++; 
  }
  res.status(200).send(recipes);
  }
  catch(error){
    next(error)
  }
});

router.get('/familyRecipesWhole', async (req, res, next) => {
  try{
    const family = ( await DButils.execQuery( `SELECT * FROM FamilyRecipes WHERE user_id = '${req.session.user_id}'`)) 
    if(family.length ===0){
      res.status(401).send("there is no family recipes for this user");
    }
    else{
      res.status(200).send(family);
    }
  }
  catch(error){
    next(error)
  }
});

router.get('/familyRecipesPreview', async (req, res, next) => {
  try{
    const family = ( await DButils.execQuery( `SELECT image,recipe_name,durationTime,vegetarian,vegan,gluten
    FROM FamilyRecipes WHERE user_id = '${req.session.user_id}'`)) 
    if(family.length ===0){
      res.status(401).send("there is no family recipes for this user");
    }
    else{
      res.status(200).send(family);
    }
  }
  catch(error){
    next(error)
  }
});

router.get('/personalRecipesWhole', async (req, res, next) => {
  try{
    const personal = ( await DButils.execQuery( `SELECT * FROM PersonalRecipes WHERE user_id = '${req.session.user_id}'`)) 
    if(personal.length ===0){
      res.status(401).send("there is no personal recipes for this user");
    }
    else{
      res.status(200).send(personal);
    }
  }
  catch(error){
    next(error)
  }
});

router.get('/personalRecipesPreview', async (req, res, next) => {
  try{
    const personal = ( await DButils.execQuery( `SELECT image,recipe_name,durationTime,vegetarian,vegan,gluten
     FROM PersonalRecipes WHERE user_id = '${req.session.user_id}'`)) 
    if(personal.length ===0){
      res.status(401).send("there is no personal recipes for this user");
    }
    else{
      res.status(200).send(personal);
    }
  }
  catch(error){
    next(error)
  }
});

//#endregion

module.exports = router;
