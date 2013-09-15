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

Firebase accounts authorized with GitHub aren't supported at this 
time (pull requests welcome).

```
$ firebase --help

  Usage: firebase <command> [firebase] [--config file] [--token token]

  Commands:

    ls                     list firebases
    info [name]            show info on a firebase
    create [name]          create firebase with [name]
    forge [name]           open firebase in Forge
    rm [name]              remove firebase
    rules [name]           show rules for firebase
    migrate [name] [file]  set new rules for firebase
    set [key] [value]      set configuration options

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -c, --config <file>  use configuration file
    -t, --token <token>  use auth token
```

## TODO

Still lots to implement:

- store firebase secrets
- additional commands:
  
  ```
  firebase migrate [ns]  set rules
  firebase backup [ns]   backup data
  firebase seed [ns]     replace w/new data
  ```
