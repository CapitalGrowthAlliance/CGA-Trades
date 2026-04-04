async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/user/dashboard');
    const text = await res.text();
    console.log(text);
  } catch (e) {
    console.error(e);
  }
}
run();
