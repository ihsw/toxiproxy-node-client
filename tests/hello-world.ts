/// <reference path="../typings/main.d.ts" />
import * as test from "tape";
import * as request from "request";
import * as HttpStatus from "http-status";

test("Toxiproxy", (t: test.Test) => {
  request.get("http://localhost:8474/proxies", (err, res, body) => {
    t.equal(err, null, "err was not null");
    if (err) {
      t.end();
      return;
    }

    t.equal(res.statusCode, HttpStatus.OK, "response was not OK");
    t.end();
  });
});