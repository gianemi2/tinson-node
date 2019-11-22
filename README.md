# Tinson 🤖

**Install your NSP directly on Switch with Tinfoil without using your PC.**

**Tinson** creates for you a JSON file for [Tinfoil](http://tinfoil.io), the NSP installer for Nintendo Switch. 
You can insert as many NSP (hosted on Google Drive) as you want and install them directly on Switch, you can also add directly an entire folder.

This is a better and revisioned version of [Tinson](https://github.com/gianemi2/tinson). This version doesn't require a server with PHP but can be hosted on Heroku (or Glitch) completely free.

## Features
1. Manage a list of NSPs from everywhere and from every devices.
2. You don't have to clone the NSP on your drive. Just copy here the public link.
3. Add an entire folder of NSP. Tinfoil will display them correctly. 
4. **Install NSP without cable and without rely on 3rd services**

## Getting Started

I've already built a Tinson instance on Heroku. If you want you can directly use my demo version or you can just clone my project and install it on your Heroku account.

**That's my demo version: [Tinson 🤖](http://tinson.herokuapp.com)**

### How to use it

Well it's pretty easy. There're three steps in total to follow. 

1. **Register/Login** *(The registration is absolutely anonymous. I do not ask for any personal data excluding a random username and a random password. Those are required for edit your list again.)*
2. **Add some Google Drive links to your dashboard.** If you prefer you can also add directly a Google drive folder link just remember to click on the toggle.
3. Copy the link in your dashboard (should be something like `tinson.herokuapp.com/v1/:random_string`) and insert it in Tinfoil's file browser. 

Tinfoil will auto upload the file if you'll insert new games in the list. So the 3rd step is required just for the first time.

## Donations

Please, if you're using and enjoing Tinson considering to leave a little donation for maintain Heroku server up.

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/L3L318MYF)

Thanks a lot ❤️

### Prerequisites

The only prerequisites are:
* A Nintendo Switch with Homebrew access
* Tinfoil installed

## Create your own Tinson 🤖

If you don't want to use directly my version you can setup your own version.

*I'm not expert on this things so I'm not good on making a guide on how to replicate it in every server. What I'll do is try to explain the required steps for set it up. If after that you're still facing problems report it in **issues tab** and try to look out on Google.*

### Required Steps

* Clone the repository
* Run `$ npm install` in root folder and in client folder
* Create a mongoDB and insert its URI in .env
* *Optional:* Insert a Google API key with Google Drive permissions on .env too (this is just for display size for every file in your list directly on Tinfoil.)

### Setup it on Heroku

* Create an Heroku account
* Clone my project and create an Heroku application with it.
* Install the add-on `mLab MongoDB`.
* *Optional:* Insert a GOOGLE_API key with Google Drive permissions on .env too (this is just for display size for every file in your list directly on Tinfoil.)

If you don't know how to do this I recommend the Heroku documentation which is pretty clear and easy to follow.