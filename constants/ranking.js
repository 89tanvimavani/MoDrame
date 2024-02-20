import { RANKING } from "./types"
import { RANK } from "./images"

export const RANKS = [
    {
        "status": RANKING.NOVICE,
        "img": RANK['novice'],
        "challenges": 0,
        "wins": 0
    },
    {
        "status": RANKING.BEGINNER,
        "img": RANK['beginner'],
        "challenges": 50,
        "wins": 0
    },
    {
        "status": RANKING.ADVANCED_BEGINNER,
        "img": RANK['adv_beginner'],
        "challenges": 100,
        "wins": 0
    },
    {
        "status": RANKING.COMPETENT,
        "img": RANK['competent'],
        "challenges": 250,
        "wins": 0
    },
    {
        "status": RANKING.PROFICIENT,
        "img": RANK['proficient'],
        "challenges": 500,
        "wins": 1
    },
    {
        "status": RANKING.EXPERT,
        "img": RANK['expert'],
        "challenges": 750,
        "wins": 1
    },
    {
        "status": RANKING.PRO,
        "img": RANK['pro'],
        "challenges": 1000,
        "wins": 3
    },
    {
        "status": RANKING.ELITE,
        "img": RANK['elite'],
        "challenges": 2000,
        "wins": 5
    },
    {
        "status": RANKING.MASTER,
        "img": RANK['master'],
        "challenges": 3000,
        "wins": 10
    },
    {
        "status": RANKING.GOD_ESS,
        "img": RANK['god_ess'],
        "challenges": 5000,
        "wins": 25,
        "last": 1
    }
]