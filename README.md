# Bender Bot

Discord Bot used as a template to learn NodeJs

## How to install

- git clone https://github.com/SteakBarbare/Bender-Bot

> When it is done, create a config file in the base directory with these fields inside:
>
> > ```
> > {
> >   "token": "Your Bot Token Here",
> >   "clientId": "Your Bot Application ID Here",
> >   "guildId": "The Guild Id, you can get it by right clicking the guild icon while being in developer mode"
> > }
> > ```

- npm i to install dependencies
- node deployCommands.js to register your commands in the guild
- node index.js to launch the Bot

## How to add stuff

- Commands folder -> Create new commands inside subfolders, each must have a data & execute
- Events folder -> You can add new events here, no need for subfolders
