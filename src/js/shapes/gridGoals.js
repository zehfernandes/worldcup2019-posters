export default function(canvas, data, constraints) {
    const c = canvas.getContext('2d')
    const { innerMargin, size, direction } = constraints

    let goalSize = 2.5 * size
    let margin = 20 * size

    let initX = innerMargin + goalSize / 2,
        initY = innerMargin + 40 * size

    c.save()
    if (direction == 'away') {
        c.translate(canvas.width, canvas.height)
        c.scale(-1, -1)
    }

    let x = initX
    let y = initY
    let color = 1

    for (let i = 0; i < data.attempts; i++) {
        c.beginPath()
        c.arc(x, y, goalSize, 0, 2 * Math.PI)

        if (i >= data.goals) {
            color = 0.15
        }

        x = x + margin
        if (x > initX + goalSize + margin * 6) {
            x = initX
            y = y + margin
        }
        c.fillStyle = `rgba(0,0,0,${color})`
        c.fill()
        c.closePath()
    }

    c.restore()
}
