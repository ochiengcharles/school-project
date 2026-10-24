/* Supabase-backed public forms. Requires supabase-js v2 and supabase-client.js. */
(function () {
  const client = window.schoolSupabase;
  if (!client) return;

  function showStatus(form, message, isError) {
    let status = form.querySelector("[data-form-status]");
    if (!status) {
      status = document.createElement("p");
      status.dataset.formStatus = "true";
      status.setAttribute("role", "status");
      status.style.marginTop = "12px";
      form.appendChild(status);
    }
    status.textContent = message;
    status.style.color = isError ? "#b00020" : "#176b36";
  }

  const admissionsForm = document.querySelector("#admissionsForm");
  if (admissionsForm) {
    admissionsForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const button = admissionsForm.querySelector('button[type="submit"]');
      const fileInput = admissionsForm.querySelector('input[type="file"]');
      const file = fileInput && fileInput.files[0];
      const allowed = ["application/pdf", "image/jpeg", "image/png"];
      if (!file) return showStatus(admissionsForm, "Please attach a report card.", true);
      if (!allowed.includes(file.type) || file.size > 5 * 1024 * 1024) {
        return showStatus(admissionsForm, "Choose a PDF, JPG or PNG file up to 5 MB.", true);
      }
      const originalText = button ? button.textContent : "";
      if (button) { button.disabled = true; button.textContent = "Submitting…"; }
      try {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = "incoming/" + crypto.randomUUID() + "-" + safeName;
        const upload = await client.storage.from("admissions-documents").upload(path, file, {
          cacheControl: "3600", upsert: false, contentType: file.type
        });
        if (upload.error) throw upload.error;
        const value = id => admissionsForm.querySelector("#" + id)?.value?.trim() || "";
        const result = await client.from("admissions_applications").insert([{
          full_name: value("fullname"),
          date_of_birth: value("dob"),
          gender: value("gender"),
          home_address: value("address"),
          phone_number: value("phone"),
          email: value("email"),
          previous_school: value("previousschool"),
          class_applied: value("classapply"),
          report_card_path: path,
          status: "pending"
        }]);
        if (result.error) {
          await client.storage.from("admissions-documents").remove([path]);
          throw result.error;
        }
        admissionsForm.reset();
        showStatus(admissionsForm, "Application submitted successfully. The school will contact you using the details provided.", false);
      } catch (error) {
        console.error("Admissions submission failed:", error);
        showStatus(admissionsForm, "We could not submit your application. Please try again later or contact the school office.", true);
      } finally {
        if (button) { button.disabled = false; button.textContent = originalText; }
      }
    });
  }

  const contactForm = document.querySelector("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const button = contactForm.querySelector('button[type="submit"]');
      const originalText = button ? button.textContent : "";
      if (button) { button.disabled = true; button.textContent = "Sending…"; }
      try {
        const value = name => contactForm.querySelector('[name="' + name + '"]')?.value?.trim() || "";
        const result = await client.from("contact_messages").insert([{
          name: value("name"), email: value("email"),
          subject: value("subject"), message: value("message")
        }]);
        if (result.error) throw result.error;
        contactForm.reset();
        showStatus(contactForm, "Your message has been sent. Thank you for contacting St Peter's Nkokonjeru SS.", false);
      } catch (error) {
        console.error("Contact submission failed:", error);
        showStatus(contactForm, "We could not send your message. Please try again or contact the school directly.", true);
      } finally {
        if (button) { button.disabled = false; button.textContent = originalText; }
      }
    });
  }
})();