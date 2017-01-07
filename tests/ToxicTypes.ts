import { test } from "ava";
import { createProxy, createToxic } from "../src/TestHelper";
import { Timeout } from "../src/Toxic";

test("Proxy Should add a timeout toxic", async (t) => {
  const { proxy } = await createProxy(t, "add-timeout-toxic-test");

  const attributes = <Timeout>{ timeout: 5 * 1000 };
  const toxic = await createToxic(t, proxy, "timeout", attributes);
  t.is(attributes.timeout, toxic.attributes.timeout);

  return proxy.remove();
});