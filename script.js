const STOPER_STATE_STOPPED = "STOPER_STATE_STOPPED";
const STOPER_STATE_PLAYING = "STOPER_STATE_PLAYING";
const STOPER_STATE_PAUSED = "STOPER_STATE_PAUSED";

class Stoper {
	constructor() {
		this.currentState = STOPER_STATE_STOPPED;
		this.intervalId = null;
		this.time = document.querySelector(".stopwatch");
		this.stopTime = document.querySelector(".time");
		this.playBtn = document.querySelector(".start");
		this.pauseBtn = document.querySelector(".pause");
		this.stopBtn = document.querySelector(".stop");
		this.resetBtn = document.querySelector(".reset");
		this.historyBtn = document.querySelector(".historyBtn");
		this.timeList = document.querySelector(".time-list");
		this.secondsElapsed = 0;
		this.historyRecords = [];
		this.index = 0;
		this.pauseBtn.disabled = true;
		this.noRecordsInfo = document.querySelector(".errorInfo");
		this.historySection = document.querySelector(".history")
		this.infoBtn = document.querySelector("p.info");
		this.modal = document.querySelector(".modal-shadow");
		this.colorChangeBtn = document.querySelector(".color");
	}

	init() {
		this.playBtn.addEventListener("click", this.handlePlayBtn.bind(this));
		this.pauseBtn.addEventListener("click", this.handlePauseBtn.bind(this));
		this.stopBtn.addEventListener("click", this.handleStopBtn.bind(this));
		this.resetBtn.addEventListener("click", this.handleResetBtn.bind(this));
		this.historyBtn.addEventListener("click", this.handleHistoryBtn.bind(this));
		this.infoBtn.addEventListener("click", this.handleModalShow.bind(this));
		this.colorChangeBtn.addEventListener(
			"click",
			this.handleColorChange.bind(this)
		);
	}

	renderTime() {
		const minutes = Math.floor(this.secondsElapsed / 60);
		let seconds = this.secondsElapsed % 60;
		if (seconds < 10) {
			seconds = `0${seconds}`;
		}
		this.time.textContent = `${minutes}:${seconds}`;
	}

	intervalHandler() {
		this.secondsElapsed++;
		this.renderTime();
	}

	handlePlayBtn() {
		if (this.currentState === STOPER_STATE_PLAYING) {
			return;
		}
		this.currentState = STOPER_STATE_PLAYING;
		this.disablePauseBtn();

		this.intervalId = setInterval(this.intervalHandler.bind(this), 1000);
		console.log(this.time.textContent);
	}

	handlePauseBtn() {
		this.currentState = STOPER_STATE_PAUSED;
		clearInterval(this.intervalId);
	}

	handleStopBtn() {
		if (this.secondsElapsed === 0) {
			this.pauseBtn.disabled = true;
			return;
		}
		this.currentState = STOPER_STATE_STOPPED;
		this.disablePauseBtn();
		clearInterval(this.intervalId);
		this.stopTime.innerHTML = `Ostatni czas: ${this.time.textContent}`;
		console.log(this.stopTime);
		this.historyRecords.push(this.time.textContent);
		console.log(this.historyRecords);
		this.secondsElapsed = 0;
		this.stopTime.style.visibility = "visible";
		this.createRecordsList();
		this.renderTime();
	}

	disablePauseBtn() {
		this.pauseBtn.disabled = this.currentState !== STOPER_STATE_PLAYING;
	}

	createRecordsList() {
		const record = document.createElement("li");
		this.timeList.append(record);
		record.textContent = `Pomiar numer ${this.index + 1}: ${
			this.historyRecords[this.index]
		}`;
		this.index++;
		this.history();
	}

	handleResetBtn() {
		this.currentState = STOPER_STATE_STOPPED;
		clearInterval(this.intervalId);
		this.historyRecords = [];
		this.index = 0;
		this.timeList.innerHTML = "";
		this.time.textContent = `0:00`;
		this.secondsElapsed = 0;
		this.stopTime.style.visibility = "hidden";
		this.historyBtn.style.backgroundColor = "transparent";
		this.noRecordsInfo.style.display = "block";
		this.historySection.classList.remove('showHistory');
		this.disablePauseBtn();
	}

	history() {
		if (this.historyRecords.length === 0) {
			this.noRecordsInfo.style.display = "block";
			this.timeList.style.display = "none";
		} else {
			this.timeList.style.display = "flex";
			this.noRecordsInfo.style.display = "none"
		}
	}

	handleHistoryBtn() {
		this.historySection.classList.toggle('showHistory');

		if (this.historySection.classList.contains("showHistory")) {
			this.historyBtn.style.backgroundColor = "var(--first-color)";
			this.historyBtn.style.color = "#343434";
		} else {
			this.historyBtn.style.backgroundColor = "transparent";
			this.historyBtn.style.color = "#c2c2c2";
		}
	}

	handleModalShow() {
		this.modal.style.display = "block";
		this.modal.classList.add("modal-animation");
		const closeBtn = document.querySelector("button.close");
		closeBtn.addEventListener("click", () => {
			this.modal.style.display = "none";
		});
	}

	handleColorChange() {
		const colorPanel = document.querySelector(".color-panel");
		colorPanel.classList.toggle("show");
		const root = document.querySelector(":root");
		const circles = document.querySelectorAll(".circle");

		for (let circle of circles) {
			circle.addEventListener("click", () => {
				const color = circle.dataset.value;
				root.style.setProperty("--first-color", color);
			});
		}
	}
}
const timeMeasure = new Stoper();
timeMeasure.init();
