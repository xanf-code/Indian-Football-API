import { Router } from "https://deno.land/x/oak/mod.ts";
import { getList,getPlayer,addPlayer,updatePlayer,deletePlayer } from './Controller/team.ts'
const router = new Router();

router.get("/api/v1/players", getList)
 .get("/api/v1/player/:id", getPlayer)
 .post("/api/v1/player", addPlayer)
 .put("/api/v1/player/:id", updatePlayer)
 .delete("/api/v1/player/:id", deletePlayer)

export default router