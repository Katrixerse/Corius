Attention: I will do my best to help out if your having issues hosting but I will no longer be doing any big updates like adding new features because im working on 2 new bots.

# Orcinus
Written in discord.js of course 

If you find any bugs please make a issue so i can look into it and fix it

Made By:
- SyntheticGenerations (me)

Co-Owner:
EthericDestruction#9748

Special Thanks too:
- dragonfire535 - Some api commands & canvas commands

 will use mySql instead of sqlite to store data (Better this way for reading/writing data)

--------------------------------------------------------

Hosting

First, download all the files and put them in a folder.

Need to create a new app at https://discordapp.com/developers/applications/me/create and then need to fill out the bots name and select its avatar then create it. Once done that find where is says Bot and click create a bot user and hit yes, do it

Now you want to go back to bot go to token and click token: click to reveal this will show you the bot token now edit config.json in assets where it says, "token": "Your token" with your bot token once done click save.

Now you have done that you will need NodeJs installed can get it from https://nodejs.org/en/ so you can start running the bot.

Now right click the folder in an empty space where you put the files in then click open command prompt.

Need to install each of these packages with npm install [packagename] without the brackets and replace package name with the ones below.

Packages Needed

- discord.js
- ms
- superagent
- snekfetch
- request
- request-promise-native
- urban
- chrono-node
- moment
- windows-build-tools
- node-gyp
- canvas
- canvas-constructor
- fs-nextra
- cheerio
- got
- mysql
- mathjs

Follow this guide to setup mysql: https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-18-04

(make sure to edit DbConnection to your database info)

When done downloading the dependencies and setting up mysql, run node Main.js, to start the bot.

If there is a problem or an error please make an issue.

If you want to run this bot while not having the console or terminal open, use nodemon or pm2 (ex. pm2 start Main.js)
