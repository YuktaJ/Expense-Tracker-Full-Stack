document.getElementById("forgotPasswordForm").addEventListener("submit", (event) => {
    forgetPassword(event);
})
async function forgetPassword(event) {
    event.preventDefault();
    try {
        let email = document.getElementById("email").value;

        let obj = {
            email
        }
        let result = await axios.post("http://52.53.205.42:3000/resetPassword", obj);
    } catch (error) {
        console.log(error);
    }
}