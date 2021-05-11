import Cookie from 'js-cookie'

export const saveUserData = (idToken, { email, displayName }) => {
  // const tokenExpiration = Date.now() + expiresIn * 1000
  localStorage.setItem('jwt', idToken)
  // localStorage.setItem('expiresIn', tokenExpiration)
  localStorage.setItem('user', email)
  localStorage.setItem('displayName', displayName)
  Cookie.set('jwt', idToken)
  // Cookie.set('expiresIn', tokenExpiration)
  Cookie.set('Email', email)
  Cookie.set('displayName', displayName)
}

export const getUserFromCookie = (req) => {
  if (!req.headers.cookie) { return }
  const jwtCookie = req.headers.cookie.split(';')
    .find(c => c.trim().startsWith('jwt='))
  if (!jwtCookie) { return }
  const jwt = jwtCookie.split('=')[1]
  return { jwt }
}

export const getUserFromLocalStorage = () => {
  if (localStorage) {
    const jwt = localStorage.getItem('jwt')
    return { jwt }
  }
}

export const clearUserData = () => {
  if (!process.server) {
    localStorage.removeItem('jwt')
  }
  Cookie.remove('jwt')
}
