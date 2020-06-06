CREATE TABLE recipesWatched(
    user_id [int] NOT NULL,
    recipe_Watched [int] ,
    is_external [bit] NOT NULL,
    watched_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY (user_id,recipe_Watched),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
)