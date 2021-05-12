
const mainNavButton = document.querySelector(".main-nav__toggle");
const header = document.querySelector(".page-header");
const mainNav = document.querySelector(".main-nav");

function initPage() {
  mainNav.classList.remove("main-nav--nojs");
  mainNav.classList.remove("main-nav--opened");
  mainNav.classList.add("main-nav--closed");
  header.classList.remove("page-header--opened");
}

function menuToggle() {
  mainNavButton.addEventListener("click", function () {
    header.classList.toggle("page-header--opened");
    mainNav.classList.toggle("main-nav--opened");
    mainNav.classList.toggle("main-nav--closed");
  });
}

initPage();
menuToggle();
