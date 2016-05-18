/// <reference path="../typings/main.d.ts" />
import * as test from "tape";
import Proxy from "../src/Proxy";
import { ICreateProxyBody } from "../src/Toxiproxy";
import { setup } from "./Helper";

test("Proxy", (t: test.Test) => {
  t.test("Should update a proxy", (st: test.Test) => {
    const { helper, fail } = setup();

    const proxyName = "update-test";
    helper.withProxy(proxyName, (proxy) => {
      return new Promise<Proxy>((resolve, reject) => {
        proxy.enabled = false;
        proxy.update()
          .then((updatedProxy) => {
            st.equal(proxy.enabled, updatedProxy.enabled, "Created and updated proxy have same enabled state");
            resolve(proxy);
          })
          .catch(reject);
      });
    })
      .then(st.end)
      .catch((err) => fail(st, err));
  });

  t.test("Should remove a proxy", (st: test.Test) => {
    const { toxiproxy, fail } = setup();

    const createBody = <ICreateProxyBody>{
      enabled: true,
      listen: "localhost:0",
      name: "remove-test",
      upstream: "localhost:6379"
    };
    toxiproxy.createProxy(createBody)
      .then((proxy: Proxy) => {
        st.equal(createBody.name, proxy.name, "Create-body and proxy have same name");

        return proxy.remove();
      })
      .then(st.end)
      .catch((err) => fail(st, err));
  });

  t.test("Should refresh toxics", (st: test.Test) => {
    const { helper, fail } = setup();

    const proxyName = "refresh-test";
    helper.withProxy(proxyName, (proxy) => proxy.refreshToxics())
      .then(st.end)
      .catch((err) => fail(st, err));
  });
});
