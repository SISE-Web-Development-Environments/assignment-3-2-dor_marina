CREATE TABLE PersonalRecipes(
	[recipe_id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[recipe_name] [varchar](300) NOT NULL,
	[durationTime][integer] NOT NULL ,
	[image][varchar](300) NOT NULL ,
	[likes][integer] NOT NULL ,
	[vegetarian][bit] NOT NULL ,
	[vegan][bit] NOT NULL ,
	[gluten][bit] NOT NULL ,
	[ingredients][varchar] (5000)NOT NULL,
	[instructions][varchar] (5000)NOT NULL,
	[portions][int] NOT NULL,
	PRIMARY KEY (recipe_id),
	FOREIGN KEY ([user_id]) REFERENCES users([user_id])
)
