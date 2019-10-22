# Contentful Webhook Listener

[![Build Status](https://travis-ci.org/keithws/contentful-webhook-listener.js.svg?branch=master)](https://travis-ci.org/keithws/contentful-webhook-listener.js) [![NPM Dependency Status](https://david-dm.org/keithws/contentful-webhook-listener.js.svg)](https://david-dm.org/keithws/contentful-webhook-listener.js) [![NPM Verion](https://img.shields.io/npm/v/contentful-webhook-listener.svg)](https://www.npmjs.com/package/contentful-webhook-listener)

An HTTP server for listening to Contentful API Webhooks with JavaScript. This provides a Node.js module to create a web server and then emits events for each action (create, save, autoSave, etc) that occurs in Contentful.

> [Contentful][4] is a content management platform for web applications, mobile apps and connected devices. It allows you to create, edit & manage content in the cloud and publish it anywhere via powerful API. Contentful offers tools for managing editorial teams and enabling cooperation between organizations.

> Webhooks in Contentful can notify you or someone else when content has changed by calling a preconfigured HTTP endpoint. This can be used for notifications, static site generators or other forms of post-processing sourced from Contentful.

Setup a custom callback that executes on-demand and it will receive the latest version of the Entry, Asset, or Content Type for each `create`, `save`, `autoSave`, `archive`, `unarchive`, or `publish` event in Contentful. The `unpublish` and `delete` events in Contentful send a DeletedEntry or DeletedAsset payload.

See the [Contentful Content Management API][2] documentation for more details on their webhooks.

Pair this with [ngork][5] for local development, or a server behind a firewall, that responds to actions in Contentful or consider the [contentful-webhook-tunnel][6] module which automates the whole process.

If you are looking for a ruby gem with similar functionality, check out [contentful-webhook-listener](https://github.com/contentful/contentful-webhook-listener.rb).

## Install

```shell
npm install contentful-webhook-listener
```

## Usage

```node
var listener = require("contentful-webhook-listener");
var webhook = listener.createServer();
var port = 5000;

webhook.on("publish", function (payload) {

	console.log(payload);

});

webhook.listen(port);
```

`listener` extends the `http` module, so all the methods, properties, and events from the `http` module are available on the `listener` module.

`createServer()` accepts a options argument in addition to the standard requestListener function. The options argument accepts a `auth` property which will enable and enforce HTTP Basic Authentication. The `auth` property value should be the username and password in `<username>:<password>` format.

```node
var listener = require("contentful-webhook-listener");
var webhook = listener.createServer({
	"auth": "username:password"
}, function requestListener (request, response) {

	console.log("request received");

});
var port = 5000;

webhook.on("publish", function (payload) {

	console.log(payload);

});

webhook.listen(port, function callback () {

	console.log("server is listening");

});
```

## Payload Properties

The payload returned has the following properties for the `create`, `save`, `autoSave`, `archive`, `unarchive`, or `publish` events. Sample data from the Contentful API sample space with cats.

```json
{
	"contentType": "cat",
	"fields": {
		"name": {
			"en-US": "Nyan Cat"
		},
		"likes": {
			"en-US": [
				"rainbows",
				"fish"
			]
		},
		"color": {
			"en-US": "rainbow"
		},
		"bestFriend": {
			"type": "Link",
			"linkType": "Entry",
			"id": "happycat"
		},
		"birthday": {
			"en-US": "2011-04-04T22:00:00+00:00"
		},
		"lives": {
			"en-US": 1337
		},
		"image": {
			"type": "Link",
			"linkType": "Asset",
			"id": "nyancat"
		}
	},
	"id": "cat_nyancat",
	"kind": "Entry",
	"origin": "ContentManagement",
	"space": "cfexampleapi",
	"sys": {
		"space": {
			"sys": { }
		},
		"type": "Entry",
		"contentType": {
			"sys": { }
		},
		"id": "cat_nyancat",
		"revision": 1,
		"createdAt": "2016-10-24T19:48:51.128Z",
		"updatedAt": "2016-11-03T03:12:28.855Z"
	},
	"webhookName": "localhost"
}
```

The payload has the following properties for the `unpublish` and `delete` events:

```json
{
	"contentType": "cat",
	"fields": null,
	"id": "cat_nyancat",
	"kind": "Entry",
	"origin": "ContentManagement",
	"space": "cfexampleapi",
	"sys": {
		"space": {
			"sys": { }
		},
		"type": "DeletedEntry",
		"contentType": {
			"sys": { }
		},
		"id": "cat_nyancat",
		"revision": 2,
		"createdAt": "2016-11-03T03:10:55.676Z",
		"updatedAt": "2016-11-03T03:10:55.676Z",
		"deletedAt": "2016-11-03T03:10:55.676Z"
	},
	"webhookName": "localhost"
}
```

## Todo

* add a command line interface

## Changelog

_1.0.4 — October 22, 2019_

* added `files` to package.json so only necessary files are included in npm tarball

_1.0.3 — October 22, 2019_

* upgrade all dependencies

_1.0.2 — November 8, 2016_

* closer server after emitting an error
* only set contentType when contentType is available

_1.0.1 — November 3, 2016_

* fixed npm badge in readme
* fixed date of first release in change log

_1.0.0 — November 3, 2016_

* initial version
* provides functionality similar the [Contentful Webhook Listener][3] but with Node.js instead of Ruby

## License

contentful-webhook-listener.js is available under the [MIT License][1].




[1]: https://github.com/keithws/contentful-webhook-listener/blob/master/LICENSE
[2]:  https://www.contentful.com/developers/docs/references/content-management-api/#/reference/webhooks/create/update-a-webhook
[3]: https://github.com/contentful/contentful-webhook-listener.rb
[4]: http://www.contentful.com/
[5]: https://ngrok.com
[6]: https://github.com/keithws/contentful-webhook-tunnel
