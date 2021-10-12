import { CARDS, CARDS_BG } from './memoryCards'
import { StopWatch } from './stopWatch'
import { GameScore } from './gameScore'
import shuffle from 'lodash/shuffle'

class MemoryGame {
    cards: Array<any>
    doubleCards: Array<any>
    memory: any
    cardsClass: HTMLElement
    cardsFromDOM: Array<HTMLElement>
    cardChosen: Array<string>
    cardChosenId: Array<number>
    countOfTurnClass: any
    countOfTurn: number
    messageClass: HTMLElement
    bestPlayersClass: HTMLElement
    stopWatch: any
    gameScore: any

    constructor(cards, memory) {
        this.cards = cards
        this.doubleCards = []
        this.memory = memory
        this.cardsClass = memory.querySelector('.cards')
        this.cardsFromDOM = []
        this.cardChosen = []
        this.cardChosenId = []
        this.countOfTurnClass = memory.querySelector('.count-of-turn')
        this.countOfTurn = 0
        this.messageClass = memory.querySelector('.message')
        this.bestPlayersClass = memory.querySelector('.best-players')
        this.stopWatch = new StopWatch(memory.querySelector('.stop-watch'))
        this.gameScore = new GameScore(memory.querySelector('.best-players tbody'))
        this.init()

        if (this.messageClass) {
            this.messageClass.addEventListener('click', (e) => {
                if ((<HTMLElement>e.target).classList.contains('start-new-game')) {
                    this.startNewGame()
                }

                if ((<HTMLElement>e.target).classList.contains('save-game')) {
                    this.saveGame()
                }
            })
        }
    }

    saveGame() {
        if (this.nickValue()) {
            const score = {
                turn: this.countOfTurn,
                time: this.stopWatch.gameTime,
                htmlTime: this.stopWatch.scoreHtml(),
                name: this.memory.querySelector('.nick-for-game').value,
            }

            this.gameScore.init(score)
            this.messageClass.textContent = ''
            this.bestPlayersClass.classList.remove('d-none')
            this.messageClass.insertAdjacentHTML('beforeend', `
                <button class='start-new-game btn btn-primary text-center'>Play again</button>
            `)
        } else {
            this.messageClass.insertAdjacentHTML('beforeend', `
            <div class="alert alert-danger" role="alert">
                Enter your nickname
            </div>
            `)
        }
    }

    startNewGame():void {
        this.bestPlayersClass.classList.add('d-none')
        this.memory.querySelector('.best-players tbody').textContent = ''
        this.stopWatch.reset()
        this.stopWatch.print()
        this.messageClass.textContent = ''
        this.init()
    }

    nickValue(): any {
        if (<HTMLInputElement> this.memory.querySelector('.nick-for-game')) {
            if ((<HTMLInputElement> this.memory.querySelector('.nick-for-game')).value) {
                return true
            } else {
                return false
            }
        }
    }

    init: Function = (): void => {
        this.countOfTurn = 0
        this.countOfTurnClass.textContent = this.countOfTurn
        this.doubleCards = shuffle([...this.cards, ...this.cards])

        for (const [index] of this.doubleCards.entries()) {
            this.cardHtml(index)
        }

        this.cardsFromDOM = Array.from(this.cardsClass.querySelectorAll('img'))

        this.cardsFromDOM.forEach(card => {
            card.addEventListener('click', () => {
                this.stopWatch.start()
                if (this.cardChosenId.length < 2 && !card.dataset.show) {
                    this.flipCard(card)
                }
            })
        })
    }

    flipCard: Function = (card): void => {
        card.dataset.show = true
        const cardId: number = ~~card.getAttribute('data-id')
        this.cardChosen.push(this.doubleCards[cardId].name)
        this.cardChosenId.push(cardId)
        card.setAttribute('src', this.doubleCards[cardId].img)

        if (this.cardChosen.length % 2 === 0) {
            setTimeout(() => this.checkForMatch(), 500)
        }
    }

    checkForMatch(): void {
        if (this.cardChosen[0] === this.cardChosen[1] && this.cardChosenId[0] !== this.cardChosenId[1]) {
            this.setSrc(this.cardChosenId[0], CARDS_BG.finish)
            this.setSrc(this.cardChosenId[1], CARDS_BG.finish)
        } else {
            this.setSrc(this.cardChosenId[0], CARDS_BG.blank)
            this.setSrc(this.cardChosenId[1], CARDS_BG.blank)
            this.datasetToggle(this.cardChosenId[0], '')
            this.datasetToggle(this.cardChosenId[1], '')
        }

        this.cardChosen = []
        this.cardChosenId = []
        this.countOfTurnClass.textContent = ++this.countOfTurn

        const datasetShow = item => item.dataset.show
        if (this.cardsFromDOM.every(datasetShow)) {
            this.finishGame()
        }
    }

    finishGame: Function = (): void => {
        this.stopWatch.stop()
        this.cardsClass.textContent = ''
        this.messageClass.insertAdjacentHTML('beforeend', `
            <div class="pt-5">
                <h1>Congratulations! You won</h1>
                <p class="fs-3">Count of turn: <span class="text-secondary">${this.countOfTurn}</span></p>
                <p class="fs-3">Game time: <span class="text-secondary">${this.stopWatch.scoreHtml()}</span></p>
                <div class="input-group mb-3 mt-5">
                    <input type="text" class="form-control nick-for-game" placeholder="Enter your nickname"
                    aria-label="Recipient's username" aria-describedby="button-addon2">
                    <button class="save-game btn btn-success" type="button" id="button-addon2">Save</button>
                    <button class="start-new-game btn btn-primary text-center">Play again</button>
                </div>
            </div>
        `)
    }

    datasetToggle(id: number, value: string): void {
        this.cardsFromDOM[id].dataset.show = value
    }

    setSrc(id: number, image: string): void {
        this.cardsFromDOM[id].setAttribute('src', image)
    }

    cardHtml(index: Number): void {
        this.cardsClass.insertAdjacentHTML(
            'beforeend',
            `<img src='${CARDS_BG.blank}' data-id='${index}' data-show='' class="border">`,
        )
    }
}

window.addEventListener('DOMContentLoaded', () => {
    for (const memory of document.querySelectorAll('.memory-card')) {
        const memoryGame = function() {
            return new MemoryGame(CARDS, memory)
        }
        memoryGame()
    }
})
