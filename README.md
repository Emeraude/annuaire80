# Annuaire80

A simple services status checker written in node.js.  
If you have multiple services using differents ports, it will give you those who are active and those who are inactive, based on the status of the port.

## Installation

```bash
npm install --python=python2
mv config.json.default config.json
```

## Usage

Once it has been installed, you can use Annuaire80 with the following command :

```javascript
./index.js
```

This is an example of configuration file:

```javascript
{
	"services": { // the list of services
		"80": "Annuaire80" // the key is the port, the value is the display name
	},
	"host": "127.0.0.1", // the server to check the ports
	"port": 80, // the port used by Annuaire80
	"title": "Annuaire80", // the title of the page
	"protocol": "http", // the protocol used for the links
	"time": 10 // the delay in seconds between two updates of the active services list
}
```

### Author

Emeraude
