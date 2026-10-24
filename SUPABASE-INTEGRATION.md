# St Peter's Nkokonjeru SS — Supabase integration

## Added pages and scripts
- `supabase-client.js`: shared browser client using the project's publishable key.
- `forms.js`: handles admissions submissions and contact messages.
- `teacher-reports.html`: teacher sign-in and report upload interface.
- `parent-reports.html`: parent/guardian sign-in and report viewing interface.

## Connect the existing forms
1. In `application form.html`, add `id="admissionsForm"` to the admissions `<form>`, remove the FormSubmit `action`, and remove the hidden `_captcha` and `_next` inputs.
2. In `contact us.html`, add `id="contactForm"` to the contact form.
3. On both pages, immediately before `</body>`, add:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   <script src="supabase-client.js"></script>
   <script src="forms.js"></script>
   ```
4. Confirm the Supabase table and column names used in `forms.js` match the project schema before accepting live submissions.

## Expected schema used by the browser code
- `admissions_applications`: `full_name, date_of_birth, gender, home_address, phone_number, email, previous_school, class_applied, report_card_path, status`.
- `contact_messages`: `name, email, subject, message`.
- `student_reports`: `admission_number, academic_year, term, file_path, uploaded_by` plus an ID and creation timestamp.

If your existing schema differs, update the field mapping rather than creating duplicate tables blindly.

## Required security checks before launch
- Keep `admissions-documents` and `student-report-cards` private.
- Never expose a Supabase `service_role` key in HTML or JavaScript. The publishable key is designed for browser use only when Row Level Security (RLS) is correctly configured.
- Enable RLS on every table. Public form policies should permit only the minimum necessary insert fields; do not allow public reads of admissions or contact records.
- Teacher report upload must be restricted to authenticated teachers and students assigned to them. Guardian report reads must require authentication and a verified guardian-to-student relationship. Admission number alone is not proof of access.
- Ensure the storage policies enforce the same access rules as the database policies; a private bucket and signed URLs are required.
- Create teacher and guardian accounts through the trusted admin process. Do not permit public self-registration to grant staff privileges.
- Test with dummy records and accounts before using real student information.

## Deployment note
The pages use relative paths, so deploy them alongside the existing school website files. These files are committed to the feature branch; review and merge the branch before publishing. The public form integration is not complete until the existing form pages are wired up and the schema/policies are tested end-to-end.
