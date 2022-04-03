# Typeahead component

<div>
  <img width="500" height="600" alt="Screenshot 2022-04-03 at 1 45 48 PM" src="https://user-images.githubusercontent.com/60533560/161418709-e90fb6a0-ff98-499a-97c9-39ff707e0b71.png">
<img width="500" height="600" alt="Screenshot 2022-04-03 at 1 45 55 PM" src="https://user-images.githubusercontent.com/60533560/161418715-9d112cdc-fb70-4292-b1f1-4e289778b789.png">
</div>



Typeahead component which gives suggestions as user types. In this project movie list is given as suggestion to user.

## Setup

First clone the project in local.

```js
npm install
```

Then run the above command in terminal.

To run this project in local,this project requires developer level api keys from moviedb api. For that you have to sign up for [themoviedb.org](https://www.themoviedb.org/) and get API keys as mentioned here [API_Keys](https://www.themoviedb.org/settings/api).

After that create a .env file in the root of cloned project.

```js
REACT_APP_MOVIE_DB_SECRET=<YOUR_API_KEY>
```

save your api keys in your .env file as mentioned above.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Features

- Debouncing
- Online / Offline status
- LRU Cache implementation
