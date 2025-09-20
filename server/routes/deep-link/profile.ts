// use server/routes/deep-link/profile to redirect to server/profile when loaded http://localhost:3000/deep-link/profile
// if there is no server/profile route it loads the page http://localhost:3000/profile
export default defineEventHandler(async (event) => {
  await sendRedirect(event, '/profile', 301)
})
