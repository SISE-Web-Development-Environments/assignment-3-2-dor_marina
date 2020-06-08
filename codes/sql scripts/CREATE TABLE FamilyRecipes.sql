CREATE TABLE FamilyRecipes(
    [recipe_id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[author] [varchar](30) NOT NULL,
	[recipe_name] [varchar](300) NOT NULL,
	[durationTime][integer] NOT NULL ,
	[image][varchar](300) NOT NULL ,
	[vegetarian][bit] NOT NULL,
	[vegan][bit] NOT NULL ,
	[gluten][bit] NOT NULL ,
	[ingredients][varchar] (5000)NOT NULL,
	[instructions][varchar] (5000)NOT NULL,
	[portions][int] NOT NULL,
	[usually_prepared][varchar](300) NOT NULL,
	[main_country][varchar](30) NOT NULL,
	PRIMARY KEY (recipe_id),
	FOREIGN KEY ([user_id]) REFERENCES users([user_id])
)
