rest-confidence
===============

This is a uber-simple yet powerful-enough configuration server.

Tired of configuring many components in many different environments? rest-confidence helps you centralize your configuration and expose it as a REST service.

Other use cases include using it as a service directory or as a foundation for A/B testing. 

It uses [confidence](https://github.com/spumko/confidence), with all it niceties now remotelly accesible using a simple REST service.

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

Clients
-------

- node.js: [rest-confidence-client](https://github.com/palmerabollo/rest-confidence-client)

TODO
----

- Allow multiple configuration files / modules.
- Managment capabilities: PUT / POST methods.
- Python and Java clients.
- Send broadcast datagrams to make itself visible to the clients.
- Simple web UI (low priority)

License
-------

MIT
