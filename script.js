function App() {
    const [breakLength, setBreakLength] = React.useState(5)
    const [sessionLength, setSessionLength] = React.useState(25)
    const [countdown, setCountdown] = React.useState(25*60)
    const [active, setActive] = React.useState(false)
    const [onBreak, setOnBreak] = React.useState(false)

    const convertToTime = (count) => {
        let minutes = Math.floor(count/60);
        let seconds = count % 60;
        seconds = seconds < 10 ? ('0' + seconds) : seconds;
        minutes = minutes < 10 ? ('0' + minutes) : minutes;
        let display = `${minutes}:${seconds}`;
        return display
    }

    const decrementBreak = (count) => {
        if (breakLength !== 1) {
            setBreakLength(count - 1)} 
    }

    const incrementBreak = (count) => {
        if (breakLength !== 60) {
            setBreakLength(count + 1)}
            
    }

    const decrementSession = (count) => {
        if (sessionLength !== 1) {
            setSessionLength(count - 1);
            setCountdown((count*60) - 60)
        }
    }

    const incrementSession = (count) => {
        if (sessionLength !== 60) {
            setSessionLength(count + 1);
            setCountdown((count*60) + 60)
        }
    }

    const startCountdownTimer = () => {
        let onBreakVar = onBreak;
        if (active === false) {
            let interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 0 && !onBreakVar) {
                        setOnBreak(true)
                        onBreakVar = true;
                        playSound();
                        
                        
                        return (breakLength*60);
                    } else if (onBreakVar && prev <= 0) {
                        setOnBreak(false)
                        onBreakVar = false;
                        playSound();
                        
                        return (sessionLength*60)
                    }
                    changeColor();
                    return prev - 1;
                });    
            }, 1000);
            localStorage.clear();
            localStorage.setItem("interval-id", interval)
            document.getElementById("start_stop").textContent = "pause";
        }
        else if (active === true) {
            clearInterval(localStorage.getItem("interval-id"));
            document.getElementById("start_stop").textContent = "play"
        } 
        setActive(!active)
    }

    const playSound = () => {
        const audioTag = document.getElementById("beep");
        audioTag.currentTime = 0;
        audioTag.play()
    }

    
    const changeColor = () => {
        let root = document.querySelector(":root");
        let s = getComputedStyle(root);
        let gradient1 = parseFloat(s.getPropertyValue("--gradient1"));
        if (document.getElementById("timer-label").textContent === "Break") {
                gradient1 = gradient1 - (100/(breakLength*60));
                root.style.setProperty('--gradient1', `${gradient1}%`);
        } else if (document.getElementById("timer-label").textContent === "Session"){
                gradient1 = gradient1 + (100/countdown);
                root.style.setProperty('--gradient1', `${gradient1}%`);
            }
        }

    const resetTimer = () => {
        setBreakLength(5);
        setSessionLength(25);
        clearInterval(localStorage.getItem("interval-id"));
        document.getElementById("start_stop").textContent = "play/pause";
        setActive(false)
        setCountdown(25*60);
        setOnBreak(false)
        const audioTag = document.getElementById("beep");
        audioTag.pause();
        audioTag.currentTime = 0;
        document.querySelector(":root").style.setProperty('--gradient1', `${0}%`);
    }

    return (
    <div id="container" className="">
        <h1>25 + 5 Clock</h1>
        <div className="container ">
            <div class="row row-cols-2">
                <div id="break-label" className="col-6 h3 mb-0">Break Length</div>
                <div id="session-label" className="col-6 h3 mb-0">Session Length</div>
                <div className="col-2 position-relative">
                    <button className="position-absolute end-0" id="break-decrement" onClick={() => {decrementBreak(breakLength)}} disabled={active}><i class="fa fa-arrow-down"></i></button>
                </div>
                <div id="break-length" className="col-2 h3">
                    {breakLength}
                </div>
                <div className="col-2 position-relative">
                    <button className="position-absolute start-0" id="break-increment" onClick={() => {incrementBreak(breakLength)}} disabled={active}><i class="fa fa-arrow-up"></i></button>
                </div>
                <div className="col-2 position-relative">
                    <button className="position-absolute end-0" id="session-decrement" onClick={() => {decrementSession(sessionLength)}} disabled={active}><i class="fa fa-arrow-down"></i></button>
                </div>
                <div id="session-length" className="col-2 h3">
                    {sessionLength}
                </div>
                <div className="col-2 position-relative">
                    <button className="position-absolute start-0" id="session-increment" onClick={() => {incrementSession(sessionLength)}} disabled={active}><i class="fa fa-arrow-up"></i></button>
                </div>
            </div>
        </div>
        <div id="timerbox">
            <div className="h2" id="timer-label">
                {onBreak ? "Break" : "Session"}
            </div>
            <div className="h1" id="time-left">
                {convertToTime(countdown)}
            </div>
            
        </div>
        <div className="pt-4">
            <button id="start_stop" onClick={startCountdownTimer}>play/pause</button>
            <button id="reset" onClick={resetTimer}>reset</button>
        </div>
        <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
    </div>
    )
}

ReactDOM.render(
    <App />, document.getElementById("app")
)