//This will be logged for every request

export default defineEventHandler((event) => {
  console.log("New request: " + getRequestURL(event));
});
