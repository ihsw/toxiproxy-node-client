/// <reference path="../typings/main.d.ts" />
import * as test from "tape";
import Toxic from "../src/Toxic";
import { setup } from "./Helper";

test("Toxic", (t: test.Test) => {
  t.test("Should create a toxic", (st: test.Test) => {
    const { helper } = setup();

    const proxyName = "create-toxic-test";
    helper.withProxy(st, proxyName, (err, proxy) => {
      if (err) {
        return st.end(err);
      }

      proxy.addToxic(new Toxic(proxy, "latency", {}))
        .then((updatedProxy) => st.end())
        .catch((err) => st.end(err.response.error.text));
    });
  });
});