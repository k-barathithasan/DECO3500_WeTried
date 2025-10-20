const qs = new URLSearchParams(location.search)
const id = qs.get('id')

const reviewers = JSON.parse(localStorage.getItem('fv_reviewers_v1') || '[]')
const reviewer = reviewers.find(x => x.id === id)

if (reviewer) {
  document.getElementById('avatar').src = reviewer.avatar
  document.getElementById('name').textContent = reviewer.name
  document.getElementById('handle').textContent = '@' + reviewer.name.toLowerCase().replace(/\s+/g, '_')

  if (reviewer.location) document.getElementById('location').textContent = reviewer.location
  if (reviewer.timezone) document.getElementById('timezone').textContent = reviewer.timezone
  if (reviewer.bio) document.getElementById('bio').textContent = reviewer.bio
}
