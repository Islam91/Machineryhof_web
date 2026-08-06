(function () {
  "use strict";

  /* ---------------- Mobile navigation toggle ---------------- */
  var header = document.querySelector(".site-header");
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("main-nav");

  if (navToggle && header && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.addEventListener("click", function (event) {
      if (event.target.tagName === "A" && header.classList.contains("nav-open")) {
        header.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------------- Contact form validation ---------------- */
  var form = document.getElementById("contactForm");
  if (!form) return;

  var successMessage = document.getElementById("formSuccess");
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var fields = {
    name: {
      input: document.getElementById("name"),
      error: document.getElementById("name-error"),
      validate: function (value) {
        return value.trim().length > 0 ? "" : "Please enter your name.";
      }
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("email-error"),
      validate: function (value) {
        if (value.trim().length === 0) return "Please enter your email address.";
        if (!emailPattern.test(value.trim())) return "Please enter a valid email address.";
        return "";
      }
    },
    message: {
      input: document.getElementById("message"),
      error: document.getElementById("message-error"),
      validate: function (value) {
        return value.trim().length > 0 ? "" : "Please enter a message.";
      }
    }
  };

  function validateField(field) {
    var message = field.validate(field.input.value);
    var row = field.input.closest(".form-row");
    field.error.textContent = message;
    row.classList.toggle("has-error", Boolean(message));
    field.input.setAttribute("aria-invalid", message ? "true" : "false");
    return message === "";
  }

  Object.keys(fields).forEach(function (key) {
    var field = fields[key];
    field.input.addEventListener("blur", function () {
      validateField(field);
    });
    field.input.addEventListener("input", function () {
      var row = field.input.closest(".form-row");
      if (row.classList.contains("has-error")) {
        validateField(field);
      }
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var isValid = true;
    Object.keys(fields).forEach(function (key) {
      if (!validateField(fields[key])) isValid = false;
    });

    if (!isValid) {
      var firstInvalid = form.querySelector(".has-error input, .has-error textarea");
      if (firstInvalid) firstInvalid.focus();
      successMessage.hidden = true;
      return;
    }

    successMessage.hidden = false;
    form.reset();
    Object.keys(fields).forEach(function (key) {
      fields[key].input.closest(".form-row").classList.remove("has-error");
      fields[key].error.textContent = "";
    });
    successMessage.focus && successMessage.focus();
  });
})();
