const APIURL = 'https://api.github.com/users/'

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

function getUser (username) {
    fetch(APIURL + username)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            createUserCard(data)
            getRepos(username)
        })
        .catch(err => {
            if (err.message.includes('404')) {
                createErrorCard('No profile with this username')
            } else {
                createErrorCard('Problem fetching user')
            }
        });
}

function getRepos(username) {
    fetch(APIURL + username + '/repos?sort=created')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            addReposToCard(data)
        })
        .catch(err => {
            createErrorCard('Problem fetching repos')
        });
}

function createUserCard(user) {
    const userID = user.name || user.login
    const userBio = user.bio ? `<p>${user.bio}</p>` : ''
    const cardHTML = `
    <div class="card">
    <div>
      <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
    </div>
    <div class="user-info">
      <h2>${userID}</h2>
      ${userBio}
      <ul>
        <li>${user.followers} <strong>Followers</strong></li>
        <li>${user.following} <strong>Following</strong></li>
        <li>${user.public_repos} <strong>Repos</strong></li>
        <li><strong><a href="${user.html_url}" target="_blank">Profile</a></strong></li>
      </ul>

      <div id="repos"><p>Top Repositories:</p></div>
    </div>
  </div>
    `
    main.innerHTML = cardHTML
}

function createErrorCard(msg) {
    const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `

    main.innerHTML = cardHTML
}

function addReposToCard(repos) {
    const reposEl = document.getElementById('repos')

    repos
        .slice(0, 8)
        .forEach(repo => {
            const repoEl = document.createElement('a')
            repoEl.classList.add('repo')
            repoEl.href = repo.html_url
            repoEl.target = '_blank'
            repoEl.innerText = repo.name

            reposEl.appendChild(repoEl)
        })
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const user = search.value

    if (user) {
        getUser (user)

        search.value = ''
    }
})