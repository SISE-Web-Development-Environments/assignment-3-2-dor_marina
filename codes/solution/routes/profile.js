var express = require("express");
var router = express.Router();
const DButils = require("../../modules/DButils");

// router.use(function requireLogin(req, res, next) {
//   if (!req.username) {
//     next({ status: 401, message: "unauthorized" });
//   } else {
//     next();
//   }
// });

//#region global simple
// router.use((req, res, next) => {
//   const { cookie } = req.body;

//   if (cookie && cookie.valid) {
//     DButils.execQuery("SELECT username FROM users")
//       .then((users) => {
//         if (users.find((e) => e.username === cookie.username))
//           req.username = cookie.username;
//         next();
//       })
//       .catch((err) => next(err));
//   } else {
//     next();
//   }
// });
//#endregion

router.get("/favorites", function (req, res) {
  res.send(req.originalUrl);
});

router.get("/personalRecipes", function (req, res) {
  res.send(req.originalUrl);
});

// router.post('/insertWatch', async (req, res,next) => {
//   try{
//   const users = await DButils.execQuery("SELECT username FROM recipesWatched");
//   const recipes = await DButils.execQuery("")
//   await DButils.execQuery(
//     `INSERT INTO recipesWatched VALUES ('${req.body.username}','${req.body.recipe_id}')`
//   );
//   }
//   catch(error){
//     next(error);
//   }
// });

router.get('/last3watched', async (req, res, next) => {
  const watched = ( await DButils.execQuery( `SELECT TOP 3 * FROM recipesWatched WHERE username = '${req.body.username}' ORDER BY watched_at desc`)) 
  let recipes=[];
  let i=0;
  while(i<3){
    recipes[i] = ( await DButils.execQuery( `SELECT * FROM recipes WHERE recipe_id = '${watched[i].recipe_Watched}'`));
    i++; 
  }
  res.send(recipes);
})



//#region example2 - make add Recipe endpoint

//#region complex
// router.use("/addPersonalRecipe", function (req, res, next) {
//   if (req.session && req.session.user_id) {
//     // or findOne Stored Procedure
//     DButils.execQuery("SELECT user_id FROM users").then((users) => {
//       if (users.find((x) => x.user_id === req.session.user_id)) {
//         req.user_id = user_id;
//         // req.session.user_id = user_id; //refresh the session value
//         // res.locals.user_id = user_id;
//         next();
//       } else throw { status: 401, message: "unauthorized" };
//     });
//   } else {
//     throw { status: 401, message: "unauthorized" };
//   }
// });
//#endregion

//#region simple
// router.use("/addPersonalRecipe", (req, res, next) => {
//   const { cookie } = req.body; // but the request was GET so how come we have req.body???
//   if (cookie && cookie.valid) {
//     req.username = cookie.username;
//     next();
//   } else throw { status: 401, message: "unauthorized" };
// });
//#endregion

router.post("/addPersonalRecipe", async (req, res, next) => {
  try {
    await DButils.execQuery(
      `INSERT INTO recipes VALUES (default, '${req.user_id}', '${req.body.recipe_name}')`
    );
    res.send({ sucess: true, cookie_valid: req.username && 1 });
  } catch (error) {
    next(error);
  }
});
//#endregion

module.exports = router;
