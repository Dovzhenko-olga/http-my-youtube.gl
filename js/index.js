
const gloAcademyList = document.querySelector('.glo-academy-list');
const trendingList = document.querySelector('.trending-list');
const musicList = document.querySelector('.music-list');

const createCard = (dataVideo) => {

  const imgUrl = dataVideo.snippet.thumbnails.high.url;
  const videoId = typeof dataVideo.id === 'string'?
  dataVideo.id :
  dataVideo.id.videoId;
  const title = dataVideo.snippet.title;
  const viewCount = dataVideo.statistics?.viewCount;
  const dateVideo = dataVideo.snippet.publishedAt;
  const channelTitle = dataVideo.snippet.channelTitle;
 
  const card = document.createElement('div');
  card.classList.add('video-card');
  card.innerHTML = `
            <div class="video-thumb">
              <a class="link-video youtube-modal" href="https://youtu.be/${videoId}">
                <img src="${imgUrl}" alt="" class="thumbnail">
              </a>
            </div>
            
            <h3 class="video-title">${title}
            </h3>
            <div class="video-info">
            <span class="video-counter">
                ${
                  viewCount ?
                  `<span class="video-views">${viewCount}</span>` :
                  ''
                }
                <span class="video-date">${new Date(dateVideo).toLocaleString("ru-Ru")}</span>
              </span>
              <span class="video-channel">${channelTitle}</span>
            </div>
            `;

            // trendingList.querySelector('.video-counter').innerHTML = `<span class="video-views">${dataVideo.statistics.viewCount}</span>`;
  return card;
}

const createList = (wrapper, listVideo) => {
  wrapper.textContent = '';

  listVideo.forEach(item => {
    const card = createCard(item);

    wrapper.append(card);

});

};

createList(gloAcademyList, gloAcademy);
createList(trendingList, trending);
createList(musicList, music);

// youtube API

const authBtn = document.querySelector('.auth-btn');
const userAvatar = document.querySelector('.user-avatar');

const handleSuccessAuth = data => {
  console.log(data);
  authBtn.classList.add('hide');
  userAvatar.classList.remove('hide');
  userAvatar.src = data.getImageUrl();
  userAvatar.alt = data.getName();

  getChanel();
};

const handleNoAuth = () => {
  authBtn.classList.remove('hide');
  userAvatar.classList.add('hide');
  userAvatar.src = '';
  userAvatar.alt = '';
};

const handleAuth = () => {
  gapi.auth2.getAuthInstance().signIn();
};

const handleSignout = () => {
  gapi.auth2.getAuthInstance().signOut();
}

const updateStatusAuth = data => {
  data.isSignedIn.listen(() => {
    updateStatusAuth(data);
  });
  if (data.isSignedIn.get()) {
    const userData = data.currentUser.get().getBasicProfile();
    handleSuccessAuth(userData);
  } else {
    handleNoAuth();
  }
}

function initClient() {
  gapi.client.init({
      'apiKey': API_KEY,
      'clientId': CLIENT_ID,
      'scope': 'https://www.googleapis.com/auth/youtube.readonly',
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
  }).then(() => {
    updateStatusAuth(gapi.auth2.getAuthInstance())
    authBtn.addEventListener('click', handleAuth)
    userAvatar.addEventListener('click', handleSignout)
  // })
  // .catch(() => {
  //   authBtn.removeEventListener('click', handleAuth)
  //   userAvatar.removeEventListener('click', handleSignout)
  //   alert('Авторизация невозможна')
  });
}

gapi.load('client:auth2', initClient);

const getChanel = () => {
  gapi.client.youtube.channels.list({
    part: 'snippet, statistics',
    id: 'UCVswRUcKC-M35RzgPRv8qUg',
  }).execute((response) =>{
    console.log(response);
  })
}