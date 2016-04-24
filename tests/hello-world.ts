/// <reference path="../typings/main.d.ts" />
import * as test from "tape";
import Toxiproxy, { Proxies } from "../src/Toxiproxy";
import Proxy from "../src/Proxy";
import Helper from "./Helper";

function setup() {
  const toxiproxy = new Toxiproxy("http://localhost:8474");
  const helper = new Helper(toxiproxy);

  const testPorts = {
    create: 5000,
    get: 5001,
    getAll: 5002
  };

  return {
    toxiproxy,
    helper,
    testPorts
  };
}

test("Toxiproxy", (t: test.Test) => {
  t.test("Should create a proxy", (st: test.Test) => {
    const { helper, testPorts } = setup();

    helper.withProxy(st, "create-test", testPorts.create);
  });

  t.test("Should return a list of proxies", (st: test.Test) => {
    const { toxiproxy } = setup();
    toxiproxy.getAll()
      .then((proxies: Proxies) => st.end())
      .catch((err) => {
        st.fail(err);
        st.end();
      });
  });

  t.test("Should get all proxies", (st: test.Test) => {
    const { toxiproxy, helper, testPorts } = setup();

    const proxyName = "get-all-test";
    helper.withProxy(st, proxyName, testPorts.getAll, (proxy: Proxy) => {
      toxiproxy.getAll()
        .then((proxies) => {
          st.equal(proxies[proxyName].name, proxyName, "Proxy body and fetched proxy have same name");
        })
        .catch((err) => {
          st.fail(err);
          st.end();
        });
    });
  });

  t.test("Should get a proxy", (st: test.Test) => {
    const { toxiproxy, helper, testPorts } = setup();

    const proxyName = "get-test";
    helper.withProxy(st, proxyName, testPorts.get, (proxy: Proxy) => {
      toxiproxy.get(proxyName)
        .then((proxy) => {
          st.equal(proxy.name, proxyName, "Proxy body and fetched proxy have same name");
        })
        .catch((err) => {
          st.fail(err);
          st.end();
        });
    });
  });
});
