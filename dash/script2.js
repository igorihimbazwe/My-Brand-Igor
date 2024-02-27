const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");
const imageInput = document.getElementById("image-input");

const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};

const addOrUpdateTask = () => {
  addOrUpdateTaskBtn.innerText = "Add Blog";
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  const taskObj = {
    id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: titleInput.value,
    date: dateInput.value,
    description: descriptionInput.value,
    imageUrl:
      imageInput.files.length > 0
        ? URL.createObjectURL(imageInput.files[0])
        : "",
  };

  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj;
  }

  localStorage.setItem("data", JSON.stringify(taskData));
  updateTaskContainer();
  reset();
};

const updateTaskContainer = () => {
  tasksContainer.innerHTML = "";
  const date = new Date();
  var current_time =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

  taskData.forEach(({ id, title, date, description, imageUrl }) => {
    tasksContainer.innerHTML += `
        <div class="task" id="${id}">
          <img src="${imageUrl}" alt="Task Image" />
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Author:</strong> ${date}</p>
          <p><strong>Date:</strong> ${current_time}</p>
          
          <strong>Description:</strong> 
          <details>
          <summary>Read more</summary>
          <p>${description}</p> 
          </details>
                 
          <button onclick="editTask(this)" type="button" class="btn">Edit</button>
          <button onclick="deleteTask(this)" type="button" class="btn">Delete</button> 

          
        </div>
      `;
  });
};

const deleteTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  buttonEl.parentElement.remove();
  taskData.splice(dataArrIndex, 1);
  localStorage.setItem("data", JSON.stringify(taskData));
};

const editTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  currentTask = taskData[dataArrIndex];

  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;

  addOrUpdateTaskBtn.innerText = "Update Blog";

  taskForm.classList.toggle("hidden");
};

const reset = () => {
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  imageInput.value = ""; // Clear input file value
  document.getElementById("image-preview").src = ""; // Clear image preview
  taskForm.classList.toggle("hidden");
  currentTask = {};
};

if (taskData.length) {
  updateTaskContainer();
}

openTaskFormBtn.addEventListener("click", () =>
  taskForm.classList.toggle("hidden")
);

closeTaskFormBtn.addEventListener("click", () => {
  const formInputsContainValues =
    titleInput.value ||
    dateInput.value ||
    descriptionInput.value ||
    imageInput.value;
  const formInputValuesUpdated =
    titleInput.value !== currentTask.title ||
    dateInput.value !== currentTask.date ||
    descriptionInput.value !== currentTask.description ||
    (imageInput.files.length > 0 &&
      imageInput.files[0].name !== currentTask.imageUrl);

  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
});

cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset();
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addOrUpdateTask();
});

imageInput.addEventListener("change", (e) => {
  const imagePreview = document.getElementById("image-preview");
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.src = "";
  }
});

// adding chart

var chart = new ej.charts.Chart({
  tooltip: { enable: true },
  background: " #ada4a4",
  //Initializing Primary X Axis
  primaryXAxis: {
    valueType: "Category",
  },
  //Initializing Primary Y Axis
  primaryYAxis: {
    title: "In number",
  },
  //Initializing Chart Series
  series: [
    {
      type: "Column",
      dataSource: [
        { country: "Blogs", medal: 50 },
        { country: "Messages", medal: 40 },
        { country: "Users", medal: 70 },
        { country: "Subscribers", medal: 60 },
        { country: "Likes", medal: 30 },
      ],
      xName: "country",
      yName: "medal",
      fill: "#4a4943",
    },
  ],
});
chart.appendTo("#center-left");
