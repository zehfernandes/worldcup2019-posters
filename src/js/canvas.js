import {
    calculateWidth,
    getUrlParams,
    getMatchCode,
    returnRGBA,
    getAspectRatio
} from './utils'
import FileSaver from 'file-saver'
import allMatches from './data/matches.json'
import filterData from './data/filter'
import drawText from './shapes/text.js'
import gridGoal from './shapes/gridGoals'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const size = 2
let innerMargin = 70 * size
let isRotated = false

canvas.width = 595.5 * size
canvas.height = 842 * size

// Implementation
let areaWidth = canvas.width - innerMargin * 2
let areaHeight = canvas.height - innerMargin * 2

function init(count) {
    c.save()
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.fillStyle = '#fff'
    c.fillRect(0, 0, canvas.width, canvas.height)

    let index = count ? count : match
    const { dataGeneral, dataHome, dataAway } = filterData(allMatches[index])

    // Center Point
    innerMargin = 60 * size
    let mPosition = 50 * size
    let center = [areaWidth - mPosition, areaHeight * dataHome.ballPossesions]

    //Variations game
    mPosition = 50 * size + dataGeneral.gameHour * size
    center[0] = center[0] + dataGeneral.gameHour * size

    if (dataGeneral.winner === dataHome.code) {
        c.translate(canvas.width, 0)
        c.scale(-1, 1)
    } else if (dataGeneral.winner === 'Draw') {
        center = [
            areaWidth / 2 + 40 * size,
            areaHeight * dataHome.ballPossesions
        ]
    }

    // Home Team
    //-------------------
    let homeTeamHeight = areaHeight * dataHome.ballPossesions
    let homeWidthAttempts = areaWidth / (dataHome.onTarget + dataHome.offTarget)
    let homePassWidth = (areaWidth - innerMargin) / dataHome.numPasses
    let homePassHeight = homeTeamHeight / dataHome.numPasses
    let shouldRotate = dataHome.clearances > 10

    c.translate(20 * size, 60 * size)

    c.fillStyle = dataHome.colors[0]
    drawTriange(
        {
            x: center[0] + 30 * size,
            y: center[1] + 20 * size
        },
        {
            x: areaWidth - mPosition + 60 * size,
            y: center[1] - homePassHeight * dataHome.passesCompleted - 20 * size
        },
        {
            x: areaWidth - mPosition - homePassWidth * dataHome.passesCompleted,
            y:
                center[1] -
                homePassHeight * dataHome.passesCompleted +
                dataHome.passAccurancy * size
        },
        shouldRotate ? `0.0${dataHome.goals}` : 0
    )

    //Away Team
    //-------------------
    let awayTeamHeight = areaHeight * dataAway.ballPossesions
    let awayWidthAttempts = areaWidth / (dataAway.onTarget + dataAway.offTarget)
    let awayPassWidth = areaWidth / dataAway.numPasses
    let awayPassHeight = awayTeamHeight / dataAway.numPasses

    c.translate(0 * size, -30 * size)

    c.fillStyle = dataAway.colors[0]
    drawTriange(
        {
            x: center[0],
            y: center[1]
        },
        {
            x: areaWidth - mPosition + 90 * size,
            y: center[1] + awayPassHeight * dataAway.passesCompleted + 5 * size
        },
        {
            x: Math.max(
                innerMargin + dataAway.tackles * 4 * size,
                mPosition - awayPassWidth * dataAway.passesCompleted
            ),
            y: center[1] + awayPassHeight * dataAway.passesCompleted + 30 * size
        },
        shouldRotate ? `0.0${dataAway.tackles * 2}` : 0
    )

    c.fillStyle = dataHome.colors[1]
    drawTriange(
        {
            x: center[0],
            y: center[1] + 70 * size + dataHome.goals * size * 10
        },
        {
            x: areaWidth - mPosition,
            y: center[1] - homeTeamHeight + innerMargin * size
        },
        {
            x: areaWidth - mPosition - homeWidthAttempts * dataHome.onTarget,
            y: center[1] - homeTeamHeight + innerMargin * size
        },
        shouldRotate ? `-0.0${dataHome.goals}` : 0
    )

    // NEW LAYER ORDER
    if (dataHome.colors[1] === '#FFFFFF') {
        c.fillStyle = dataAway.colors[0]
        drawTriange(
            {
                x: center[0],
                y: center[1]
            },
            {
                x: areaWidth - mPosition + 90 * size,
                y:
                    center[1] +
                    awayPassHeight * dataAway.passesCompleted +
                    5 * size
            },
            {
                x: Math.max(
                    innerMargin + dataAway.tackles * 4 * size,
                    mPosition - awayPassWidth * dataAway.passesCompleted
                ),
                y:
                    center[1] +
                    awayPassHeight * dataAway.passesCompleted +
                    30 * size
            },
            shouldRotate ? `0.0${dataAway.tackles * 2}` : 0
        )
    }

    c.fillStyle = dataAway.colors[1]
    drawTriange(
        {
            x: center[0] - 10 * size,
            y: center[1] + size * 10
        },
        {
            x: areaWidth - mPosition - 30 * size,
            y: center[1] + awayTeamHeight + dataAway.goals * size
        },
        {
            x: Math.max(
                innerMargin + 80 * size,
                areaWidth -
                    mPosition -
                    awayWidthAttempts * dataAway.onTarget -
                    80 * size
            ),
            y: center[1] + awayTeamHeight - 20 * size + dataAway.goals * size
        },
        `0.0${dataAway.goals * 2}`
    )

    // Distance ball
    //--------------------
    if (dataGeneral.winner === 'Draw') {
        c.translate(60 * size, 50 * size)
    }
    drawHashBall(
        center[0] - 110 * size,
        center[1] - 70 * size,
        dataHome.distance * size * 1
    )
    drawHashBall(
        center[0] - 20 * size,
        center[1] - 10 * size,
        dataAway.distance * size * 1
    )

    c.restore()
    c.save()
    // Infos
    //--------------------
    innerMargin = 70 * size
    drawText(canvas, dataGeneral, { innerMargin, size })

    gridGoal(canvas, dataHome, {
        innerMargin,
        size,
        direction: 'home'
    })
    gridGoal(canvas, dataAway, {
        innerMargin,
        size,
        direction: 'away'
    })

    // // Debug
    // //-------------------
    // console.log(dataHome.passesCompleted, dataHome.numPasses)
    // console.log(dataAway.passesCompleted, dataAway.numPasses)
    // // debug
    // c.beginPath()
    // c.rect(innerMargin, innerMargin, areaWidth, areaHeight)
    // c.strokeStyle = 'red'
    // c.fillStyle = 'transparent'
    // c.stroke()
    // c.closePath()

    c.restore()
}

function drawHashBall(x, y, radius) {
    c.save()
    c.beginPath()
    c.strokeStyle = 'transparent'
    c.arc(x, y, radius, 0, 2 * Math.PI)
    let hashX = x - radius
    let hashY = y - radius
    let hashSize = radius
    c.strokeStyle = 'rgba(0,0,0,0.8)'
    c.clip()
    c.beginPath()
    for (let i = 0; i < 60 * size; i++) {
        c.moveTo(hashX, hashY)
        c.lineTo(hashX + hashSize * 2, hashY)
        hashY = hashY + 3 * size
    }
    c.stroke()
    c.closePath()
    c.restore()
}

function drawTriange(p1, p2, p3, rotateString) {
    c.save()
    let rotate = parseFloat(rotateString) - 0.01
    c.translate(p1.x - rotate * 10 * size, p1.y + rotate * 20 * size)
    c.rotate(-rotate * Math.PI)
    //c.translate(0, rotate * 10 * size)

    c.beginPath()
    c.moveTo(0, 0)
    c.lineTo(p2.x - p1.x, p2.y - p1.y)
    c.lineTo(p3.x - p1.x, p3.y - p1.y)
    c.fill()
    c.closePath()

    c.restore()
}

//------------------
// DOM
// ------------------
const next = document.getElementById('next')
const prev = document.getElementById('prev')
const rotateClick = document.getElementById('rotateClick')

let match = getUrlParams(window.location.href).match
if (!match) {
    match = getMatchCode(window.location.pathname)
}

//Next
let nIndex = parseInt(match) + 1
if (nIndex < allMatches.length - 1) {
    let nextGame = `${allMatches[nIndex].home_team_country}-vs-${
        allMatches[nIndex].away_team_country
    }`.toLowerCase()
    next.setAttribute(
        'href',
        `${next.getAttribute('href')}/match/${nIndex}/${nextGame}`
    )
}

//Prev
nIndex = parseInt(match) - 1
if (nIndex > 0) {
    let preGame = `${allMatches[nIndex].home_team_country}-vs-${
        allMatches[nIndex].away_team_country
    }`.toLowerCase()
    prev.setAttribute(
        'href',
        `${prev.getAttribute('href')}/match/${nIndex}/${preGame}`
    )
}

addEventListener('keydown', function(event) {
    let keyCode = event.which
    switch (keyCode) {
    case 39:
        next.click()
        break
    case 37:
        prev.click()
        break
    default:
        return null
    }
})

rotateClick.addEventListener('click', function(event) {
    if (isRotated) {
        canvas.style =
            'transform: scale(1); box-shadow: rgba(0,0,0,.15) 3px 3px 20px 0'
        isRotated = false
    } else {
        canvas.style =
            'transform: scale(-1); box-shadow: rgba(0,0,0,.15) -3px -3px 20px 0'
        isRotated = true
    }

    event.preventDefault()
})

//------------------
// Generate
// ------------------

// let count = 29
// let jsonTemplate = []

// function generateDraw() {
//     if (allMatches[count].status != 'completed') {
//         console.log(JSON.stringify(jsonTemplate))
//         return
//     }

//     init(count)

//     setTimeout(() => {
//         canvas.toBlob(function(blob) {
//             let fileName = `${allMatches[count].home_team.code}-${
//                 allMatches[count].away_team.code
//             }.png`
//             FileSaver.saveAs(blob, fileName)

//             let matchStage = allMatches[count].stage_name
//             let url = `/match/${count}/${
//                 allMatches[count].home_team_country
//             }-vs-${allMatches[count].away_team_country}`

//             if (jsonTemplate[matchStage] === undefined) {
//                 jsonTemplate[matchStage] = []
//             }
//             jsonTemplate[matchStage].push({
//                 file: fileName,
//                 url: url
//             })

//             count = count + 1
//             generateDraw()
//         })
//     }, 2000)
// }

// generateDraw()
//let interval = setInterval(generateDraw, 10000)

init()
