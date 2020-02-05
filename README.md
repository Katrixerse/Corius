Attention: I will do my best to help out if your having issues hosting, this is my latest bot thats meant to be better than oricnus and justin i will still do updates to this bot at times but been through alot of testing and should be pretty stable as is.

# Corius
Written in discord.js of course 

If you find any bugs please make a issue so i can look into it and fix it

Made By:
- Katrixerse (me)
- Levi Kaichou

Special Thanks too:
- dragonfire535 - Some api commands & canvas commands
- reztierk - Help with mysql statements and some coding 

 will use mySql instead of sqlite to store data (Better this way for reading/writing data)

--------------------------------------------------------

Hosting

First, download all the files and put them in a folder.

Need to create a new app at https://discordapp.com/developers/applications/me/create and then need to fill out the bots name and select its avatar then create it. Once done that find where is says Bot and click create a bot user and hit yes, do it

Now you want to go back to bot go to token and click token: click to reveal this will show you the bot token now edit config.json in assets where it says, "token": "Your token" with your bot token once done click save.

Now you have done that you will need NodeJs installed can get it from https://nodejs.org/en/ so you can start running the bot.

Now right click the folder in an empty space where you put the files in then click open command prompt.

Need to install all the packages it depends on with npm install.

Follow this guide to setup mysql: https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-18-04

(make sure to edit DbConnection to your database info)

When done downloading the dependencies and setting up mysql, run node Main.js, to start the bot.

If there is a problem or an error please make an issue.

If you want to run this bot while not having the console or terminal open, use nodemon or pm2 (ex. pm2 start Main.js)
