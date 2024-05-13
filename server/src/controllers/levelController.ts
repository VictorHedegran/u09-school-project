import Level from '../models/levelModel.js'

export async function findAllLevels() {
    const levels = await Level.find()
    return levels
}

export async function findLevelsById(idQuery: string) {
    const levels = await Level.findById(idQuery)
    return levels
}

export async function findLevelsByStat(statQuery: string) {
    const levels = await Level.find({ stat: statQuery })
    return levels
}

export async function findLevelByLevelNumber(levelNumberQuery: number, statQuery: string) {
    const level = await Level.findOne({ stat: statQuery, levelNumber: levelNumberQuery })
    return level
}
