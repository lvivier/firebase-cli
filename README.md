# firebase(1)

Control your [Firebase](http://firebase.com) from the command line.

**NOTE** There's now an offical [Firebase command line tools](https://github.com/firebase/firebase-tools)!

## Installation

```
$ npm install -g lvivier/firebase-cli
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

## License

(The MIT License)

Copyright (c) 2013 Luke Vivier <luke@vivier.ca>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
