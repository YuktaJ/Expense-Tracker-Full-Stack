async function loginPage(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let obj = {
        email, password
    }
    try {
        let result = await axios.post("http://localhost:3000/login", obj);

    } catch (error) {
        document.body.innerHTML += `${error}`;
    }
}
