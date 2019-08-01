# Tinson 🤖

**Install your NSP directly on Switch with Tinfoil without using your PC.**

**Tinson** creates for you a JSON file for [Tinfoil](http://tinfoil.io), the NSP installer for Nintendo Switch. 
You can insert as many NSP (hosted on Google Drive) as you want and install them directly on Switch.

This is a better and revisioned version of [Tinson](https://github.com/gianemi2/tinson). This version doesn't require a server with PHP but can be hosted on Heroku (or Glitch) completely free.

## Getting Started

I've already build a Tinson instance on Heroku. If you want you can directly use my demo version or you can just clone my project and install it in your Heroku account.

**That's my demo version: [Tinson 🤖](http://tinson.herokuapp.com)**

### How to use it

Well it's pretty easy. There're three steps in total to follow. 

1. Register/Login (the registration is just for search your NSPs list later. Tinson creates a record in MongoDB with a unique value which is name + password in base64).
2. Add some Google Drive links to your dashboard. 
3. Copy the link in your dashboard (should be something like `tinson.herokuapp.com/v1/:yourname/:yourpassword`) and insert it in Tinfoil's file browser. 

Now you can also add Google drive folders to Tinson. Process is the same as single links. **Note: this functionality is still in beta. Please report any problems in issues tab.**

Tinfoil will auto upload the file if you'll insert new games in the list. So the 3rd step is required just for the first time.

### Prerequisites

The only prerequisites are:
* A Nintendo Switch with Homebrew access
* Tinfoil installed

## Create your own Tinson 🤖

If you don't want to use directly my version you can replicate my project in just 3 steps (again... 3 must be the perfect number):

* Create an Heroku account
* Clone my project and create an Heroku application with it.
* Install the add-on `mLab MongoDB`.

If you don't know how to do this I recommend the Heroku documentation which is pretty clear and easy to follow.