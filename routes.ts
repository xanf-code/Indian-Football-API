import { Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

router.get("/api/v1/teamlist", ({ response }: { response: any }) => {
  response.body = "Hello World";
});

export default router