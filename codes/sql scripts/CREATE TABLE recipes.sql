CREATE TABLE recipes(
	[recipe_id] [UNIQUEIDENTIFIER] NOT NULL default NEWID(),
	[author] [varchar](30) NOT NULL,
	[recipe_name] [varchar](300) NOT NULL,
	[durationTime][integer] NOT NULL ,
	[image][varchar](300) NOT NULL ,
	[likes][integer] NOT NULL ,
	[vegetarian][bit] NOT NULL ,
	[gluten][bit] NOT NULL ,
	[vegan][bit] NOT NULL ,
	PRIMARY KEY (author, recipe_name),
	FOREIGN KEY (author) REFERENCES users(username)
)
