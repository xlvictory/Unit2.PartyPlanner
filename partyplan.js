const cohort = "2310-GHP-ET-WEB-FT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${cohort}/events`;

const state = {
    events: [],
};

const eventList = document.querySelector("#events");


async function render() {
    await getEvents();
    renderEvents();
};
render();

async function getEvents() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        state.events = json.data;
        return json;
    } catch (error) {
        console.error(error);
    };
};

function renderEvents() {
    if (!state.events.length) {
        eventList.innerHTML = "<li>No Events.</li>";
        return;
    }
    const eventInfo = state.events.map((evnt) => {
        const li = document.createElement("li");
        li.innerHTML = `<h2>${evnt.name}</h2>
     <p>Date & Time: ${evnt.date}</p><p>Location: ${evnt.location}</p>
        <p>${evnt.description}</p>`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Event";
        li.append(deleteButton);
        deleteButton.addEventListener("click", () => deleteEvent(evnt.id))

        return li;
    });
    eventList.replaceChildren(...eventInfo);
}

async function addEvent(event) {
    event.preventDefault();
    try { 
        const addEventForm = document.querySelector("#addEvent");
        console.log(addEventForm.name);
        console.log(addEventForm.date);
        console.log(addEventForm.location);
        console.log(addEventForm.description);
       
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: addEventForm.name.value,
                date: addEventForm.date.value,
                location: addEventForm.location.value,
                description: addEventForm.description.value,
            })
        }); 
        addEventForm.reset();
        if (!response.ok) {
            throw new Error("Couldn't create New Event");
        } render();
    } catch (error) {
        console.error(error);
    };
};

async function deleteEvent(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        })
        render();
    } catch (error) {
        console.error(error)
    }
}

window.addEventListener("load", () => {
    render();
    const addEventForm = document.querySelector("#addEvent");
    addEventForm.addEventListener("submit", addEvent);
});