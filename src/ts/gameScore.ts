export class GameScore {
    bestPlayersClass: HTMLElement
    bestResults: Array<any>
    score: any

    constructor(bestPlayers) {
        this.bestPlayersClass = bestPlayers
        this.bestResults = []
    }

    init(score) {
        const duplicite = (item) => item.turn === score.turn && item.time === score.time
        if (!this.bestResults.some(duplicite)) {
            this.bestResults.push(score)

            if (!this.bestPlayersClass.hasChildNodes()) {
                this.bestResults.sort(function(a, b) {
                    return a.turn - b.turn || a.time - b.time
                })

                this.bestResults = this.bestResults.slice(0, 10)

                for (const [index, player] of this.bestResults.entries()) {
                    this.html(index, player)
                }
            }
        }
    }

    html(index, player) {
        this.bestPlayersClass.insertAdjacentHTML('beforeend', `
            <tr>
                <td>${index + 1}</td>
                <td>${player.name}</td>
                <td>${player.turn}</td>
                <td>${player.htmlTime}</td>
            </tr>
        `)
    }
}
