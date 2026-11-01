/* Shared form states for the auth prototypes: sign in, sign up, forgot password.
   renderAuth(root, mode) fills root with the fields for that mode. */
window.AUTH_MODES = {
  signin: {
    title: "SIGN IN",
    lede: "Welcome back. Your quizzes are where you left them.",
    fields: [
      { id: "email", label: "Email", type: "email", ph: "you@university.ca" },
      { id: "password", label: "Password", type: "password", aside: '<a href="#forgot" data-mode="forgot" class="link" style="font-size:14px">Forgot password?</a>' },
    ],
    submit: "Sign in",
    alt: 'No account yet? <a href="#signup" data-mode="signup">Create one</a>',
  },
  signup: {
    title: "CREATE AN ACCOUNT",
    lede: "For instructors. Students never need an account; they take quizzes from your link.",
    fields: [
      { id: "email", label: "Email", type: "email", ph: "you@university.ca" },
      { id: "password", label: "Password", type: "password" },
      { id: "repeat", label: "Repeat password", type: "password" },
    ],
    submit: "Create account",
    alt: 'Already have one? <a href="#signin" data-mode="signin">Sign in</a>',
  },
  forgot: {
    title: "RESET PASSWORD",
    lede: "Enter your email and we'll send a link to set a new password.",
    fields: [{ id: "email", label: "Email", type: "email", ph: "you@university.ca" }],
    submit: "Send reset link",
    alt: '<a href="#signin" data-mode="signin">Back to sign in</a>',
  },
};

window.renderAuth = function (root, mode, onMode) {
  const m = AUTH_MODES[mode];
  root.innerHTML = `
    <h1 class="h-display auth-title">${m.title}</h1>
    <p class="prose auth-lede">${m.lede}</p>
    <form class="auth-form" onsubmit="event.preventDefault()">
      ${m.fields.map(f => `
        <div class="field">
          <div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px"><label for="${f.id}">${f.label}</label>${f.aside || ""}</div>
          <input class="input" id="${f.id}" type="${f.type}" placeholder="${f.ph || ""}" autocomplete="off">
        </div>`).join("")}
      <button class="btn" type="submit"><span class="key">Enter</span>${m.submit}</button>
    </form>
    <p class="prose auth-alt">${m.alt}</p>`;
  root.querySelectorAll("[data-mode]").forEach(a => a.onclick = (e) => { e.preventDefault(); onMode(a.dataset.mode); });
};
