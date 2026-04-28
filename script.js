// ================= STORAGE =================

let tasks =
JSON.parse(localStorage.getItem("tasks")) || [];

let xp =
Number(localStorage.getItem("xp")) || 0;

let streak =
Number(localStorage.getItem("streak")) || 0;

// ================= ELEMENTS =================

const taskList =
document.getElementById("taskList");

const xpText =
document.getElementById("xp");

const streakText =
document.getElementById("streak");

const levelText =
document.getElementById("level");

// ================= INITIAL =================

xpText.innerText = xp;

streakText.innerText = streak;

// ================= LOADER =================

window.addEventListener("load",()=>{

  setTimeout(()=>{

    document.getElementById("loader")
    .style.display = "none";

  },1200);

});

// ================= CLOCK =================

setInterval(()=>{

  const now = new Date();

  document.getElementById("clock")
  .innerText =
  now.toLocaleTimeString();

},1000);

// ================= THEME =================

if(localStorage.getItem("theme")
=== "dark"){

  document.body.classList.add("dark");
}

document.getElementById("themeBtn")
.onclick = ()=>{

  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark")
    ? "dark"
    : "light"
  );
};

// ================= THEME COLORS =================

function setTheme(color){

  if(color === "blue"){
    document.documentElement
    .style.setProperty(
      "--primary",
      "#38bdf8"
    );
  }

  if(color === "purple"){
    document.documentElement
    .style.setProperty(
      "--primary",
      "#a855f7"
    );
  }

  if(color === "green"){
    document.documentElement
    .style.setProperty(
      "--primary",
      "#22c55e"
    );
  }
}

// ================= SAVE =================

function saveTasks(){

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );
}

// ================= ADD TASK =================

function addTask(){

  const task =
  document.getElementById("taskInput").value;

  const subject =
  document.getElementById("subjectInput").value;

  const priority =
  document.getElementById("priorityInput").value;

  const date =
  document.getElementById("dateInput").value;

  if(task === ""){

    toast("Enter Task");

    return;
  }

  tasks.push({

    text:task,

    subject:subject,

    priority:priority,

    date:date,

    completed:false,

    favorite:false
  });

  saveTasks();

  renderTasks();

  toast("Task Added ✅");

  document.getElementById("taskInput").value = "";

  document.getElementById("subjectInput").value = "";

  document.getElementById("dateInput").value = "";
}

// ================= RENDER =================

function renderTasks(filtered = tasks){

  taskList.innerHTML = "";

  filtered.forEach((task,index)=>{

    const li =
    document.createElement("li");

    if(task.completed){

      li.classList.add("completed");
    }

    if(task.priority === "High"){

      li.classList.add("high");
    }

    if(task.priority === "Medium"){

      li.classList.add("medium");
    }

    if(task.priority === "Low"){

      li.classList.add("low");
    }

    li.innerHTML = `

      <h3>

        ${task.favorite ? "⭐" : ""}

        ${task.text}

      </h3>

      <p>📚 ${task.subject}</p>

      <p>⚡ ${task.priority}</p>

      <p>📅 ${task.date}</p>

      <button
      onclick="completeTask(${index})">

      ✅ Complete

      </button>

      <button
      onclick="favoriteTask(${index})">

      ⭐ Favorite

      </button>

      <button
      onclick="editTask(${index})">

      ✏ Edit

      </button>

      <button
      onclick="deleteTask(${index})">

      ❌ Delete

      </button>
    `;

    taskList.appendChild(li);

    // DUE TODAY ALERT

    const today =
    new Date().toISOString()
    .split("T")[0];

    if(task.date === today
      && !task.completed){

      toast(
        `⚠ Due Today:
        ${task.text}`
      );
    }

  });

  updateCounters();

  updateChart();

  updateProductivity();

  updateLevel();

  updateBadges();

  updateSubjectAnalysis();

  updateHistory();
}

// ================= COMPLETE =================

function completeTask(index){

  tasks[index].completed =
  !tasks[index].completed;

  xp += 10;

  streak += 1;

  localStorage.setItem("xp",xp);

  localStorage.setItem(
    "streak",
    streak
  );

  xpText.innerText = xp;

  streakText.innerText = streak;

  saveTasks();

  renderTasks();

  playSound();

  confetti({

    particleCount:120,

    spread:70
  });

  toast("Task Completed 🎉");
}

// ================= FAVORITE =================

function favoriteTask(index){

  tasks[index].favorite =
  !tasks[index].favorite;

  saveTasks();

  renderTasks();

  toast("Favorite Updated ⭐");
}

// ================= DELETE =================

function deleteTask(index){

  tasks.splice(index,1);

  saveTasks();

  renderTasks();

  toast("Task Deleted ❌");
}

// ================= EDIT =================

function editTask(index){

  const updated =
  prompt(
    "Edit Task",
    tasks[index].text
  );

  if(updated){

    tasks[index].text = updated;

    saveTasks();

    renderTasks();

    toast("Task Updated ✏");
  }
}

// ================= CLEAR =================

function clearTasks(){

  if(confirm(
    "Delete All Tasks?"
  )){

    tasks = [];

    saveTasks();

    renderTasks();

    toast("All Tasks Cleared");
  }
}

// ================= COUNTERS =================

function updateCounters(){

  document.getElementById(
    "totalTasks"
  ).innerText =
  tasks.length;

  document.getElementById(
    "completedTasks"
  ).innerText =
  tasks.filter(
    task => task.completed
  ).length;

  document.getElementById(
    "pendingTasks"
  ).innerText =
  tasks.filter(
    task => !task.completed
  ).length;
}

// ================= SEARCH =================

document.getElementById(
"searchInput"
).addEventListener("keyup",(e)=>{

  const value =
  e.target.value.toLowerCase();

  const filtered =
  tasks.filter(task =>

    task.text
    .toLowerCase()
    .includes(value)
  );

  renderTasks(filtered);
});

// ================= FILTER =================

document.getElementById(
"filterInput"
).addEventListener("change",(e)=>{

  const value = e.target.value;

  if(value === "all"){

    renderTasks();

    return;
  }

  const filtered =
  tasks.filter(task =>

    value === "completed"
    ? task.completed
    : !task.completed
  );

  renderTasks(filtered);
});

// ================= SORT =================

document.getElementById(
"sortInput"
).addEventListener("change",(e)=>{

  const value = e.target.value;

  if(value === "priority"){

    tasks.sort((a,b)=>
      a.priority
      .localeCompare(b.priority)
    );
  }

  if(value === "date"){

    tasks.sort((a,b)=>
      new Date(a.date)
      - new Date(b.date)
    );
  }

  renderTasks();
});

// ================= DRAG DROP =================

new Sortable(taskList,{

  animation:150
});

// ================= POMODORO =================

let pomoTime = 1500;

let pomoInterval;

function startPomodoro(){

  clearInterval(pomoInterval);

  pomoInterval =
  setInterval(()=>{

    pomoTime--;

    let min =
    Math.floor(pomoTime / 60);

    let sec =
    pomoTime % 60;

    document.getElementById(
      "pomodoro"
    ).innerText =

    `${min}:${
      sec < 10 ? "0" : ""
    }${sec}`;

    if(pomoTime <= 0){

      clearInterval(pomoInterval);

      toast("Pomodoro Finished ⏰");

      playSound();
    }

  },1000);
}

function resetPomodoro(){

  clearInterval(pomoInterval);

  pomoTime = 1500;

  document.getElementById(
    "pomodoro"
  ).innerText = "25:00";
}

// ================= STOPWATCH =================

let stopwatchTime = 0;

let stopwatchInterval;

function startStopwatch(){

  stopwatchInterval =
  setInterval(()=>{

    stopwatchTime++;

    let h =
    Math.floor(stopwatchTime/3600);

    let m =
    Math.floor(
      (stopwatchTime%3600)/60
    );

    let s =
    stopwatchTime%60;

    document.getElementById(
      "stopwatch"
    ).innerText =

    `${h}:${m}:${s}`;

  },1000);
}

function stopStopwatch(){

  clearInterval(stopwatchInterval);
}

function resetStopwatch(){

  stopwatchTime = 0;

  document.getElementById(
    "stopwatch"
  ).innerText = "00:00:00";
}

// ================= COUNTDOWN =================

function startCountdown(){

  let minutes =
  document.getElementById(
    "countdownMinutes"
  ).value;

  let time = minutes * 60;

  const interval =
  setInterval(()=>{

    let min =
    Math.floor(time / 60);

    let sec =
    time % 60;

    document.getElementById(
      "countdown"
    ).innerText =

    `${min}:${sec}`;

    time--;

    if(time < 0){

      clearInterval(interval);

      toast(
        "Countdown Finished ⏳"
      );

      playSound();
    }

  },1000);
}

// ================= GOAL =================

function saveGoal(){

  const goal =
  document.getElementById(
    "goalInput"
  ).value;

  document.getElementById(
    "goalText"
  ).innerText =

  `Today's Goal:
  ${goal} Hours`;

  document.getElementById(
    "goalProgress"
  ).style.width = "100%";

  toast("Goal Saved 🎯");
}

// ================= NOTES =================

function saveNotes(){

  const notes =
  document.getElementById(
    "notes"
  ).value;

  localStorage.setItem(
    "notes",
    notes
  );

  toast("Notes Saved 📝");
}

document.getElementById(
"notes"
).value =
localStorage.getItem("notes")
|| "";

// ================= PRODUCTIVITY =================

function updateProductivity(){

  const completed =
  tasks.filter(
    task => task.completed
  ).length;

  const score =
  tasks.length === 0
  ? 0
  : Math.round(
    (completed/tasks.length)*100
  );

  document.getElementById(
    "productivity"
  ).innerText =

  `📈 Productivity:
  ${score}%`;
}

// ================= LEVEL =================

function updateLevel(){

  const level =
  Math.floor(xp/100)+1;

  levelText.innerText = level;
}

// ================= BADGES =================

function updateBadges(){

  const badges =
  document.getElementById(
    "badges"
  );

  badges.innerHTML = "";

  if(streak >= 7){

    badges.innerHTML +=
    "🏅 7 Day Streak<br>";
  }

  if(xp >= 100){

    badges.innerHTML +=
    "🔥 Productivity King<br>";
  }
}

// ================= CHART =================

let chart;

function updateChart(){

  const completed =
  tasks.filter(
    task => task.completed
  ).length;

  const pending =
  tasks.length - completed;

  const ctx =
  document.getElementById("chart");

  if(chart){

    chart.destroy();
  }

  chart = new Chart(ctx,{

    type:"doughnut",

    data:{

      labels:[
        "Completed",
        "Pending"
      ],

      datasets:[{

        data:[
          completed,
          pending
        ]
      }]
    }
  });
}

// ================= SUBJECT ANALYSIS =================

function updateSubjectAnalysis(){

  const analysis =
  document.getElementById(
    "subjectAnalysis"
  );

  analysis.innerHTML = "";

  const subjects = {};

  tasks.forEach(task=>{

    if(!subjects[task.subject]){

      subjects[task.subject] = 0;
    }

    if(task.completed){

      subjects[task.subject]++;
    }

  });

  for(let sub in subjects){

    analysis.innerHTML += `

      <div class="subjectBar">

        <p>${sub}</p>

        <div class="bar">

          <div class="fill"
          style="
          width:${subjects[sub]*20}%">
          </div>

        </div>

      </div>
    `;
  }
}

// ================= HISTORY =================

function updateHistory(){

  const history =
  document.getElementById(
    "history"
  );

  history.innerHTML =

  `Completed Tasks:
  ${
    tasks.filter(
      task => task.completed
    ).length
  }`;
}

// ================= WEATHER =================

let weatherVisible = false;

async function toggleWeather(){

  const weather =
  document.getElementById(
    "weather"
  );

  const btn =
  document.getElementById(
    "weatherBtn"
  );

  if(weatherVisible){

    weather.style.display = "none";

    btn.innerText =
    "🌤 Show Weather";

    weatherVisible = false;

    return;
  }

  try{

    const response =
    await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=77.20&current_weather=true"
    );

    const data =
    await response.json();

    weather.innerHTML = `

      🌡 Temperature:
      ${data.current_weather.temperature}°C

      <br>

      💨 Wind Speed:
      ${data.current_weather.windspeed} km/h
    `;

    weather.style.display =
    "block";

    btn.innerText =
    "❌ Hide Weather";

    weatherVisible = true;

  }catch{

    weather.innerHTML =
    "Weather Not Available";

    weather.style.display =
    "block";
  }
}

// ================= MUSIC =================

const music =
new Audio(
"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
);

function playMusic(){

  music.play();

  toast("Music Playing 🎵");
}

function pauseMusic(){

  music.pause();

  toast("Music Paused ⏸");
}

// ================= NOTIFICATION =================

if(Notification.permission
!== "granted"){

  Notification.requestPermission();
}

function toast(text){

  const toast =
  document.getElementById("toast");

  toast.innerText = text;

  toast.classList.add("show");

  setTimeout(()=>{

    toast.classList.remove(
      "show"
    );

  },3000);

  if(Notification.permission
  === "granted"){

    new Notification(text);
  }
}

// ================= SOUND =================

function playSound(){

  const audio =
  new Audio(
    "assets/notification.mp3"
  );

  audio.play();
}

// ================= VOICE =================

function startVoice(){

  if(
    "webkitSpeechRecognition"
    in window
  ){

    const recognition =
    new webkitSpeechRecognition();

    recognition.start();

    recognition.onresult =
    function(e){

      alert(
        e.results[0][0].transcript
      );
    };

  }else{

    alert(
      "Voice Not Supported"
    );
  }
}

// ================= SPEECH =================

function readTasks(){

  const text =
  tasks.map(
    task => task.text
  ).join(", ");

  const speech =
  new SpeechSynthesisUtterance(
    text
  );

  window.speechSynthesis
  .speak(speech);
}

// ================= CALENDAR =================

const calendar =
new FullCalendar.Calendar(

  document.getElementById(
    "calendar"
  ),

  {
    initialView:"dayGridMonth"
  }
);

calendar.render();

// ================= GSAP =================

gsap.from(".card",{

  opacity:0,

  y:30,

  duration:1,

  stagger:0.1
});

// ================= FOCUS MODE =================

function toggleFocusMode(){

  document.body
  .classList.toggle(
    "focus-mode"
  );
}

// ================= MOTIVATION =================

const quotes = [

"Push Yourself 🚀",

"Success Needs Discipline 📚",

"Small Steps Every Day 🔥",

"Never Stop Learning 💡",

"Consistency Beats Talent 🏆"
];

document.getElementById(
"quote"
).innerText =

quotes[
Math.floor(
  Math.random()*quotes.length
)
];

// ================= MENU =================

document.getElementById(
"menuBtn"
).onclick = ()=>{

  document.getElementById(
    "sidebar"
  ).classList.toggle(
    "active"
  );
};

// ================= TAB CHANGE =================

document.addEventListener(
"visibilitychange",()=>{

  if(document.hidden){

    document.title =
    "Come Back To Study 📚";

  }else{

    document.title =
    "Smart Study Planner";
  }
});

// ================= SHORTCUT =================

document.addEventListener(
"keydown",(e)=>{

  if(e.ctrlKey
    && e.key === "n"){

    e.preventDefault();

    document.getElementById(
      "taskInput"
    ).focus();
  }
});

// ================= SERVICE WORKER =================

if("serviceWorker"
in navigator){

  window.addEventListener(
    "load",()=>{

    navigator.serviceWorker
    .register("./sw.js");
  });
}

// ================= INITIAL =================

renderTasks();