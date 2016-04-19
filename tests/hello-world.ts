/// <reference path="../typings/main.d.ts" />
import * as test from "tape";
import * as request from "request";
import * as HttpStatus from "http-status";

test("Toxiproxy", (t: test.Test) => {
  t.test("Should return a list of proxies", (st: test.Test) => {
    request.get("http://localhost:8474/proxies", (err, res, body) => {
      st.equal(err, null, "err was not null");
      if (err) {
        st.end();
        return;
      }

      st.equal(res.statusCode, HttpStatus.OK, "response was not OK");
      st.end();
    });
  });

  t.end();
});