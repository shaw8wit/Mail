# Mail
Single-page-app email client using JavaScript and Django API's.

## Getting Started
+ clone or download the repo and ```cd``` into the directory.
+ Run ```python manage.py makemigrations mail``` to make migrations for the ```mail``` app.
+ Run ```python manage.py migrate``` to apply migrations to your database.
+ Run ```python manage.py runserver``` to run the server in your local machine.

## Specifications
+ Single page responsive mail client.
+ User can register and login to the website.
+ After logging in user can send and receive emails.
+ ```Inbox```, ```Compose```, ```Sent```, and ```Archive``` are the views that are available.
+ In ```Inbox``` mails can be:
  + Viewed fully.
  + Archived.
  + Replied to.
  + Marked as read automatically on opening mail.
+ In ```Sent``` mails can be:
  + Viewed fully.
  + Replied to.
+ In ```Archive``` mails can be:
  + Unarchived.

### API's
+ ```GET /emails/<str:mailbox>``` : Sending a ```GET``` request to ```/emails/<mailbox>``` where ```<mailbox>``` is either ```inbox```, ```sent```, or ```archive``` will return back to you (in JSON form) a list of all emails in that mailbox, in reverse chronological order.
+ ```GET /emails/<int:email_id>``` : Sending a ```GET``` request to ```/emails/email_id``` where ```email_id``` is an integer id for an email will return a JSON representation of the email if it exists.
+ ```POST /emails``` : To send an email, a ```POST``` request to the ```/emails``` route is made. This requires three pieces of data to be submitted: a ```recipients``` value (a comma-separated string of all users to send an email to), a ```subject``` string, and a ```body``` string.
+ ```PUT /emails/<int:email_id>``` : Sending```PUT``` request to ```/emails/email_id``` where ```email_id``` is the id of the email you’re trying to modify is used to modify the status of each email.
