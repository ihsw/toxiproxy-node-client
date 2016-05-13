/// <reference path="../typings/main.d.ts" />
import * as test from "tape";
import { setup } from "./Helper";

test("Toxic", (t: test.Test) => {
  t.test("Should create a toxic", (st: test.Test) => {
    const { helper } = setup();

    const proxyName = "create-toxic-test";
    helper.withProxy(proxyName, (proxy) => {
        return new Promise<any>((resolve, reject) => {
          helper.withToxic(proxy, "latency").then(resolve).catch(reject);
        });
      })
      .then(st.end)
      .catch((err) => {
        st.fail(err);
        st.end();
      });
  });

  t.test("Should get refresh", (st: test.Test) => {
    const { helper } = setup();

    const proxyName = "toxic-refresh-test";
    helper.withProxy(proxyName, (proxy) => {
        return new Promise<any>((pResolve, pReject) => {
          helper.withToxic(proxy, "latency", (toxic) => {
            return new Promise<any>((tResolve, tReject) => {
              toxic.refresh().then(tResolve).catch(tReject);
            });
          })
            .then(pResolve)
            .catch(pReject);
        });
      })
      .then(st.end)
      .catch((err) => {
        st.fail(err);
        st.end();
      });
  });
});