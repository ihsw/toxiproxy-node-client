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
});