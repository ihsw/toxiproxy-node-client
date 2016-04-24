/// <reference path="../typings/main.d.ts" />
import * as test from "tape";
import Toxiproxy, { ICreateProxyBody, Proxies } from "../src/Toxiproxy";

function setup() {
  const toxiproxy = new Toxiproxy("http://localhost:8474");

  return {
    toxiproxy
  };
}

test("Toxiproxy", (t: test.Test) => {
  t.test("Should create a proxy", (st: test.Test) => {
    const { toxiproxy } = setup();

    const createBody = <ICreateProxyBody>{
      listen: "localhost:50000",
      name: "create-test",
      upstream: "localhost:6379"
    };
    toxiproxy.createProxy(createBody)
      .then((proxy) => {
        st.equal(proxy.name, createBody.name, "Have same name");

        proxy.remove()
          .then(() => st.end())
          .catch((err) => {
            st.fail(err);
            st.end();
          });
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

  t.test("Should get all proxies", (st: test.Test) => {
    const { toxiproxy } = setup();

    const createBody = <ICreateProxyBody>{
      listen: "localhost:50001",
      name: "get-all-test",
      upstream: "localhost:6379"
    };
    toxiproxy.createProxy(createBody)
      .then((proxy) => {
        st.equal(proxy.name, createBody.name, "Proxy body and created proxy have same name");

        toxiproxy.getProxies()
          .then((proxies) => {
            st.equal(proxies[createBody.name].name, createBody.name, "Proxy body and fetched proxy have same name");

            toxiproxy.removeAll(proxies)
              .then(() => st.end())
              .catch((err) => {
                st.fail(err);
                st.end();
              });
          })
          .catch((err) => {
            st.fail(err);
            st.end();
          });
      })
      .catch((err) => {
        st.fail(err);
        st.end();
      });
  });
});
