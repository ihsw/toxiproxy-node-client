/// <reference path="../typings/main.d.ts" />
import * as test from "tape";
import Toxiproxy, { ICreateProxyBody, Proxies } from "../src/Toxiproxy";

function setup() {
  const toxiproxy = new Toxiproxy("http://localhost:8474");

  return {
    toxiproxy
  };
}

function teardown(t: test.Test) {
  const { toxiproxy } = setup();
  
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
        st.end();
      })
      .catch((err) => {
        st.fail(err);
        st.end();
      });
  });

  t.test("Should return a list of proxies", (st: test.Test) => {
    const { toxiproxy } = setup();
    toxiproxy.getProxies()
      .then((proxies: Proxies) => st.end())
      .catch((err) => {
        st.fail(err);
        st.end();
      });
  });
});
