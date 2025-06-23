function sortTodos() {
  const sortValue = document.getElementById("sort").value;
  const tbody = document.querySelector("#todos tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));

  if (sortValue === "sort-all") {
    window.location.reload(); 
    return;
  }

  const rowData = rows.map(row => {
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
      const [d1, m1, y1] = a.deadline.split("/").map(Number);
      const [d2, m2, y2] = b.deadline.split("/").map(Number);
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

  let todos =JSON.parse(localStorage.getItem("todos"))||[];
  todos= todos.filter(todo=>
    todo.title!==title ||
    todo.deadline!==deadline||
    todo.category!==category
  );
  localStorage.setItem("todos",JSON.stringify(todos));

}





