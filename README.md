# Bob's Burgers API

Use this Bob's Burgers API to get information about your favorite characters and their best quotes.

[Link to API documentation](https://kangjoa.github.io/api-project-docs/#/)

## Getting Started

1. Clone the repository with:
```zsh
git clone https://github.com/kangjoa/api-project.git
```

2. Install dependencies:
```zsh
npm install
```

3. Run the server in development mode:
```zsh
nodemon server
```

## Authentication and Authorization
Users must sign up and log in with a valid username and password in order to use the API.
| Method | Endpoint | Purpose |
| -------- | -------- | -------- |
| POST | `/sign-up` | Create an account |
| POST | `/login` | Get access to API with valid credentials |



## Characters
| Method | Endpoint | Purpose |
| -------- | -------- | -------- |
| GET | `/characters` | Show all characters |
| GET | `/characters/:characterId` | Show one character by ID |
| POST | `/characters` | Create a character |
| PUT | `/characters/:characterId` | Update a character |
| DELETE | `/characters/:characterId` | Delete a character |


## Quotes

| Method | Endpoint | Purpose |
| -------- | -------- | -------- |
| GET | `/quotes` | Show all quotes |
| GET | `/quotes/:quoteId` | Show one quote by ID |
| POST | `/quotes` | Create a quote |
| PUT | `/quotes/:quoteId` | Update a quote |
| DELETE | `/quotes/:quoteId` | Delete a quote |

