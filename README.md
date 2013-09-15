# firebase(1)

Control your [Firebase](http://firebase.com) from the command line.

## Installation

```
$ npm install -g firebase-cli
```

## Usage

The first time you use `firebase(1)` you'll be prompted for your 
email and password. Firebase auth tokens expire after 30 days, so 
you'll be asked again periodically. Your email and password aren't stored.

Firebase accounts authorized with Github aren't supported at this 
time (pull requests welcome).

```
$ firebase --help

  Usage: firebase <command> [<args>]

  Commands:

    ls                     list firebases
    info [firebase]        show info on [firebase]
    forge [firebase]       open [firebase] in Forge
    create [firebase]      create [firebase]
    rm [firebase]          remove [firebase]
    set [key] [value]      set configuration options

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -c, --config <file>  use configuration file
    -t, --token <token>  use auth token
```

## TODO

Still lots to implement:

## firebase-level

- get an auth token for a firebase
- get a secret for a firebase
- store firebase secrets

### security rules

    firebase rules [ns]    print rules
    firebase migrate [ns]  set rules

### data

    firebase backup [ns]   backup data
    firebase seed [ns]     replace w/new data
