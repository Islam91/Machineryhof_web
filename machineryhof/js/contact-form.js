(function () {
  var form = document.getElementById("contactForm");

  if (!form) {
    return;
  }

  var statusBox = document.getElementById("formStatus");

  var requiredFields = [
    "firstName",
    "lastName",
    "email",
    "company",
    "inquiryType",
    "message"
  ];

  function fieldWrapper(name) {
    var input = form.elements[name];
    return input ? input.closest(".field") : null;
  }

  function showFieldError(name, show) {
    var wrapper = fieldWrapper(name);
    if (wrapper) {
      wrapper.classList.toggle("has-error", show);
    }
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validate() {
    var valid = true;

    requiredFields.forEach(function (name) {
      var input = form.elements[name];
      var value = input ? input.value.trim() : "";
      var fieldValid = value.length > 0;

      if (fieldValid && name === "email") {
        fieldValid = isValidEmail(value);
      }

      showFieldError(name, !fieldValid);
      if (!fieldValid) {
        valid = false;
      }
    });

    return valid;
  }

  function setStatus(kind, message) {
    if (!statusBox) {
      return;
    }
    statusBox.textContent = message;
    statusBox.classList.remove("is-success", "is-error");
    statusBox.classList.add("is-visible", kind === "success" ? "is-success" : "is-error");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validate()) {
      setStatus("error", "Please fill in all required fields with valid values before sending.");
      return;
    }

    var payload = {
      firstName: form.elements.firstName.value.trim(),
      lastName: form.elements.lastName.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      company: form.elements.company.value.trim(),
      inquiryType: form.elements.inquiryType.value,
      productInterest: form.elements.productInterest.value,
      message: form.elements.message.value.trim()
    };

    var submitButton = form.querySelector("button[type='submit']");
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Request failed");
        }
        return response.json();
      })
      .then(function () {
        setStatus("success", "Thank you! We'll respond within 24 hours.");
        form.reset();
      })
      .catch(function () {
        setStatus(
          "error",
          "We couldn't send your message right now. Please email sales@machineryhof.com instead."
        );
      })
      .finally(function () {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Send Inquiry";
        }
      });
  });
})();
