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
    c.fillText(homeTeamText, innerMargin + 30 * size, innerMargin)

    c.save()
    c.translate(innerMargin, innerMargin)
    c.rotate(-0.5 * Math.PI)
    c.font = `${8 * size}px \'Helvetica Neue\'`
    c.fillStyle = '#000'
    c.textBaseline = 'middle'
    c.textAlign = 'right'
    c.fillText('FRANCE 2019', -25 * size, 0)
    c.fillText('WOMENS WORLD CUP', -25 * size, 12 * size)
    c.restore()

    //AWAY
    c.save()
    let awayTeamText = allMatches[match].away_team_country.toUpperCase()
    c.translate(canvas.width - innerMargin, canvas.height - titleSize)
    c.rotate(-1 * Math.PI)
    c.font = `600 ${titleSize}px 'Helvetica Neue'`
    c.fillStyle = '#000'
    c.textBaseline = 'middle'
    c.textAlign = 'center'

    c.fillText(
        awayTeamText,
        c.measureText(awayTeamText).width / 2 + 40 * size,
        innerMargin
    )
    c.restore()

    c.save()
    let locationText = allMatches[match].location.toUpperCase()
    c.translate(canvas.width - innerMargin, canvas.height - innerMargin)
    c.rotate(-0.5 * Math.PI)
    c.font = `${8 * size}px \'Helvetica Neue\'`
    c.fillStyle = '#000'
    c.textBaseline = 'middle'
    c.textAlign = 'left'
    c.fillText('JUNE 6 2019', 40 * size, -22 * size)
    c.fillText(locationText, 40 * size, -10 * size)
    c.restore()

    //return
    innerMargin = 60 * size

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
        colors: getColors(allMatches[match].home_team.code),
        passAccurancy: allMatches[match].home_team_statistics.pass_accuracy,
        distance: allMatches[match].home_team_statistics.distance_covered
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
    c.translate(20 * size, 60 * size)

    c.fillStyle = dataHome.colors[0]
    drawTriange(
        {
            x: center[0] + 30 * size,
            y: center[1] + 20 * size
        },
        {
            x: center[0] + 60 * size,
            y: center[1] - homePassHeight * dataHome.passesCompleted - 20 * size
        },
        {
            x: center[0] - homePassWidth * dataHome.passesCompleted,
            y:
                center[1] -
                homePassHeight * dataHome.passesCompleted +
                dataHome.passAccurancy * size
        },
        6
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
        goals: allMatches[match].away_team.goals,
        colors: getColors(allMatches[match].away_team.code),
        distance: allMatches[match].away_team_statistics.distance_covered
    }

    let awayTeamHeight = areaHeight * dataAway.ballPossesions
    let awayWidthAttempts = areaWidth / (dataAway.onTarget + dataAway.offTarget)
    let awayPassWidth = areaWidth / dataAway.numPasses
    let awayPassHeight = awayTeamHeight / dataAway.numPasses

    c.fillStyle = dataAway.colors[0]
    c.translate(15 * size, -40 * size)
    drawTriange(
        {
            x: center[0],
            y: center[1]
        },
        {
            x: center[0] + 50 * size,
            y: center[1] + awayPassHeight * dataAway.passesCompleted + 5 * size
        },
        {
            x: Math.max(
                innerMargin,
                center[0] - awayPassWidth * dataAway.passesCompleted
            ),
            y: center[1] + awayPassHeight * dataAway.passesCompleted + 30 * size
        },
        6
    )

    c.fillStyle = dataHome.colors[1]
    drawTriange(
        {
            x: center[0],
            y: center[1] + 70 * size
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

    c.fillStyle = dataAway.colors[1]
    console.log(center[0] - awayWidthAttempts * dataAway.onTarget)
    drawTriange(
        {
            x: center[0] - 10 * size,
            y: center[1] - 20 * size
        },
        {
            x: center[0] - 80 * size,
            y: center[1] + awayTeamHeight + 10 * size
        },
        {
            x: Math.max(
                innerMargin + 80 * size,
                center[0] - awayWidthAttempts * dataAway.onTarget - 80 * size
            ),
            y: center[1] + awayTeamHeight - 20 * size
        },
        -3
    )

    // Distance ball
    //--------------------
    //c.translate(-10 * size, -10 * size)
    drawHashBall(
        center[0] - 52 * size,
        center[1] - 52 * size,
        dataHome.distance * size * 0.7
    )
    drawHashBall(center[0], center[1], dataAway.distance * size * 0.7)
}

function drawHashBall(x, y, radius) {
    c.save()
    c.beginPath()
    c.strokeStyle = 'transparent'
    c.arc(x, y, radius, 0, 2 * Math.PI)
    let hashX = x - radius
    let hashY = y - radius
    let hashSize = radius
    c.strokeStyle = '#000'
    c.clip()
    c.beginPath()
    for (let i = 0; i < 30 * size; i++) {
        c.moveTo(hashX, hashY)
        c.lineTo(hashX + hashSize * 2, hashY)
        hashY = hashY + 3 * size
    }
    c.stroke()
    c.restore()
}

function drawTriange(p1, p2, p3, rotate) {
    c.save()
    //c.translate(canvas.width, canvas.height)
    //c.rotate((-rotate * Math.PI) / 180)
    //c.translate(0, rotate * 10 * size)

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
