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

const send_email = (e) => {

  // prevent default submission of form
  e.preventDefault();
  const recipients = e["target"][1].value;
  const subject = e["target"][2].value;
  const body = e["target"][3].value;
  // console.log(`${recipients} ${subject} ${body}`);

  // send post request to save email to db
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

const compose_email = (e, sent = false) => {

  var recipients = '',
    subject = '',
    body = '';

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // check if inputs are to be auto filled
  if (e.body !== undefined) {
    recipients = sent ? e['recipients'].join(', ') : e['sender'];
    subject = `Re: ${e['subject']}`;
    body = `On ${e['timestamp']}\n${e['sender']} wrote:\n${e['body']}\n--------------------------------------------------------`;
  }

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = recipients;
  document.querySelector('#compose-subject').value = subject;
  document.querySelector('#compose-body').value = body;
}

const load_mailbox = (mailbox) => {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3 class="py-2">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // if the page is the sent box then to disable the archive button
  const archive = mailbox === "sent";

  // Get the appropriate data
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      const div = document.querySelector('#emails-view');
      emails.forEach(e => {
        // console.log(e);
        const cover = document.createElement('a');
        // add listener to each email
        cover.addEventListener('click', () => displayEmail(e, archive));

        // body of each email in the list
        cover.innerHTML = `
          <div class="mail__value ${e['read'] ? 'mail--read' : 'mail--unread'} p-4">
            <span class="mail__from">${e['sender']}</span>
            <span class="mail__subject"><strong>${e['subject'].slice(0,26)}${e['subject'].length >= 26?'...':''}</strong></span>
            <span class="mail__time"><small>${e['timestamp']}</small></span>
            <button class="icon" ${archive?'style="display:none;"':""}><i class="fa fa-archive"></i></button>
          </div>
        `;
        // add the item to the list
        div.appendChild(cover);
      });
    });
}

const displayEmail = (e, sent) => {
  // console.log(e['id']);

  // if the archive icon clicked then archive the mail and refresh
  if (event.target.closest('.icon')) {
    // console.log("clicked");
    fetch(`/emails/${e['id']}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: !e['archived'],
      })
    }).then(r => load_mailbox(e['archived'] ? 'archive' : 'inbox'));
    return;
  }

  if (e['archived']) return;

  // display one email
  const div = document.querySelector('#emails-view');
  div.innerHTML = `
    <div class="details-grid pt-2">
      <span>Sender: <strong>${e['sender']}</strong></span>
      <span>Recipients: <strong>${e['recipients'].join(', ')}</strong></span>
      <span>Subject: <strong>${e['subject']}</strong></span>
      <span>Time: <strong>${e['timestamp']}</strong></span>
      <hr style="border: 0.5px solid #000; width: 90%; margin-top: 1%; margin-bottom: 1%;">
      <span class="text-center"><strong>${e['body']}</strong></span>
    </div>
  `;

  const button = document.createElement("input");
  button.type = "button";
  button.value = "Reply";
  button.classList.add('btn', 'py-2', 'px-4', 'mt-2', 'reply-button');
  button.onclick = () => reply(e, sent);
  div.appendChild(button);

  // mark as read
  fetch(`/emails/${e['id']}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true,
    })
  });
}

const reply = (e, sent) => {
  compose_email(e, sent);
}