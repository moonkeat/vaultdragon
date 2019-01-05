Prerequisites
-------------

- [MongoDB](https://www.mongodb.org/downloads)
- [Node.js 8.9.1+](http://nodejs.org)


Getting Started
---------------

```bash
# Clone the repo to your local
git clone https://github.com/moonkeat/vaultdragon.git vaultdragon

# Change directory
cd vaultdragon

# Install NPM dependencies
npm install

# Then simply start your app
npm start
```

Please make sure you have set all the environment variables according to `.env.example` before you execute `npm start`.

Run the tests
---------------

```bash
npm test
```

Endpoints
---------------

### Create / update object

```
POST /object
```

Sample request
```
{
  "mykey1": "value1"
}
```

Success response
```
{
  "key": "mykey1",
  "value": "value1",
  "timestamp": 1546692707882
}
```

Possible errors

| Status code | Message                                                       |
|-------------|---------------------------------------------------------------|
| 400         | request body should have only 1 key                           |
| 400         | request body's key shouldnt be empty                          |
| 400         | request body's value invalid, expecting string or json object |
| 500         | internal server error                                         |

### Get object

```
GET /object/mykey1
```

Query params

| Field     | Description                               |
|-----------|-------------------------------------------|
| timestamp | (Optional) Unix timestamps (UTC timezone) |

`GET /object` will return the value of the key based on the timestamp provided.


Sample response
```
{
  "value": "value1"
}
```

Possible errors

| Status code | Message                   |
|-------------|---------------------------|
| 400         | key shouldnt be empty     |
| 400         | timestamp should be valid |
| 404         | key not found             |
| 500         | internal server error     |

### Error response
```
{
  "error": {
    "message": "<message>"
  }
}
```
