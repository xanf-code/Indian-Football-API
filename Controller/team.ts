import { Playerbio } from '../types.ts'
import { v4 } from 'https://deno.land/std/uuid/mod.ts'

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

const addPlayer = async ({ request, response }: { request: any, response: any }) => {
    const body = await request.body()

    if (!request.hasBody){
        response.status = 400,
        response.body = {
            success : false,
            msg : "No Data" 
        }
    } else {
        const player : Playerbio = body.value
        player.id = v4.generate()
        players.push(player)
        response.status = 201
        response.body = {
            success : true,
            data : player
        }
    }
};

// PUT - UPDATE PLAYER
// PUT /api/v1/player/:id

const updatePlayer = ({ response }: { response: any }) => {};

// DELETE PLAYER
// DELETE /api/v1/player/:id

const deletePlayer = ({ response }: { response: any }) => {};

export { getList,getPlayer,addPlayer,updatePlayer,deletePlayer}