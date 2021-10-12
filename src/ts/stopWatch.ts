export class StopWatch {
    watch: HTMLElement
    running: boolean
    times: Array< number >
    time: number
    displayClass: HTMLElement

    gameTime: number

    constructor(watch) {
        this.watch = watch
        this.running = false
        this.displayClass = watch.querySelector('.stop-watch-display')
        this.times = []
        this.time = 0
        this.reset()
        this.print()

        this.gameTime = 0
    }

    start(): void {
        if (!this.time) {
            this.time = performance.now()
            this.gameTime = performance.now()
        }
        if (!this.running) {
            this.running = true
            requestAnimationFrame(this.step.bind(this))
        }
    }

    stop(): void {
        this.running = false
        this.time = 0
        this.gameTime = performance.now() - this.gameTime
    }

    reset(): void {
        this.times = [0, 0, 0]
    }

    score(): Array< number > {
        return this.times
    }

    scoreHtml(): any {
        return this.format(this.times)
    }

    step(timestamp): void {
        if (!this.running) return
        this.calculate(timestamp)
        this.time = timestamp
        this.print()
        requestAnimationFrame(this.step.bind(this))
    }

    calculate(timestamp): void {
        const diff = timestamp - this.time
        // Hundredths of a second are 100 ms
        this.times[2] += diff / 10
        // Seconds are 100 hundredths of a second
        if (this.times[2] >= 100) {
            this.times[1] += 1
            this.times[2] -= 100
        }
        // Minutes are 60 seconds
        if (this.times[1] >= 60) {
            this.times[0] += 1
            this.times[1] -= 60
        }
    }

    print(): void {
        this.displayClass.innerText = this.format(this.times)
    }

    format(times): string {
        return `\
            ${times[0].toString().padStart(2, 0)} :\
            ${times[1].toString().padStart(2, 0)} :\
            ${times[2].toString().split('.')[0].padStart(2, 0)}
        `
    }
}
