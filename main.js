const burgerBtn = document.getElementsByClassName("burger")[0];
const navBarMenu = document.getElementsByClassName("nav_menu")[0];

burgerBtn.addEventListener("click", () => {
  navBarMenu.classList.toggle("active");
  burgerBtn.classList.toggle("active");
});

// const anchorLinks = document.querySelectorAll('a[href^="#"]');

// anchorLinks.forEach ( anchor => {
// anchor.addEventListener("click", function(e){
//   e.preventDefault();

//   document.querySelector(this.getAttribute('href')).scrollIntoView({
//   behavior: 'smooth'
//     });
//   });
// });

// smooth transition on click

const anchorLinks = document.querySelectorAll('a[href^="#"]');

for (let a of anchorLinks) {
  a.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    document.querySelector(targetId).scrollIntoView({
      behavior: "smooth",
    });
  });
}

// list of content
let listContainer = document.getElementsByClassName("list")[0];
// const repArr = ["All You Need Is Love - The Beatles", "Hotel California- Eagles", "Dancing Queen - ABBA", "Firework - Katy Perry"];

// function addListItem(content){
//     const listItem = document.createElement("li");
//     listItem.textContent = content;
//     listContainer.appendChild(listItem);
//     repArr.sort();

// }

// for (let r of repArr){
//  addListItem(r);
//   console.log("prutt");
// }

const dictionary = {};

async function getTracks() {
  const res = await fetch(
    "https://sheets.googleapis.com/v4/spreadsheets/1eRKEVFYd8n8E4RsJA49sNK41otMVttzeyH3-eksbRoM/values/Sheet1?alt=json&key=AIzaSyBLivYxo4bLsqMXwLnTCzupnP6Agy0nk0U"
  );
  const body = await res.json();
  const allSongsInAlphabeticalOrder = body.values.sort();
  // const dictionary = {}

  for (let row of allSongsInAlphabeticalOrder) {
    const songName = row[0];
    if (songName) {
      const firstLetter = songName[0];
      if (dictionary[firstLetter]) {
        dictionary[firstLetter].push(songName);
      } else {
        dictionary[firstLetter] = [songName];
      }
    }
  }

  insertDictionaryIntoDOM(dictionary);
}

function insertDictionaryIntoDOM(dictionaryToInsert) {
  document.querySelector(".letter_list").innerHTML = "";

  for (const letter in dictionaryToInsert) {
    const tracklist = dictionaryToInsert[letter].map(function (t) {
      return `<li>${t}</li>`;
    });

    const tmpl = `
      <div class="songs">
        <h3>${letter}</h3>
        <ol>
          ${tracklist.join("")}
        </ol>
      </div>
    `;

    document.querySelector(".letter_list").innerHTML += tmpl;
  }
}
const searchInputField = document.querySelector(".search");

searchInputField.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const searchString = searchInputField.value;
    const dictionaryWithResults = {};

    for (const letter in dictionary) {
      const tracks = dictionary[letter];
      for (const track of tracks) {
        if (track.toLowerCase().includes(searchString.toLowerCase())) {
          const firstLetter = track[0];
          if (dictionaryWithResults[firstLetter]) {
            dictionaryWithResults[firstLetter].push(track);
          } else {
            dictionaryWithResults[firstLetter] = [track];
          }
        }
      }
    }

    insertDictionaryIntoDOM(dictionaryWithResults);
  }
});

getTracks();
