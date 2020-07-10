import "./app.css";
import axios from "axios";
import nyancat from "./nyancat.jpg";

document.addEventListener("DOMContentLoaded", async () => {
  document.body.innerHTML = `<img src="${nyancat}" />`;
  const res = await axios.get("/api/users");
  console.log(res);

  document.body.innerHTML = (res.data || [])
    .map((user) => {
      return `<div>${user.id} : ${user.name}</div>`;
    })
    .join("");
});

// eslint-disable-next-line no-undef
console.log(process.env.NODE_ENV);
// eslint-disable-next-line no-undef
console.log(TWO);

console.log("app.js");
