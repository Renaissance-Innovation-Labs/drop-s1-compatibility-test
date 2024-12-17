import App from "./app"
import InvitationRoute from "./routes/invitation.route"
import TestRoute from "./routes/test.route"

const app = new App([
    new TestRoute(),
    new InvitationRoute()
])

app.listen()