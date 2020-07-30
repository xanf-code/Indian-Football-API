import { Client } from "https://deno.land/x/postgres/mod.ts";
import { Playerbio } from '../types.ts'
import { dbCreds } from '../Config/config.ts'

const client = new Client(dbCreds)

let players : Playerbio[] = [
    {
    id : "1",
    name : "Sunil Chhetri",
    age: 33,
    height: 170,
    weight : 70,
    nationality : "India",
    overall : 67,
    potential : 67,
    player_positions : "ST, CF",
    preferred_foot : "Right",
    international_reputation : 1,
    weak_foot : 4,
    skill_moves : 3,
    work_rate : "High/Medium",
    body_type : "Normal"
  },
  {
    id : "2",
    name : "Sandesh Jhingan",
    age : 24,
    height : 188,
    weight : 74,
    nationality : "India",
    overall : 65,
    potential : 71,
    player_positions : "CB",
    preferred_foot : "Right",
    international_reputation : 1,
    weak_foot : 3,
    skill_moves : 2,
    work_rate : "Medium/Medium",
    body_type : "Normal"
  },
];

// GET LIST
// /api/v1/players

const getList = ({response} : {response: any}) => {
    response.body = {
        success : true,
        data : players
    }
}

// GET SINGLE PLAYER
// GET /api/v1/player/:id

const getPlayer = ({ response, params}: { params: {id: string} ,response: any }) => {
        const player: Playerbio | undefined = players.find(p=> p.id === params.id)
        if(player){
            response.status = 200
            response.body = {
                success : true,
                data : player
            }
        }else{
            response.status = 400
            response.body = {
                success : false,
                msg : "Player not found"
            }
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

    const player: Playerbio | undefined = players.find((p) => p.id === params.id);
    if (player) {
        const body = await request.body()

        const updatedData: {name?: string} = await body.value;
        players = players.map(p => p.id === params.id ? {
            ...p, ...updatedData
        }:p)
        response.status = 200;
        response.body = {
        success: true,
        data: players,
  };
} else {
    response.status = 400;
    response.body = {
    success: false,
    msg: "Player not found",
}
}
};

// DELETE PLAYER
// DELETE /api/v1/player/:id

const deletePlayer = ({ params , response }: { params: {id: string}, response: any }) => {
    players = players.filter(p=> p.id !== params.id)
    response.status = 201
    response.body = {
        success: true,
        msg : 'Player Successfully removed from the Database'
    }
};

export { getList,getPlayer,addPlayer,updatePlayer,deletePlayer}