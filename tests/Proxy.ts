/// <reference path="../typings/main.d.ts" />
import * as test from "tape";
import Proxy from "../src/Proxy";
import { ICreateProxyBody } from "../src/Toxiproxy";
import { setup } from "./Helper";

test("Proxy", (t: test.Test) => {
  t.test("Should update a proxy", (st: test.Test) => {
    const { helper } = setup();

    const proxyName = "update-test";
    helper.withProxy(proxyName, (proxy) => {
      return new Promise<any>((resolve, reject) => {
        proxy.enabled = false;
        proxy.update()
          .then((updatedProxy) => {
            st.equal(proxy.enabled, updatedProxy.enabled, "Created and updated proxy have same enabled state");
            resolve();
          })
          .catch(reject);
      });
    })
      .then(st.end)
      .catch((err) => {
        st.fail(err);
        st.end();
      });
  });

  t.test("Should remove a proxy", (st: test.Test) => {
    const { toxiproxy } = setup();

    const fail = (err: Error) => {
      st.fail(err.message);
      st.end();
    };

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
          .then(st.end)
          .catch(fail);
      })
      .catch(fail);
  });

  t.test("Should refresh toxics", (st: test.Test) => {
    const { helper } = setup();

    const proxyName = "refresh-test";
    helper.withProxy(proxyName, (proxy) => {
      return new Promise<any>((resolve, reject) => {
        proxy.refreshToxics()
          .then((updatedProxy) => resolve())
          .catch(reject);
      });
    })
      .then(st.end)
      .catch((err) => {
        st.fail(err);
        st.end();
      });
  });
});
