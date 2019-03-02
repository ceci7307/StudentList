"use strict";

window.addEventListener("DOMContentLoaded", init);

let listTemplate = document.querySelector("#list-template");
let listContainer = document.querySelector(".container");
let currentFilter;
let sortFilter;
let allStudents = [];
let liste = [];
let houseColor;

const Stud = {
  fullname: "-fullname-",
  firstname: "-firstname-",
  lastname: "-lastname-",
  picname: "-billede-",
  house: "-student house-",
  setJSONdata(studentData) {
    this.fullname = studentData.fullname;
    const parts = studentData.fullname.split(" ");
    this.firstname = parts[0];
    this.lastname = parts[parts.length - 1];
    this.house = studentData.house;
    const lastNameLower = parts[parts.length - 1].toLowerCase();
    const firstLetterLower = parts[0].substring(0, 1).toLowerCase();
    this.picname = `images/${lastNameLower}_${firstLetterLower}.png`;
  }
};

function init() {
  document
    .querySelector("#filter-Hufflepuff")
    .addEventListener("click", filterHufflepuff);
  document
    .querySelector("#filter-Gryffindor")
    .addEventListener("click", filterGryffindor);

  document
    .querySelector("#filter-Ravenclaw")
    .addEventListener("click", filterRavenclaw);
  document
    .querySelector("#filter-Slytherin")
    .addEventListener("click", filterSlytherin);

  document.querySelector("#all").addEventListener("click", backToAll);

  document
    .querySelector("#sortByFirstname")
    .addEventListener("click", sortFname);
  document.querySelector("#sortByLast").addEventListener("click", sortLname);
  //document.querySelector("#sortByHouse").addEventListener("click", sortHname);

  document
    .querySelector(".filter-knap")
    .addEventListener("click", dropdownFunc);
  document
    .querySelector(".sorter-knap")
    .addEventListener("click", dropdownFunc2);
  getJSON();
}

// Hent json

async function getJSON() {
  console.log("getJSON");
  const dataJson = await fetch(
    "https://petlatkea.dk/2019/hogwarts/students.json"
  );
  const myJSON = await dataJson.json();
  prepareObjects(myJSON);
}

function prepareObjects(myJSON) {
  console.log("prepareObjects");

  myJSON.forEach(studentData => {
    const stud = Object.create(Stud);
    stud.setJSONdata(studentData);

    allStudents.push(stud);
  });
  filterList();
}

function backToAll() {
  currentFilter = " ";
  filterList();
}

function filterHufflepuff() {
  console.log("filterHufflepuff");
  currentFilter = "Hufflepuff";
  filterList();
}
function filterGryffindor() {
  console.log("filterGryffindor");
  currentFilter = "Gryffindor";
  filterList();
}

function filterRavenclaw() {
  console.log("filterRavenclaw");
  currentFilter = "Ravenclaw";
  filterList();
}

function filterSlytherin() {
  console.log("filterSlytherin");
  currentFilter = "Slytherin";
  filterList();
}

function onlyHufflepuff(person) {
  return person.house === "Hufflepuff";
}

function onlyGryffindor(person) {
  return person.house === "Gryffindor";
}

function onlyRavenclaw(person) {
  return person.house === "Ravenclaw";
}

function onlySlytherin(person) {
  return person.house === "Slytherin";
}

function filterList() {
  console.log("filterList");
  let liste = allStudents;

  if (currentFilter === "Hufflepuff") {
    liste = allStudents.filter(onlyHufflepuff);
  } else if (currentFilter === "Gryffindor") {
    liste = allStudents.filter(onlyGryffindor);
  } else if (currentFilter === "Ravenclaw") {
    liste = allStudents.filter(onlyRavenclaw);
  } else if (currentFilter === "Slytherin") {
    liste = allStudents.filter(onlySlytherin);
  }
  //let liste = allStudents.filter(onlyHufflepuff);
  displayList(liste);
}

function sortFname() {
  sortFilter = "firstname";
  sortList();
}
function sortLname() {
  sortFilter = "lastname";
  sortList();
}
function sortHname() {
  sortFilter = "house";
  sortList();
}

function sortList() {
  console.log("sortList");
  let sorted;
  if (sortFilter === "") {
    sorted = allStudents;
  }
  if (sortFilter === "firstname") {
    sorted = allStudents.sort(firstnameSort);
  }
  if (sortFilter === "lastname") {
    sorted = allStudents.sort(lastnameSort);
  }
  //if (sortFilter === "house") {
  //sorted = allStudents.sort(houseSort);
  //}
  //displayList(sorted);
  filterList();
}

function firstnameSort(a, b) {
  if (a.firstname < b.firstname) {
    return -1;
  } else {
    return 1;
  }
}
function lastnameSort(a, b) {
  if (a.lastname < b.lastname) {
    return -1;
  } else {
    return 1;
  }
}
//function houseSort(a, b) {
// if (a.house < b.house) {
//  return -1;
//} else {
//  return 1;
//}
//}

function displayList(liste) {
  console.log("displayList");
  document.querySelector(".container").textContent = " ";
  // Viser og kloner
  liste.forEach(person => {
    let klon = listTemplate.cloneNode(true).content;
    klon.querySelector(".data-navn").textContent = person.fullname;
    klon.querySelector(".data-house").textContent = person.house;
    //klon.querySelector("img").src = ?

    klon.querySelector(".data-navn").addEventListener("click", () => {
      visModal(person);
    });
    listContainer.appendChild(klon);
  });
}

// SCRIPT MODAL
function visModal(personen) {
  let modal = document.querySelector("#modal");
  modal.classList.add("vis");
  modal.querySelector(".modal-navn").textContent = personen.fullname;
  modal.querySelector(".modal-house").textContent = personen.house;
  houseColor = personen.house.toLowerCase();
  document.querySelector("#modal-content").classList.add(houseColor);

  modal.querySelector(".modal-picture").src = personen.picname;
  modal.querySelector(".modal-picture").alt = `Picture of ${personen.fullname}`;

  modal.querySelector(".luk").addEventListener("click", skjulModal);
}
function skjulModal() {
  modal.classList.remove("vis");
  document.querySelector("#modal-content").classList.remove(houseColor);
  filterList();
}

function dropdownFunc() {
  document.querySelector(".filterKnapper").classList.toggle("showButton");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches(".filter-knap")) {
    let dropdowns = document.querySelector(".filterKnapper");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("showButton")) {
        openDropdown.classList.remove("showButton");
      }
    }
  }
};

function dropdownFunc2() {
  document.querySelector(".sortKnapper").classList.toggle("showButton");
}

window.onclick = function(event) {
  if (!event.target.matches(".sorter-knap")) {
    let dropdowns = document.querySelector(".sortKnapper");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("showButton")) {
        openDropdown.classList.remove("showButton");
      }
    }
  }
};
