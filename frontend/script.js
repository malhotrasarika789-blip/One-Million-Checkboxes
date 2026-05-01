const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const usernameInput = document.getElementById("username");
const grid = document.getElementById("grid");
const activeUsersEl = document.getElementById("activeUsers");

const token = localStorage.getItem("token");
let socket = null;

const TOTAL = 1000000;
const VISIBLE = 10000;

let offset = 0;
const state = new Array(TOTAL).fill(false);

/* UI HANDLING */
if (token) {
    usernameInput.style.display = "none";
    loginBtn.style.display = "none";
} else {
    logoutBtn.style.display = "none";
}

/* LOGOUT */
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    location.reload();
});

/* LOGIN */
loginBtn.addEventListener("click", async () => {

    const username = usernameInput.value;

    if (!username) {
        alert("Enter username");
        return;
    }

    try {
        loginBtn.innerText = "Please wait...";
        loginBtn.disabled = true;

        const response = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
        });

        const data = await response.json();

        localStorage.setItem("token", data.token);

        location.reload();

    } catch (err) {
        console.log(err);
        alert("Login failed");

        loginBtn.innerText = "Login";
        loginBtn.disabled = false;
    }
});

/* SOCKET */
if (token) {

    socket = io("http://localhost:5000", {
        auth: { token },
    });

    socket.on("connect", () => {
        console.log("Connected:", socket.id);
    });

    socket.on("disconnect", () => {
        console.log("Disconnected");
    });

    /* ACTIVE USERS */
    socket.on("users-update", (count) => {
        activeUsersEl.innerText = `Active Users: ${count}`;
    });

    /* RENDER FUNCTION */
    function render() {

        grid.innerHTML = "";

        for (let i = offset; i < offset + VISIBLE; i++) {

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = state[i];
            checkbox.dataset.index = i;

            checkbox.addEventListener("change", () => {

                state[i] = checkbox.checked;

                socket.emit("toggle-checkbox", {
                    index: i,
                    checked: checkbox.checked,
                });
            });

            grid.appendChild(checkbox);
        }
    }

    /* INITIAL STATE */
    socket.on("initial-state", (serverState) => {

        for (const index in serverState) {
            state[index] = serverState[index] === "true";
        }

        render();
    });

    /* LIVE UPDATE */
    socket.on("checkbox-updated", (data) => {

        const { index, checked } = data;

        state[index] = checked;

        render();
    });

    /* RATE LIMIT */
    socket.on("rate-limit-exceeded", (data) => {
        alert(data.message);
    });

    /* VIRTUAL SCROLL (1M SUPPORT) */
    window.addEventListener("scroll", () => {

        const newOffset = Math.floor(window.scrollY / 20) * 10;

        if (newOffset !== offset) {
            offset = newOffset;
            render();
        }
    });

} else {
    alert("Please login first");
}