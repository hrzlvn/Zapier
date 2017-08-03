## Zapier App for FileMaker REST API Automation Service Integration   
### What is an Zapier App for FileMaker REST API Automation Service Integration?    
It is an implementation of FileMaker's rest API. You build a Node.js application
that exports a single object ([JSON Schema](https://github.com/zapier/zapier-platform-schema/blob/master/docs/build/schema.md#appschema)) and upload it to Zapier.
Zapier introspects that definition to find out what your app is capable of and
what options to present end users in the Zap Editor.

For those not familiar with Zapier terminology, here is how concepts in the CLI
map to the end user experience:

 * [Authentication](#authentication), (usually) which lets us know what credentials to ask users
   for. This is used during the "Connect Accounts" section of the Zap Editor.
 * [Triggers](#triggerssearchescreates), which read data *from* your API. These have their own section in the Zap Editor.
 * [Creates](#triggerssearchescreates), which send data *to* your API to create new records. These are listed under "Actions" in the Zap Editor.
 * [Searches](#triggerssearchescreates), which find specific records *in* your system. These are also listed under "Actions" in the Zap Editor.
 * [Resources](#resources), which define an object type in your API (say a contact) and the operations available to perform on it. These are automatically extracted into Triggers, Searches, and Creates.
 
### How does the App Work

Zapier takes the App you upload and sends it over to Amazon Web Service's Lambda.
We then make calls to execute the operations your App defines as we execute Zaps.
Your App takes the input data we provide (if any), makes the necessary HTTP calls,
and returns the relevant data, which gets fed back into Zapier.

### Requirements

All Zapier CLI apps are run using Node.js `v6.10.2`.   
You can develop using any version of Node you'd like, but your code has to run on Node `v6.10.2`. You can accomplish this by developing on your preferred version and then transpiling with [Babel](https://babeljs.io/) (or similar).  
To ensure stability for our users, we also require that you run your tests on `v6.10.2` as well. If you don't have it available, we recommend using either [nvm](https://github.com/creationix/nvm#installation) or [n](https://github.com/tj/n#installation) to install `v6.10.2` and run the tests locally. On Windows you can use [nvm-windows](https://github.com/coreybutler/nvm-windows#installation--upgrades) or [nodist](https://github.com/marcelklehr/nodist#installation).  
For NVM on Mac (via [homebrew](http://brew.sh/)):
```bash
brew install nvm
nvm install v6.10.2
```

You can then either swap to that version with `nvm use v6.10.2`, or do `nvm exec v6.10.2 zapier test` so you can run tests without having to switch versions while developing.

### Quick Setup Guide

> Be sure to check the [Requirements](#requirements) before you start! Also, it is recommend the [Tutorial](https://github.com/zapier/zapier-platform-cli/wiki/Tutorial) for a more thorough introduction.

First up is installing the CLI and setting up your auth so that you can deploy your FileMaker app to Zapier. It will be private to you and visible in your live [Zap editor](https://zapier.com/app/editor).

```bash
# install the CLI globally
npm install -g zapier-platform-cli

# setup auth to Zapier's platform with a deploy key
zapier login
```

Next, you'll probably want to upload app to Zapier itself so you can start testing live. So clone this repo and perform the following:

```bash
# push your app to Zapier
zapier push
```

> There is also documentation for all CLI command [full CLI reference documentation](http://zapier.github.io/zapier-platform-cli/cli.html).  

### Local Project Structure

In your app's folder, you should see this general recommended structure. The `index.js` is Zapier's entry point to your app. Zapier expects you to export an `App` definition there.

```plain
$ tree .
.
├── README.md
├── index.js
├── package.json
├── triggers
│   └── contact-by-tag.js
├── resources
│   └── Contact.js
├── test
│   ├── basic.js
│   ├── triggers.js
│   └── resources.js
├── build
│   └── build.zip
└── node_modules
    ├── ...
    └── ...
```

you can use higher order functions to create any part of your App definition!

### Registering an App

Registering your App with Zapier is a necessary first step which only enables basic administrative functions. It should happen before `zapier push` which is to used to actually expose an App Version in the Zapier interface and editor.

```bash
# register your app
zapier register "Zapier Example"

# list your apps
zapier apps
```

> Note: this doesn't put your app in the editor - see the docs on pushing an App Version to do that!

If you'd like to manage your **App**, use these commands:

* `zapier apps` - list the apps in Zapier you can administer
* `zapier register "Name"` - creates a new app in Zapier
* `zapier link` - lists and links a selected app in Zapier to your current folder
* `zapier history` - print the history of your app
* `zapier collaborate [user@example.com]` - add admins to your app who can push
* `zapier invite [user@example.com]` - add users to try your app before promotion


### Deploying an App Version

An App Version is related to a specific App but is an "immutable" implementation of your app. This makes it easy to run multiple versions for multiple users concurrently. By default, **every App Version is private** but you can `zapier promote` it to production for use by over 1 million Zapier users.

```bash
# push your app version to Zapier
zapier push

# list your versions
zapier versions
```

If you'd like to manage your **Version**, use these commands:

* `zapier versions` - list the versions for the current directory's app
* `zapier push` - push the current version of current directory's app & version (read from `package.json`)
* `zapier promote [1.0.0]` - mark a version as the "production" version
* `zapier migrate [1.0.0] [1.0.1] [100%]` - move users between versions, regardless of deployment status
* `zapier deprecate [1.0.0] [YYYY-MM-DD]` - mark a version as deprecated, but let users continue to use it (we'll email them)
* `zapier env 1.0.0 [KEY] [value]` - set an environment variable to some value


### Private App Version (default)

A simple `zapier push` will only create the App Version in your editor. No one else using Zapier can see it or use it.


```bash
# sends an email this user to let them view the app in the UI privately
zapier invite user@example.com

# sends an email this user to let them admin the app (make changes just like you)
zapier collaborate user@example.com
```

You can also invite anyone on the internet to your app by observing the URL at the bottom of `zapier invite`, it should look something like `https://zapier.com/platform/public-invite/1/222dcd03aed943a8676dc80e2427a40d/`. You can put this in your help docs, post it to Twitter, add it to your email campaign, etc.


### Publish Your App

Promotion is how you would share your app with every one of the 1 million+ Zapier users. If this is your first time promoting - you may have to wait for the Zapier team to review and approve your app.

If this isn't the first time you've promoted your app - you might have users on older versions. You can `zapier migrate` to either move users over (which can be dangerous if you have breaking changes). Or, you can `zapier deprecate` to give users some time to move over themselves.

```bash
# promote your app version to all Zapier users
zapier promote 1.0.1

# OPTIONAL - migrate your users between one app version to another
zapier migrate 1.0.0 1.0.1

# OR - mark the old version as deprecated
zapier deprecate 1.0.0 2017-01-01
```
