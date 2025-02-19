//?Fireworks when all tasks completed
let Confetti = () => {
  const duration = 15 * 300,
    animationEnd = Date.now() + duration,
    defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }
  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 50 * (timeLeft / duration);
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
};

//?prepare elements
let taskInput = document.getElementById("input-area"),
  addTaskBtn = document.getElementById("btn"),
  tasksContainer = document.querySelector(".tasks-container"),
  emptyImage = document.querySelector(".empty-image"),
  progressBar = document.getElementById("progress"),
  progressNumbers = document.getElementById("numbers");

//?toggle image 
let toggleEmptyImg = () => {
  emptyImage.style.display =
    tasksContainer.children.length === 0 ? "block" : "none";
};

//?update progress bar
let updateProgress = (checkCompletion = true) => {
  let totalTasks = tasksContainer.children.length;
  let completedTasks = tasksContainer.querySelectorAll(".checkbox:checked").length;
  progressBar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : "0%";
  progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;

  if (checkCompletion && totalTasks > 0 && completedTasks === totalTasks) {
    Confetti();
  }
};
//?save to local storage
let saveTasksToLocalStorage = () => {
  let tasks = Array.from(tasksContainer.querySelectorAll("li")).map((li) => ({
    text: li.querySelector("span").textContent,
    completed: li.querySelector(".checkbox").checked,
  }));
  localStorage.setItem("Tasks", JSON.stringify(tasks));
};

//?load from local storage
let loadTasksFromLocalStorage = () => {
  let savedTasks = JSON.parse(localStorage.getItem("Tasks")) || [];
  savedTasks.forEach(({ text, completed }) => {
    addTask(text, completed, false);
  });
  toggleEmptyImg()
  updateProgress()
};

//?Tasks function
let addTask = (text, completed = false, checkCompletion = true) => {
  let taskText = text || taskInput.value.trim();
  if (!taskText) {
    alert("Add a Task");
  } else {
    let li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${completed ? "checked" : ""}>
      <span>${taskText}</span>
      <div class="task-btns">
      <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
      <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
      </div> 
      `;

    //?delete task
    li.querySelector(".delete-btn").addEventListener("click", () => {
      li.remove();
      toggleEmptyImg();
      updateProgress();
      saveTasksToLocalStorage();
    });

    //?complete task
    let checkbox = li.querySelector(".checkbox");
    let editBtn = li.querySelector(".edit-btn");
    if (completed) {
      li.classList.add("completed");
      editBtn.disable = true;
      editBtn.style.opacity = "0.5";
      editBtn.style.pointerEvents = "none";
    }

    checkbox.addEventListener("change", () => {
      let isChecked = checkbox.checked;
      li.classList.toggle("completed", isChecked);
      editBtn.disabled = isChecked;
      editBtn.style.opacity = isChecked ? "0.5" : "1";
      editBtn.style.pointerEvents = isChecked ? "none" : "auto";
      updateProgress();
      saveTasksToLocalStorage();
    });
    //?edit task
    editBtn.addEventListener("click", () => {
      if (!checkbox.checked) {
        taskInput.value = li.children[1].innerHTML;
        li.remove();
        toggleEmptyImg();
        updateProgress(false);
        saveTasksToLocalStorage();
      }
    });

    tasksContainer.append(li);
    taskInput.value = "";
    toggleEmptyImg();
    updateProgress(checkCompletion);
    saveTasksToLocalStorage();
  }
};
//?add Tasks on click
addTaskBtn.addEventListener("click", () => {
  addTask();
  toggleEmptyImg();
});
//?add Tasks on press enter
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
    toggleEmptyImg();
  }
});

loadTasksFromLocalStorage()