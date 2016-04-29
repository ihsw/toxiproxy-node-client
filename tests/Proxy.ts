/// <reference path="../typings/main.d.ts" />
import * as test from "tape";
import Proxy from "../src/Proxy";
import { ICreateProxyBody } from "../src/Toxiproxy";
import { setup } from "./Helper";

test("Proxy", (t: test.Test) => {
  t.test("Should update a proxy", (st: test.Test) => {
    const { helper } = setup();

    const proxyName = "update-test";
    helper.withProxy(st, proxyName, (err, proxy) => {
      if (err) {
        return st.end(err);
      }

      proxy.enabled = false;
      proxy.update()
        .then((updatedProxy) => {
          st.equal(proxy.enabled, updatedProxy.enabled, "Created and updated proxy have same name");
          st.end();
        })
        .catch((err) => st.end(err));
    });
  });

  t.test("Should remove a proxy", (st: test.Test) => {
    const { toxiproxy } = setup();

    const createBody = <ICreateProxyBody>{
      enabled: true,
      listen: "localhost:0",
      name: "remove-test",
      upstream: "localhost:6379"
    };
    toxiproxy.createProxy(createBody)
      .then((proxy: Proxy) => {
        st.equal(createBody.name, proxy.name, "Create-body and proxy have same name");

        proxy.remove()
          .then(() => st.end())
          .catch((err) => st.end(err));
      })
      .catch((err) => st.end(err));
  });

  t.test("Should refresh toxics", (st: test.Test) => {
    const { helper } = setup();

    const proxyName = "refresh-test";
    helper.withProxy(st, proxyName, (err, proxy) => {
      if (err) {
        return st.end(err);
      }

      proxy.refreshToxics()
        .then((updatedProxy) => st.end())
        .catch((err) => st.end(err));
    });
  });
});
