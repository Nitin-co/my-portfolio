 const nameInput = document.getElementById("GroceryName");
    const placeInput = document.getElementById("PlaceBought");
    const addBtn = document.getElementById("addBtn");
    const groceryBody = document.getElementById("groceryBody");
    const countSpan = document.getElementById("count");
    const clearAllBtn = document.getElementById("clearAllBtn");

    function updateCount() {
      countSpan.textContent = groceryBody.children.length;
    }

    function saveList() {
      localStorage.setItem("groceryList", groceryBody.innerHTML);
    }

    addBtn.addEventListener("click", function () {
      const name = nameInput.value.trim();
      const place = placeInput.value.trim();
      const date = new Date().toLocaleDateString();

      if (name === "" || place === "") {
        alert("Please fill in both these fields");
        return;
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="name">${name}</td>
        <td class="place">${place}</td>
        <td class="date">${date}</td>
        <td>
          <button class="doneBtn">Done</button>
          <button class="editBtn">Edit</button>
          <button class="deleteBtn">Delete</button>
        </td>
      `;

      groceryBody.appendChild(tr);
      updateCount();
      saveList();

      nameInput.value = "";
      placeInput.value = "";
    });

    groceryBody.addEventListener("click", function (e) {
      const tr = e.target.closest("tr");

      if (e.target.classList.contains("doneBtn")) {
        tr.classList.toggle("done");
        saveList();
      }

      if (e.target.classList.contains("deleteBtn")) {
        tr.remove();
        updateCount();
        saveList();
      }

      if (e.target.classList.contains("editBtn")) {
        const nameTd = tr.querySelector(".name");
        const placeTd = tr.querySelector(".place");

        const nameInput = document.createElement("input");
        const placeInput = document.createElement("input");
        nameInput.value = nameTd.textContent;
        placeInput.value = placeTd.textContent;

        nameTd.replaceWith(nameInput);
        placeTd.replaceWith(placeInput);

        e.target.textContent = "Save";
        e.target.classList.remove("editBtn");
        e.target.classList.add("saveBtn");
      }

      else if (e.target.classList.contains("saveBtn")) {
        const inputs = tr.querySelectorAll("input");
        const nameInput = inputs[0];
        const placeInput = inputs[1];

        const nameTd = document.createElement("td");
        nameTd.className = "name";
        nameTd.textContent = nameInput.value;

        const placeTd = document.createElement("td");
        placeTd.className = "place";
        placeTd.textContent = placeInput.value;

        nameInput.replaceWith(nameTd);
        placeInput.replaceWith(placeTd);

        e.target.textContent = "Edit";
        e.target.classList.remove("saveBtn");
        e.target.classList.add("editBtn");
        saveList();
      }
    });

    clearAllBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to clear the entire list?")) {
        groceryBody.innerHTML = "";
        updateCount();
        saveList();
      }
    });

    window.addEventListener("DOMContentLoaded", () => {
      groceryBody.innerHTML = localStorage.getItem("groceryList") || "";
      updateCount();
    });