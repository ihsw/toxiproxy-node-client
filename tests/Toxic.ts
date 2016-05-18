/// <reference path="../typings/main.d.ts" />
import * as test from "tape";
import Proxy from "../src/Proxy";
import Toxic from "../src/Toxic";
import { setup } from "./Helper";

test("Toxic", (t: test.Test) => {
  t.test("Should create a toxic", (st: test.Test) => {
    const { helper } = setup();

    const proxyName = "create-toxic-test";
    helper.withProxy(proxyName, (proxy) => {
        return new Promise<Proxy>((resolve, reject) => {
          helper.withToxic(proxy, "latency")
            .then(() => resolve(proxy))
            .catch(reject);
        });
      })
      .then(st.end)
      .catch((err) => {
        st.fail(err);
        st.end();
      });
  });

  t.test("Should refresh", (st: test.Test) => {
    const { helper } = setup();

    const proxyName = "toxic-refresh-test";
    helper.withProxy(proxyName, (proxy) => {
        return new Promise<Proxy>((resolve, reject) => {
          helper.withToxic(proxy, "latency", (toxic) => toxic.refresh())
            .then(() => resolve(proxy))
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