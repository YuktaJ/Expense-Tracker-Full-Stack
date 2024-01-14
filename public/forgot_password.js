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
        let result = await axios.post("http://13.57.190.76:3000/resetPassword", obj);
    } catch (error) {
        console.log(error);
    }
}