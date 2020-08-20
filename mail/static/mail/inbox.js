document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector('#compose-form').addEventListener('submit', (e) => send_email(e));

  // By default, load the inbox
  load_mailbox('inbox');
});

function send_email(e) {
  e.preventDefault();
  const recipients = e["target"][1].value;
  const subject = e["target"][2].value;
  const body = e["target"][3].value;
  // console.log(`${recipients} ${subject} ${body}`);

  fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
      })
    })
    .then(response => response.json())
    .then(result => {
      // Print result
      console.log(result["message"]);
      load_mailbox('sent');
    });

}

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Get the appropriate data
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      const div = document.querySelector('#emails-view');
      emails.forEach(e => {
        console.log(e);

        const cover = document.createElement('div');
        cover.classList.add('card', 'p-4', 'my-4');
        if (e['read'])
          cover.style.background = 'grey';

        const body = document.createElement('div');
        body.classList.add('card-body', 'text-center');

        const title = document.createElement('div');
        title.classList.add('card-title');
        title.innerText = e['sender'];

        const data = document.createElement('div');
        data.classList.add('card-text');
        data.innerText = `${e['subject']}\n${e['timestamp']}`;

        body.append(title, data);

        cover.appendChild(body);

        div.appendChild(cover);
      });
    });
}