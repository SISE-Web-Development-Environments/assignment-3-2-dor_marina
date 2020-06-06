CREATE TABLE FamilyRecipes(
    [user_id] [int] NOT NULL,
	[recipe_id] [int] NOT NULL,
	PRIMARY KEY ([user_id],[recipe_id]),
	FOREIGN KEY ([user_id]) REFERENCES users([user_id]),
    FOREIGN KEY ([recipe_id]) REFERENCES recipes([recipe_id])
)
