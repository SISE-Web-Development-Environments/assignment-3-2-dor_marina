CREATE TABLE recipesWatched(
    username [varchar](30) NOT NULL,
    recipe_Watched [UNIQUEIDENTIFIER] NOT NULL,
    watched_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY (username,recipe_Watched),
    FOREIGN KEY (username) REFERENCES users(username)
)