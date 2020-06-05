CREATE TABLE users(
	[user_id] [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL default NEWID(),
	[username] [varchar](30) NOT NULL UNIQUE,
	[password] [varchar](300) NOT NULL,
    [FirstName][varchar](200) NOT NULL,
    [LastName][varchar](200) NOT NULL,
    [Email][varchar](200) NOT NULL,
    [Country][varchar](200) NOT NULL,
    [Image][varchar](200) NOT NULL
)

