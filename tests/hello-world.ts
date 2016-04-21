/// <reference path="../typings/main.d.ts" />
import * as test from "tape";
import Toxiproxy, { ICreateProxyBody } from "../src/Toxiproxy";

function setup() {
  const toxiproxy = new Toxiproxy("http://localhost:8474");

  return {
    toxiproxy
  };
}

test("Toxiproxy", (t: test.Test) => {
  t.test("Should create a proxy", (st: test.Test) => {
    const { toxiproxy } = setup();

    const createBody = <ICreateProxyBody>{ };
    toxiproxy.createProxy(createBody, (err, proxy) => {
      st.equal(err.message, null, "err was not null");
      st.end();
    });
  });

  t.test("Should return a list of proxies", (st: test.Test) => {
    const { toxiproxy } = setup();
    toxiproxy.getProxies((err, body) => {
      st.equal(err, null, "err was not null");
      st.end();
    });
  });
});
