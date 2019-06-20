import listColors from '../data/colors.js'

function getColors(code) {
    return listColors[code]
}

function getGameHour(dateString) {
    let a = new Date(dateString)
    let hour = a.getHours()

    if (hour <= 9) return 0
    if (hour > 9 && hour <= 16) return 30
    if (hour >= 19) return 50
}

function getDateString(dateString) {
    let a = new Date(dateString)
    let months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ]
    let year = a.getFullYear()
    let month = months[a.getMonth()]
    let date = a
        .getDate()
        .toString()
        .padStart(2, '0')
    return `${date} ${month} ${year}`.toUpperCase()
}

export default function(data) {
    let dataGeneral = {
        winner: data.winner_code,
        homeTeam: data.home_team_country.toUpperCase(),
        awayTeam: data.away_team_country.toUpperCase(),
        location: data.location.toUpperCase(),
        time: getDateString(data.datetime).toUpperCase(),
        gameHour: getGameHour(data.datetime)
    }
    let dataHome = {
        code: data.home_team.code,
        ballPossesions: data.home_team_statistics.ball_possession / 100,
        numPasses: data.home_team_statistics.num_passes,
        passesCompleted: data.home_team_statistics.passes_completed,
        passAccurancy: data.home_team_statistics.pass_accuracy,
        tackles: data.home_team_statistics.tackles,

        attempts: data.home_team_statistics.attempts_on_goal,
        onTarget: data.home_team_statistics.on_target,
        offTarget: data.home_team_statistics.off_target,

        goals: data.home_team.goals,
        colors: getColors(data.home_team.code),
        distance: data.home_team_statistics.distance_covered,

        clearances: data.home_team_statistics.clearances
    }

    let dataAway = {
        ballPossesions: data.away_team_statistics.ball_possession / 100,
        numPasses: data.away_team_statistics.num_passes,
        passesCompleted: data.away_team_statistics.passes_completed,
        passAccurancy: data.away_team_statistics.pass_accuracy,
        tackles: data.away_team_statistics.tackles,

        attempts: data.away_team_statistics.attempts_on_goal,
        onTarget: data.away_team_statistics.on_target,
        offTarget: data.away_team_statistics.off_target,

        goals: data.away_team.goals,
        colors: getColors(data.away_team.code),
        distance: data.away_team_statistics.distance_covered
    }

    return {
        dataGeneral,
        dataHome,
        dataAway
    }
}
