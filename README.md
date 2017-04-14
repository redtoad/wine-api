# Wine API

RESTful API for managing wines

Version 1.0.0

## Endpoints

Fee free to use the [corresponding POSTMAN collection](wines-api-postman.json).

### GET /wines/?year=<type>&type=<type>&name=<name>&country=<country>
Returns a list of wine object which are stored in the database. Use the optional query parameters ``year``, ``type``, ``name`` and ``country`` to filter your results.

### GET /wines/:id
Retrieves a wine by id.

### POST /wines/
Creates a new wine database entry. Payload for POST is for instance:

	{
		id: 3,
		name: 'Cabernet sauvignon',
		year: 2013,
		country: 'France',
		type: 'red',
		description: 'The Sean Connery of red wines'
	}

Note that the following attributes ``year``, ``type``, ``name`` and ``country`` are mandatory, while ``description``is optional. ``type``needs to be one of ``red``, ``white``, ``rose``.

### PUT /wines/:id
Update the wine with the given id. Payload is the same as POST.

### DELETE /wines/:id
Delete a wine by id.

## Install

Make sure you have a recent version of [node.js](https://nodejs.org) and [yarn](https://yarnpkg.com/en/docs/install) installed. Then run the following command in the root folder:

	$ yarn install

## Running the app

Simply run the following command:

	$ yarn run server
	
The API is now available at http://localhost:8080/wines

## Tests

In order to run the unit tests, execute the following command on your shell:

	$ yarn run test

## Improvements in future versions

Things to do better time permitting: 

* Use promises instead of callbacks
* Move some of the logic from controllers into Wine model
* Use of standard HTTP status codes:

   * 404 for UNKNOWN_OBJECT
   * 400 for empty query parameters
   * 201 for CREATED
   * 304 for NOT MODIFIED
   * 405 for METHOD NOT ALLOWED
   * 418 for good measure

* Add CORS (using ``server.use(restify.CORS());``) if integration in 3rd party web apps planned 
* HATEOS responses
* Result pagination

## License

Copyright (c) 2017 Sebastian Rahlf

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.