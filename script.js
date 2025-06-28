//sorting function

function sortTodos() {
  const sortValue = document.getElementById("sort").value;
  const tbody = document.querySelector("#todos tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));
   
  if (sortValue === "sort-all") {
    window.location.reload(); 
    return;
  }


  const completeRows=[];
  const incompleteRows=[];

  rows.forEach(row=>{
    const textDecor =row.cells[0].style.textDecoration;
    if(textDecor.includes("line-through")){
      completeRows.push(row);
    }
    else{
      incompleteRows.push(row);
    }
  });


    const rowData =incompleteRows.map(row => {
    const cells = row.querySelectorAll("td");
    return {
      title: cells[0].innerText.toLowerCase(),
      deadline: cells[1].innerText,
      category: cells[2].innerText.toLowerCase(),
      element: row
    };
  });
 
  if (sortValue === "deadline") {
    rowData.sort((a, b) => {
      const [d1, m1, y1] = a.deadline.split("-").map(Number);
      const [d2, m2, y2] = b.deadline.split("-").map(Number);
      const dateA = new Date(y1, m1 - 1, d1);
      const dateB = new Date(y2, m2 - 1, d2);
      return dateA - dateB;
    });
  } else if (sortValue === "alphabet") {
    rowData.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortValue === "category") {
    rowData.sort((a, b) => a.category.localeCompare(b.category));
  }

  tbody.innerHTML = "";
  rowData.forEach(item => tbody.appendChild(item.element));
  completeRows.forEach(row=>
    tbody.appendChild(row)
  );
}


//filter function

function filterTodos() {
  const filterValue = document.getElementById("filter").value;
  const tbody = document.querySelector("#todos tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));

  
  rows.forEach(row => {
    const categoryText = row.cells[2].innerText.trim().toLowerCase();

    if (filterValue === "category-all") {
      row.style.display = "";
    } else if (filterValue === "category-personal") {
      row.style.display = categoryText === "personal" ? "" : "none";
    } else if (filterValue === "category-work") {
      row.style.display = categoryText === "work" ? "" : "none";
    } else if (filterValue === "category-study") {
      row.style.display = categoryText === "studies" ? "" : "none";
  }});
}




//delete function

function deleteTodo(icon){
  const row = icon.closest("tr");
  const title = row.cells[0].innerText.trim();
  const deadline = row.cells[1].innerText.trim();
  const category = row.cells[2].innerText.trim();
  
  row.remove();
  

  //let todos =JSON.parse(localStorage.getItem("todos"))||[];
  todos= todos.filter(todo=>
    todo.title!==title ||
    todo.deadline!==deadline||
    todo.category!==category
  );
  localStorage.setItem("todos",JSON.stringify(todos));
  window.location.reload();

}

//function to highlight task based on deadline

function getDaysLeft(dateStr){
  const [y,m,d] = dateStr.split("-").map(Number);
  const today =new Date();
  const deadline= new Date(y,m-1,d);
  today.setHours(0,0,0,0);
  deadline.setHours(0,0,0,0);
  const diff = deadline-today;
  return Math.ceil(diff/(1000*60*60*24));
}


//finish functiion

  function finishTodo(icon) {
    
    const row = icon.closest("tr");
    const title = row.cells[0].innerText.trim();
    const deadline = row.cells[1].innerText.trim();
    const category = row.cells[2].innerText.trim();
    

    todos = todos.map(todo =>
      todo.title === title &&
      todo.deadline === deadline &&
      todo.category === category? { ...todo, completed: true }: todo
    );

    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
   
};

function renderTodos(){
  const tbody = document.querySelector("#todos tbody");
 if(tbody){
    tbody.innerHTML=""
  }
  const incomplete = todos.filter(todo => ! todo.completed);
  const completed = todos.filter(todo =>  todo.completed);
  const all = [...incomplete,...completed];

  all.forEach((todo)=>{
  //function to highlight row based on deadline
    const daysLeft = getDaysLeft(todo.deadline);
    let colorStyle ="";
    if(daysLeft < 0) {
      colorStyle = "background-color:red;";
    }
    else if(daysLeft >= 0 && daysLeft <= 2){
      colorStyle= "background-color:orange;";
    }
    else if(daysLeft >= 3 && daysLeft <= 5){
      colorStyle= "background-color:yellow;";
    }

    const strikeStyle = todo.completed?'text-decoration:line-through;':'';
    const combinedstyle =`${strikeStyle} ${colorStyle}`.trim();

    const row = document.createElement("tr");
    row.innerHTML =
    ` <td style="${combinedstyle}">${todo.title}</td>
      <td style="${combinedstyle}">${todo.deadline}</td>
      <td style="${combinedstyle}">${todo.category}</td>
      <td " ${combinedstyle}">
              <i class="fa-solid fa-pen" style="color: #74C0FC;cursor:pointer;" onclick="edit_Todo(this)"></i>

        <i class="fa-solid fa-check" style="color: #0ff560;cursor:pointer;" onclick="finishTodo(this)"></i>
        <i class="fa-solid fa-trash" style="color: #7a6e43;cursor:pointer;" onclick="deleteTodo(this)"></i>
      </td>`;
    tbody.appendChild(row); 
    updateStatus();
  });
}


//function -> status update

function updateStatus(){
  const total = todos.length;
  const completed =todos.filter(todo=>todo.completed).length;
  const pending=total-completed;
  document.getElementById("total-count").textContent=total;
  document.getElementById("completed-count").textContent=completed;
  document.getElementById("pending-count").textContent=pending;
}


// function->report page navigation
function goToReportPage(){
  const reportType = document.getElementById("report").value;
  if (reportType=== "weekly"){
    window.location.href = "report1.html";
  }
  else if (reportType=== "monthly"){
    window.location.href = "report2.html";
  }
}


//function->weekly report

function weekSelect() {
  const weeks = document.getElementById("weeks").value;
  const statusContainer = document.getElementById("week-status");
  if (statusContainer){
       statusContainer.innerHTML = "";
  }
                                                                                         
  const [startStr, endStr] = weeks.split("_to_");
  const startDate = new Date(startStr);
  const endDate = new Date(endStr);
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  const weeklyTodos = todos.filter(todo => {
    const [y, m, d] = todo.deadline.split("-").map(Number);
    const todoDate = new Date(y, m - 1, d);
    return todoDate >= startDate && todoDate <= endDate;
  });
  const completed = weeklyTodos.filter(todo => todo.completed).length;
  const total = weeklyTodos.length;
  const pending = total - completed;

  statusContainer.innerHTML = `
    <h3>Status for ${startStr} to ${endStr}</h3>
     <table border="1px"  class="week-table" >
            <thead>
                <th>TOTAL TASK</th>
                <th>COMPLETED</th>
                <th>PENDING</th>
            </thead>
            <tbody>
                <td>${total}</td>
                <td>${completed}</td>
                <td>${pending}</td>
            </tbody>
        </table>
  `;
}


//function->month wise report

function monthSelect(){
  const months=document.getElementById("months").value;
  statusContainer=document.getElementById("month-status");
  if(statusContainer){
    statusContainer.innerHTML="";
  }
  const [startStr,endStr] = months.split("_to_");
  const startDate = new Date(startStr);
  const endDate = new Date(endStr);
  const monthName= startDate.toLocaleString("default",{month:"long"});
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  const monthlyTodos =todos.filter(todo=>{
    const[y,m,d] =todo.deadline.split("-").map(Number);
    const todoDate=new Date(y ,m-1,d);
    return todoDate>=startDate&&endDate>=todoDate;
  })
  
  const total =monthlyTodos.length;
  const completed =monthlyTodos.filter(todo=>todo.completed===true).length;
  const pending =total-completed;

  statusContainer.innerHTML=`
  <h2>Status for ${monthName} 2025</h2>
  <table border="1px"  class="week-table">
            <thead>
                <td>TOTAL TASK</td>
                <td>COMPLETED</td>
                <td>PENDING</td>
            </thead>
            <tbody>
                <td>${total}</td>
                <td>${completed}</td>
                <td>${pending}</td>
            </tbody>
        </table>
  `
}

//edit fn

function edit_Todo(icon) {
  const row = icon.closest("tr");
  const rows = Array.from(tbody.querySelectorAll("tr"));
  const index =rows.indexOf(row);
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  const todo =todos[index];
  localStorage.setItem("index",JSON.stringify(index));
  localStorage.setItem("todo",JSON.stringify(todo));
  window.location.href="editTodo.html";


  
      
  
}






renderTodos();



