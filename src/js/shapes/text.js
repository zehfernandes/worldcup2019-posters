export default function drawText(canvas, data, constraints) {
    const c = canvas.getContext('2d')
    const { innerMargin, size } = constraints

    let titleSize = 20 * size
    let alignOptical = 3 * size

    c.font = `600 ${titleSize}px 'Helvetica Neue'`
    c.fillStyle = '#000'
    c.textBaseline = 'middle'
    c.textAlign = 'left'
    c.fillText(
        data.homeTeam,
        innerMargin - alignOptical,
        innerMargin + titleSize / 2
    )

    c.save()
    c.translate(canvas.width - innerMargin, canvas.height - innerMargin)
    c.rotate(-1 * Math.PI)
    c.font = `600 ${titleSize}px 'Helvetica Neue'`
    c.fillStyle = '#000'
    c.textBaseline = 'middle'
    c.textAlign = 'center'

    c.fillText(
        data.awayTeam,
        c.measureText(data.awayTeam).width / 2 - alignOptical,
        +titleSize / 2
    )
    c.restore()

    // ------------------------------

    let smallTextSize = 8
    let lineHeight = 12

    c.save()
    c.translate(innerMargin, canvas.height - innerMargin)
    c.rotate(-0.5 * Math.PI)
    c.font = `${smallTextSize * size}px \'Helvetica Neue\'`
    c.fillStyle = '#000'
    c.textBaseline = 'middle'
    c.textAlign = 'left'
    c.fillText(data.time, 0, smallTextSize / 2)
    c.fillText(data.location, 0, smallTextSize / 2 + lineHeight * size)
    c.restore()

    c.save()
    c.translate(canvas.width - innerMargin, innerMargin)
    c.rotate(0.5 * Math.PI)
    c.font = `${smallTextSize * size}px \'Helvetica Neue\'`
    c.fillStyle = '#000'
    c.textBaseline = 'middle'
    c.textAlign = 'left'
    c.fillText('FRANCE 2019', 0, smallTextSize / 2)
    c.fillText('WOMENS WORLD CUP', 0, smallTextSize / 2 + lineHeight * size)
    c.restore()
}
