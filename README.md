rest-confidence
===============

This is a simple yet powerful **configuration server**. Tired of configuring many components in many different environments? Rest-confidence centralizes your settings and exposes them as a REST service.

Other use cases include using it as a service directory or as a foundation for A/B testing ([read more](http://guidogarcia.net/blog/2014/01/02/a-rest-configuration-server/)). It uses [confidence](https://github.com/spumko/confidence), with all it niceties now remotelly accesible through a simple REST service.

Configuration example
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
    },
    "$meta": {
        "anykey": "anyvalue" // comments are also fine
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

**GET /key2**

```
{
    "limit": 10
}
```

**GET /key2?env=production**

```
{
    "limit": 200
}
```

**GET /__raw**

Gets the raw configuration file contents.

Install & run
-------------

- git clone https://github.com/palmerabollo/rest-confidence.git
- cd rest-confidence
- npm install
- npm start

It runs on port 8000 by default. You can override it defining a PORT environment variable.

Clients
-------

- node.js: [rest-confidence-client](https://github.com/palmerabollo/rest-confidence-client)

TODO
----

- Allow multiple configuration files / modules
- Python client (contrigutions are welcome)
- Java client
- Send broadcast datagrams to make itself visible to the clients (under evaluation)
- Allow clients to subscribe and get notifications when a file/path changes.
- Managment capabilities: PUT / POST methods (low priority)
- Simple web UI (low priority)
- Multitenant (very low priority, under evaluation)

License
-------

MIT
