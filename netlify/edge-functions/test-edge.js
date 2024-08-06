export default () => {
  console.log("Test Edge Function called");
  return new Response("Hello from Edge Function!", {
    headers: { "Content-Type": "text/plain" },
  });
};
