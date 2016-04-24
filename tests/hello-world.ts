/// <reference path="../typings/main.d.ts" />
import * as test from "tape";
import Toxiproxy, { ICreateProxyBody, Proxies } from "../src/Toxiproxy";

function setup() {
  const toxiproxy = new Toxiproxy("http://localhost:8474");

  return {
    toxiproxy
  };
}

function failEnd(t: test.Test, err: any) {
  t.fail(err);
  t.end();
}

test("Toxiproxy", (t: test.Test) => {
  t.test("Should create a proxy", (st: test.Test) => {
    const { toxiproxy } = setup();

    const createBody = <ICreateProxyBody>{
      listen: "localhost:26379",
      name: "test",
      upstream: "localhost:6379"
    };
    toxiproxy.createProxy(createBody)
      .then((proxy) => {
        st.equal(proxy.name, createBody.name, "Have same name");

        proxy.remove()
          .then(() => st.end())
          .catch((err) => failEnd(st, err));
      })
      .catch((err) => failEnd(st, err));
  });

  t.test("Should return a list of proxies", (st: test.Test) => {
    const { toxiproxy } = setup();
    toxiproxy.getProxies()
      .then((proxies: Proxies) => st.end())
      .catch((err) => failEnd(st, err));
  });
});
