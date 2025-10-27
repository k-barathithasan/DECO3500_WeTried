document.getElementById("loginForm").addEventListener("submit", function(event){
  event.preventDefault();

  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let message = document.getElementById("message");

  if(username === "admin" && password === "1234") {
    message.style.color = "var(--color-accent-green)";
    message.textContent = "Login successful! Redirecting...";

    // Wait 1 second before redirecting
    setTimeout(() => {
      window.location.href = "home.html";
    }, 1000);
  } else {
    message.style.color = "var(--color-accent-orange)";
    message.textContent = "Invalid username or password.";
  }
});
