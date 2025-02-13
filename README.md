# Bender Bot

Discord Bot used as a template to learn NodeJs

## How to install

- git clone https://github.com/jsac2001/Bot-Discord-H2

> When it is done, create a config file in the base directory with these fields inside:
>
>  ```
>  {
>    "token": "Your Bot Token Here",
>    "clientId": "Your Bot Application ID Here",
>    "guildId": "The Guild Id, you can get it by right clicking the guild icon while being in developer mode",
>    "newsApiKey": "Get a key from https://newsapi.org/"
>    "meteoApiKey": "Get a key from meteo-concept.com"
>  }
>  ```

- npm i to install dependencies
- node deployCommands.js to register your commands in the guild
- node index.js to launch the Bot

## How to install The Chrome extension

- download the chrome_extension folder
- enable developper mode in the chrome or chromium extension window
- add the unpacked folder
