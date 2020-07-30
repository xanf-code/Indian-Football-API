import { Client } from "https://deno.land/x/postgres/mod.ts";
import { dbCreds } from '../Config/config.ts'

const client = new Client(dbCreds)

// GET LIST
// /api/v1/players

const getList = async ({response} : {response: any}) => {
    try {
        await client.connect()

        const results = await client.query("SELECT * FROM players")

        const players = new Array()

        results.rows.map(p=> {
            let obj : any = new Object()

            results.rowDescription.columns.map((el,i) => {
                obj[el.name] = p[i]
            })

            players.push(obj)
        })
        response.status = 201,
        response.body = {
            success : true,
            data: players
        }
    } catch (err) {
        response.status = 500,
        response.body = {
        success: false,
        data: err.toString(),
  };
    } finally {
        await client.end()
    }
}

// GET SINGLE PLAYER
// GET /api/v1/player/:id

const getPlayer = async ({ response, params}: { params: {id: string} ,response: any }) => {
        try {
            await client.connect()

            const result = await client.query("SELECT * FROM players WHERE id=$1", params.id)

            if (result.rows.toString() === ""){
                response.status = 400
                response.body = {
                    success : false,
                    msg : "ID Not found"
                }
                return;
            } else {
                const player : any = new Object()
                result.rows.map(p => {
                    result.rowDescription.columns.map((el,i)=>{
                        player[el.name] = p[i]
                    })
                })
                response.status = 200
                response.body = {
                    success : true,
                    data : player
                }
            }
        } catch (err) {
           response.status = 500,
           response.body = {
               success : false,
               msg : err.toString()
           }
       } finally{
           await client.end()
       }
};

// ADD PLAYER
// POST /api/v1/player

const addPlayer = async ({ request, response }: { request: any, response: any }) =>
{
    const body = await request.body()
    const player = await body.value

    if (!request.hasBody){
        response.status = 400,
        response.body = {
            success : false,
            msg : "No Data" 
        }
    } else {
       try {
           await client.connect()

           await client.query("INSERT INTO players(name,age,height,weight,nationality,overall,potential,player_positions,preferred_foot,international_reputation,weak_foot,skill_moves,work_rate,body_type)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)",
           player.name,
           player.age,
           player.height,
           player.weight,
           player.nationality,
           player.overall,
           player.potential,
           player.player_positions,
           player.preferred_foot,
           player.international_reputation,
           player.weak_foot,
           player.skill_moves,
           player.work_rate,
           player.body_type)

           response.status = 201,
           response.body = {
               success : true,
               data : player
           }
       } catch (err) {
           response.status = 500,
           response.body = {
               success : false,
               msg : err.toString()
           }
       } finally{
           await client.end()
       }
    }
};

// PUT - UPDATE PLAYER
// PUT /api/v1/player/:id
// Not yet Done with PUT

const updatePlayer = async ({ params, request, response }: { params: { id: string }, request: any, response: any }) => {

    const body = await request.body();
    const player = await body.value;

if (!request.hasBody) {
  response.status = 400,
    response.body = {
      success: false,
      msg: "No Data",
    };
} else {
  try {
    await client.connect();

    await client.query(
      "UPDATE players SET name=$1,age=$2,height=$3,weight=$4,nationality=$5,overall=$6,potential=$7,player_positions=$8,preferred_foot=$9,international_reputation=$10,weak_foot=$11,skill_moves=$12,work_rate=$13,body_type=$14 WHERE id=$15",
      player.name,
      player.age,
      player.height,
      player.weight,
      player.nationality,
      player.overall,
      player.potential,
      player.player_positions,
      player.preferred_foot,
      player.international_reputation,
      player.weak_foot,
      player.skill_moves,
      player.work_rate,
      player.body_type,
      params.id
    );

    response.status = 201,
      response.body = {
        success: true,
        data: player,
      };
  } catch (err) {
    response.status = 500,
      response.body = {
        success: false,
        msg: err.toString(),
      };
  } finally {
    await client.end();
  }
}
};

// DELETE PLAYER
// DELETE /api/v1/player/:id

const deletePlayer = async ({ params , response }: { params: {id: string}, response: any }) => {
    await getPlayer({params: {"id": params.id}, response})
   if(response.status === 404) {
        response.body = {
            success: false,
            msg: response.body.msg
        }
        response.status = 404
        return
    } else {
        try {
            await client.connect()

            const result = await client.query("DELETE FROM players WHERE id=$1", params.id)

            response.body = {
                success: true,
                msg: `Player with id ${params.id} has been deleted`
            }
            response.status = 204
        } catch (err) {
            response.status = 500
                response.body = {
                    success: false,
                    msg: err.toString()
                }
        } finally {
            await client.end()
        }
    }
}

export { getList,getPlayer,addPlayer,updatePlayer,deletePlayer}