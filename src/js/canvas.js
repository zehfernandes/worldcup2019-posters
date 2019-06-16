import { calculateWidth, getUrlParams, getMatchCode, returnRGBA } from './utils'
import allMatches from './data/matches.json'
import listColors from './data/colors.js'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const size = 2
let innerMargin = 70 * size
canvas.width = calculateWidth(window.innerHeight * size, size)
canvas.height = window.innerHeight * size

// Implementation
let areaWidth = canvas.width - innerMargin * 2
let areaHeight = canvas.height - innerMargin * 2

let objects = []
function init() {
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.fillStyle = '#fff'
    c.fillRect(0, 0, canvas.width, canvas.height)

    // Text
    //--------------------
    let titleSize = 20 * size
    let homeTeamText = allMatches[match].home_team_country.toUpperCase()
    c.font = `600 ${titleSize}px 'Helvetica Neue'`
    c.fillStyle = '#000'
    c.textBaseline = 'middle'
    c.textAlign = 'left'
    c.fillText(homeTeamText, innerMargin + 50 * size, innerMargin)

    c.save()
    c.translate(innerMargin, innerMargin)
    c.rotate(-0.5 * Math.PI)
    c.font = `${10 * size}px \'Helvetica Neue\'`
    c.fillStyle = '#000'
    c.textBaseline = 'middle'
    c.textAlign = 'right'
    c.fillText('FRANCE 2019', -25 * size, 0)
    c.fillText('WOMENS WORLD CUP', -25 * size, 16 * size)
    c.restore()

    c.save()
    let awayTeamText = allMatches[match].away_team_country.toUpperCase()
    c.translate(canvas.width - titleSize * 5, canvas.height - titleSize)
    c.rotate(-1 * Math.PI)
    c.font = `600 ${titleSize}px 'Helvetica Neue'`
    c.fillStyle = '#000'
    c.textBaseline = 'middle'
    c.textAlign = 'right'
    c.fillText(awayTeamText, innerMargin + 50 * size, innerMargin)
    c.restore()

    c.save()
    let locationText = allMatches[match].location.toUpperCase()
    c.translate(canvas.width - innerMargin, canvas.height - innerMargin)
    c.rotate(-0.5 * Math.PI)
    c.font = `${10 * size}px \'Helvetica Neue\'`
    c.fillStyle = '#000'
    c.textBaseline = 'middle'
    c.textAlign = 'left'
    c.fillText('JUNE 6 2019', 40 * size, -26 * size)
    c.fillText(locationText, 40 * size, -10 * size)
    c.restore()

    //return
    //innerMargin = 40 * size

    //Home Team
    //-------------------
    let dataHome = {
        ballPossesions:
            allMatches[match].home_team_statistics.ball_possession / 100,
        numPasses: allMatches[match].home_team_statistics.num_passes,
        passesCompleted:
            allMatches[match].home_team_statistics.passes_completed,
        onTarget: allMatches[match].home_team_statistics.on_target,
        offTarget: allMatches[match].home_team_statistics.off_target,
        colors: getColors(allMatches[match].home_team.code)
    }

    let homeTeamHeight = areaHeight * dataHome.ballPossesions
    let homeWidthAttempts = areaWidth / (dataHome.onTarget + dataHome.offTarget)
    let homePassWidth = (areaWidth - innerMargin) / dataHome.numPasses
    let homePassHeight = homeTeamHeight / dataHome.numPasses

    //Debug
    let center = [areaWidth - 50 * size, homeTeamHeight]

    if (allMatches[match].winner_code === allMatches[match].away_team.code) {
        c.translate(canvas.width, 0)
        c.scale(-1, 1)
    }

    // c.beginPath()
    // //console.log(center)
    // c.arc(center[0], center[1], 5 * size, 0, 2 * Math.PI, true)
    // c.fillStyle = 'red'
    // c.fill()
    c.fillStyle = dataHome.colors[0]
    drawTriange(
        {
            x: center[0],
            y: center[1] + 15 * size
        },
        {
            x: center[0] + 75 * size,
            y: center[1] - homePassHeight * dataHome.passesCompleted
        },
        {
            x: center[0] - homePassWidth * dataHome.passesCompleted,
            y: center[1] - homePassHeight * dataHome.passesCompleted
        },
        6
    )

    c.fillStyle = dataHome.colors[1]
    drawTriange(
        {
            x: center[0],
            y: center[1]
        },
        {
            x: center[0],
            y: center[1] - homeTeamHeight + innerMargin * size
        },
        {
            x: center[0] - homeWidthAttempts * dataHome.onTarget,
            y: center[1] - homeTeamHeight + innerMargin * size
        },
        -2
    )

    //Away Team
    //-------------------
    let dataAway = {
        ballPossesions:
            allMatches[match].away_team_statistics.ball_possession / 100,
        numPasses: allMatches[match].away_team_statistics.num_passes,
        passesCompleted:
            allMatches[match].away_team_statistics.passes_completed,
        onTarget: allMatches[match].away_team_statistics.on_target,
        offTarget: allMatches[match].away_team_statistics.off_target,
        colors: getColors(allMatches[match].away_team.code)
    }

    let awayTeamHeight = areaHeight * dataAway.ballPossesions
    let awayWidthAttempts = areaWidth / (dataAway.onTarget + dataAway.offTarget)
    let awayPassWidth = areaWidth / dataAway.numPasses
    let awayPassHeight = awayTeamHeight / dataAway.numPasses

    c.fillStyle = dataAway.colors[0]
    c.translate(0, -30 * size)
    drawTriange(
        {
            x: center[0],
            y: center[1] - 10 * size
        },
        {
            x: center[0],
            y: center[1] + awayPassHeight * dataAway.passesCompleted + 15 * size
        },
        {
            x: center[0] - awayPassWidth * dataAway.passesCompleted,
            y: center[1] + awayPassHeight * dataAway.passesCompleted + 15 * size
        },
        6
    )

    c.fillStyle = dataAway.colors[1]
    console.log(center[0] - awayWidthAttempts * dataAway.onTarget)
    drawTriange(
        {
            x: center[0],
            y: center[1] - 10 * size
        },
        {
            x: center[0],
            y: center[1] + awayTeamHeight + 15 * size
        },
        {
            x: Math.max(
                innerMargin + 15 * size,
                center[0] - awayWidthAttempts * dataAway.onTarget
            ),
            y: center[1] + awayTeamHeight + 15 * size
        },
        -3
    )

    // const ballPossession = new CoverDistance({
    //     x: innerMargin,
    //     y: innerMargin,
    //     width: gridWidth * 3,
    //     height: gridHeight * 5,
    //     data: data.ballPossession,
    //     color: data.color,
    //     context: c
    // })

    //objects.push(ballPossession)
}

function drawTriange(p1, p2, p3, rotate) {
    c.save()
    c.rotate((-rotate * Math.PI) / 180)
    c.translate(0, rotate * 10 * size)

    c.beginPath()
    c.moveTo(p1.x, p1.y)
    c.lineTo(p2.x, p2.y)
    c.lineTo(p3.x, p3.y)
    c.fill()

    c.restore()
}

function getColors(code) {
    return listColors[code]
}

// Animation Loop
function animate() {
    //requestAnimationFrame(animate)
    //c.clearRect(0, 0, canvas.width, canvas.height)
    objects.forEach(object => {
        object.update()
    })
}

//------------------
// DOM
// ------------------
const next = document.getElementById('next')
const prev = document.getElementById('prev')

let match = getUrlParams(window.location.href).match
if (!match) {
    match = getMatchCode(window.location.pathname)
}

console.log(
    `${allMatches[match].home_team.code} x ${allMatches[match].away_team.code}`
)

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

//------------------
// START
// ------------------

// const fontA = new FontFaceObserver('Timmons NY')
// const fontB = new FontFaceObserver('Dharma Gothic E')
// Promise.all([fontA.load(), fontB.load()]).then(function() {
init()
animate()
// })
