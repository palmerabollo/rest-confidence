rest-confidence
===============

This is a uber-simple but powerful configuration server.

Tired of configuring many components in many different environments? rest-confidence helps you centralize your configuration and expose it as a REST service. Go home early.

It uses [confidence](https://github.com/spumko/confidence), with all it niceties now remotelly accesible using a simple REST service.

configuration example
---------------------

```
{
    "key1": "value",
    "key2": {
        "$filter": "env",
        "production": {
            "limit": 200
        },
        "$default": {
            "limit": 10
        }
    }
}
```

**GET /**

```
{
    "key1": "value",
    "key2": {
        "limit": 10
    }
}
```

**GET /key2?env=production**

```
{
    "limit": 200
}
```

Install & run
-------------

- git clone the project
- npm install
- npm start

TODO
----

- ETag support / Last-Modified header
- Node.js client

License
-------

MIT
