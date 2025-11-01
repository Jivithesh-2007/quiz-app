class QuizzA {
    static DATA_QUIZZA = [
        {
            question: "How to declare a variable in JS?",
            options: ["let", "var", "const", "All of them"],
            answer: 4,
        },
        {
            question: "Have you learn something new everyday?",
            options: ["Always", "Nope", "Sometime", "Never"],
            answer: 1,
        },
        {
            question: "Amazing Quizza, right?",
            options: ["Absolutely", "Nope"],
            answer: 1,
        },
    ];

    static CONTROL_CLASSES = {
        btnControl: "btn-js",
        startBtn: "startBtn-js",
        answerBtn: "answerBtn-js",
        question: "question-js",
        optionsAnswer: "options-js",
        score: "score-js",
        progress: "progress-js",
        progressTarget: "progress_target-js",
        timer: "timer-js",
    };

    static TARGET_LIST = {
        id: "target-id",
        action: "target-action",
    };

    constructor() {
        // quiz data and status
        this.dataQuizza = QuizzA.DATA_QUIZZA;
        this.totalQuiz = QuizzA.DATA_QUIZZA.length;
        this.currentQuizza = 1;
        this.statusQuizza = false;
        this.scoreQuizza = 0;
        this.scoreScale = 5;

        this.correctAnswer = 0;
        this.incorrectAnswer = 0;
        this.invalidAnswer = 0;

        // setup time limit
        this.timeLimit = 10; // seconds
        this.timeInterval;

        // controls
        this.controls = QuizzA.CONTROL_CLASSES;
        this.targets = QuizzA.TARGET_LIST;

        this.questionBlock = document.getElementById(this.controls.question);
        this.answerOption = document.getElementById(this.controls.optionsAnswer);
        this.answerBtn = document.getElementById(this.controls.answerBtn);
        this.timerBlock = document.getElementById(this.controls.timer);
        this.scoreBlock = document.getElementById(this.controls.score);

        // this.eventBtnControl();
        this.startQuizza();
        this.answerQuizza();
    }

    loadQuizza({ idQuizza }) {
        this.answerBtn.setAttribute("disabled", "");
        const question = this.dataQuizza[idQuizza - 1]["question"];
        this.questionBlock.innerHTML = question;

        this.createAnswerOptions({ idQuizza: idQuizza });

        this.scoreBlock.innerHTML = `${Number(this.scoreQuizza.toFixed(2))}/${this.scoreScale} points`;
    }
    createAnswerOptions({ idQuizza }) {
        const options = this.dataQuizza[idQuizza - 1]["options"];

        this.answerOption.innerHTML = "";

        for (let i = 0; i < options.length; i++) {
            let divOption = document.createElement("div");
            let input = document.createElement("input");
            input.type = "radio";
            input.name = "answer";
            input.value = i + 1;
            input.id = `answer-${i + 1}`;
            divOption.classList.add("quizza__option");
            let label = document.createElement("label");
            let textLabel = document.createTextNode(options[i]);
            label.setAttribute("for", `answer-${i + 1}`);
            label.appendChild(textLabel);
            divOption.appendChild(input);
            divOption.appendChild(label);
            this.answerOption.appendChild(divOption);

            input.addEventListener("change", (event) => {
                this.answerBtn.removeAttribute("disabled");
            });
        }
    }

    checkAnswer() {
        clearInterval(this.timeInterval);

        let userAnswer = document.querySelector("input[name='answer']:checked");
        console.log(userAnswer);

        if (userAnswer != null && !isNaN(parseInt(userAnswer.value))) {
            const correctAnswer = this.dataQuizza[this.currentQuizza - 1]["answer"];
            if (parseInt(userAnswer.value) === correctAnswer) {
                this.scoreQuizza = this.scoreQuizza + this.scoreScale / this.totalQuiz;
                this.correctAnswer++;
            } else {
                this.incorrectAnswer++;
            }
        } else {
            this.invalidAnswer++;
        }
        this.currentQuizza++;

        if (this.currentQuizza > this.totalQuiz) {
            this.questionBlock.innerHTML =
                "Congrat! You have finished the Quizza. Your score is: " +
                Number(this.scoreQuizza.toFixed(2)) +
                `
                <br/>
                Correct answer: ${this.correctAnswer} <br/>
                Incorect answer: ${this.incorrectAnswer} <br />
                You did not answer or entered invalid answer: ${this.invalidAnswer}
            `;
            this.timerBlock.innerHTML = "";
            this.answerOption.innerHTML = "";
            this.scoreBlock.innerHTML = `${Number(this.scoreQuizza.toFixed(2))}/${this.scoreScale} points`;
            this.statusQuizza = false;
            this.answerBtn.setAttribute("disabled", "");
        } else {
            this.loadQuizza({ idQuizza: this.currentQuizza });
            this.timeLimit = 10;
            this.setupTimer(this.timerBlock);
        }
    }
    answerQuizza() {
        this.answerBtn.addEventListener("click", (event) => {
            if (this.statusQuizza) {
                this.checkAnswer();
                this.setupProgressBar({ isAnswered: true });
                this.scoreBlock.innerHTML = `${Number(this.scoreQuizza.toFixed(2))}/${this.scoreScale}`;
            }
        });
    }
    startQuizza() {
        const startBtn = document.getElementById(this.controls.startBtn);
        startBtn.addEventListener("click", () => {
            if (this.statusQuizza == false && this.currentQuizza == 1) {
                this.statusQuizza = true;
                this.setupProgressBar({ isAnswered: false });
                this.loadQuizza({ idQuizza: this.currentQuizza });
                startBtn.setAttribute("disabled", "");
                this.setupTimer(this.timerBlock);
            }
        });
    }

    setupProgressBar({ isAnswered }) {
        const progressBar = document.getElementById(this.controls.progress);
        progressBar.style.display = "block";

        let speedBar = progressBar.getAttribute("data-speed");
        let percentBar, percentText;

        let progressTarget = document.querySelectorAll(`.${this.controls.progressTarget}`);
        progressTarget.forEach((item) => {
            let target = item.getAttribute(this.targets.id);

            if (target == "steps") {
                item.innerHTML = `${this.currentQuizza - 1}/${this.totalQuiz}`;
            }
            if (target == "bar") percentBar = item;
            if (target == "percent") percentText = item;
        });

        if (isAnswered == true) {
            let percent = ((this.currentQuizza - 1) * 100) / this.totalQuiz;
            this.setupAnimateProgress({
                percent: parseInt(percent),
                speedBar: speedBar,
                percentBar: percentBar,
                percentText: percentText,
            });
        }
    }
    setupAnimateProgress({ percent, speedBar, percentBar, percentText }) {
        let optionsAnimate = {
            startValue: 0,
            endValue: percent,
            speed: speedBar,
        };

        // get previous start value for animate
        if (this.currentQuizza > 2) {
            let lastStartValue = ((this.currentQuizza - 2) * 100) / this.totalQuiz;
            optionsAnimate.startValue = parseInt(lastStartValue);
        }

        // setup animate
        let percenAnimate = setInterval(() => {
            parseInt(optionsAnimate.startValue++);
            percentBar.style.width = `${optionsAnimate.startValue}%`;
            percentText.textContent = `${optionsAnimate.startValue}%`;

            if (optionsAnimate.startValue == optionsAnimate.endValue) {
                clearInterval(percenAnimate);
            }
        }, optionsAnimate.speed);
    }

    setupTimer(containerTimer) {
        containerTimer.innerHTML = "";
        this.timeInterval = setInterval(() => {
            this.timeLimit--;
            containerTimer.textContent = `Time left: ${this.timeLimit} seconds`;
            if (this.timeLimit == 0) {
                clearInterval(this.timeInterval);
                this.checkAnswer();
                this.setupProgressBar({ isAnswered: true });
            }
        }, 1000);
    }

    // my first thing idea for use one class for 2 action buttons but it seem not really good :p, just for test and save here, think may be can use this way in another project
    eventBtnControl() {
        let btnControls = document.querySelectorAll(`.${this.controls.btnControl}`);
        btnControls.forEach((btn) => {
            let action = btn.getAttribute(QuizzA.TARGET_LIST.action);
            btn.addEventListener("click", (event) => {
                // check if action start and status is false / not begin the quiz => start quiz
                if (action == "start" && this.statusQuizza == false) {
                    this.statusQuizza = true;
                    console.log(action);
                    this.loadQuizza({ idQuizza: this.currentQuizza });
                    btn.setAttribute("disabled", "");
                    this.eventBtnControl(); // call back to reload state button
                }
            });
        });
    }
}
const quizz = new QuizzA();
