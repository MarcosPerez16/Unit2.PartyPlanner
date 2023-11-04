//COHORT API address/ use this to push and pull data
const COHORT = '2308-ACC-PT-WEB-PT';
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;
const state = {
  events: [],
};

//HTML constants
const eventList = document.querySelector('#events');
const addEventForm = document.querySelector('#addEvent');
addEventForm.addEventListener('submit', function (event) {
  event.preventDefault();
  addEvent(event);
});

//sync state with async and render

async function render() {
  await getEvents();
  renderEvents();
}
render();

//Get events info from API

async function getEvents() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch evetns');
    }

    const data = await response.json();
    state.events = data.data;
  } catch (error) {
    console.error(error); //this might need to be a console.log instead of console.error
  }
}

//Render events plus delete button

function renderEvents() {
  if (!state.events.length) {
    eventList.innerHTML = '<li>No events</li>';
    return;
  }
  const eventCards = state.events.map((event) => {
    const li = document.createElement('li');
    li.innerHTML = `
    <h2>${event.name}</h2>
    <p>${event.description}</p>
    <p>${event.location}</p>
    <p>${event.date}</p>
    <button class = 'delete-button' data-event-id='${event.id}'>Delete</button>
    `;
    return li;
  });
  eventList.replaceChildren(...eventCards);
}

//Event listener for delete button

eventList.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-button')) {
    const eventId = event.target.getAttribute('data-event-id');
    deleteEvent(eventId);
  }
});

/**
 * Ask the API to create a new event based on form data
 * @param {Event} event
 */

async function addEvent(event) {
  event.preventDefault();
  try {
    const dateInputValue = new Date(addEventForm.date.value);

    if (isNaN(dateInputValue)) {
      throw new Error('Invalid date format');
    }
    const isoDateString = dateInputValue.toISOString();

    //POST function
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        name: addEventForm.name.value,
        description: addEventForm.description.value,
        location: addEventForm.location.value,
        date: isoDateString,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to create event');
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

//Delete function

async function deleteEvent(eventId) {
  try {
    const response = await fetch(API_URL + `/${eventId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      render();
    } else {
      throw new Error('Failed to delete event');
    }
  } catch (error) {
    console.error(error);
  }
}
