CREATE TABLE recipes(
	[recipe_id] [int] IDENTITY(1,1) NOT NULL,
	[author] [varchar](30) NOT NULL,
	[recipe_name] [varchar](300) NOT NULL,
	[durationTime][integer] NOT NULL ,
	[image][varchar](300) NOT NULL ,
	[likes][integer] NOT NULL ,
	[vegetarian][bit] NOT NULL ,
	[gluten][bit] NOT NULL ,
	[vegan][bit] NOT NULL ,
	PRIMARY KEY (recipe_id),
	FOREIGN KEY (author) REFERENCES users(username)
)
