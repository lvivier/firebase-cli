# firebase(1)

Control your [Firebase](http://firebase.com) from the command line.

## Installation

```
$ npm install -g firebase-cli
```

## Usage

The first time you use `firebase(1)` you'll be prompted for your 
email and password. Firebase accounts authorized with Github aren't 
supported at this time (pull requests welcome).

```
$ firebase --help

  Usage: firebase <command> [<args>]

  Commands:

    ls                     list namespaces
    create [namespace]     create [namespace]
    rm [namespace]         remove [namespace]
    forge [namespace]      open [namespace] in Forge
    set [key] [value]      set configuration options

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -c, --config <file>  specify configuration file
```

## TODO

Everything!

### namespace
- `exists [namespace]`
- `info [namespace]`
  - name
  - timestamp
  - storage
  - bandwidth
  - concurrents

### security rules
- prettyprint rules
- backup rules
- migrate (update rules)

### data
- `backup [namespace]` (with `format=export`)
- seeding (upload data from json)
