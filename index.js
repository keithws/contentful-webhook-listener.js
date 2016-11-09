"use strict";

const http = require("http");
const httpServer = http.Server;

class ContentfulWebhookListener extends httpServer {
    constructor (opts, requestListener) {

        super(requestListener);

        let server = this;

        this.on("request", function (request, response) {

            let auth, authInBase64, authorization, body, contentType, event, kind, origin, topic, webhookName;

            auth = opts.auth || null;

            // verify content-type
            contentType = request.headers["content-type"];
            if (contentType !== "application/vnd.contentful.management.v1+json") {

                response.writeHead(406, "Not Acceptable");
                response.end();
                return;

            }

            // verify authorization
            if (auth) {

                authorization = request.headers["authorization"];
                authInBase64 = new Buffer(auth).toString("base64");
                if (authorization !== `Basic ${authInBase64}`) {

                    response.writeHead(401, "Unauthorized");
                    response.end();
                    return;

                }

            }

            // capture custom headers from Contetnful
            topic = request.headers["x-contentful-topic"];
            [origin, kind, event] = topic.split(".");
            webhookName = request.headers["x-contentful-webhook-name"];

            // camelcase event name because that is the convention in node
            event = event.replace(/_([a-z])/, function (match, p1) {

                return p1.toUpperCase();

            });

            // capture body
            body = "";
            request.on("data", function (chunk) {

                body += chunk.toString();

            });

            // parse body
            request.on("end", function () {

                response.writeHead(200, "OK");

                try {

                    body = JSON.parse(body);

                    // emit event with webhook object
                    let webhook = {
                        "contentType": body.sys.contentType && body.sys.contentType.sys.id,
                        "fields": body.fields,
                        "id": body.sys.id,
                        "kind": kind,
                        "origin": origin,
                        "space": body.sys.space.sys.id,
                        "sys": body.sys,
                        "webhookName": webhookName
                    };
                    server.emit(event, webhook);

                } catch (err) {

                    server.emit("error", err);
                    server.close();

                }

                response.end();

            });

        });
    }
}

exports.Server = ContentfulWebhookListener;

exports.createServer = function(opts, requestListener) {

    return new ContentfulWebhookListener(opts, requestListener);

};
