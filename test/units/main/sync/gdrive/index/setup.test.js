import GDrive from 'main/application/sync/gdrive'
import AuthWindow from 'main/window/authentication'

const mockCloseAuth = jest.fn()
const mockRemoveMenu = jest.fn()
jest.mock('main/window/authentication', () => {
  return jest.fn().mockImplementation(() => {
    return {
      removeMenu: mockRemoveMenu,
      authenticate: jest.fn(() => Promise.resolve('AUTH_CODE')),
      close: mockCloseAuth
    }
  })
})

describe('#setup', () => {
  let sync = new GDrive({})

  test('opens auth window with auth url', () => {
    return sync.setup().then(() => {
      expect(AuthWindow).toHaveBeenCalledWith(
        'https://example.com/google_oauth2'
      )
    })
  })

  test('removes menu from auth window', () => {
    return sync.setup().then(() => {
      expect(mockRemoveMenu).toHaveBeenCalledTimes(1)
    })
  })

  test('closes auth window on authentication done', () => {
    return sync.setup().then(() => {
      expect(mockCloseAuth).toHaveBeenCalledTimes(1)
    })
  })

  test('calls get token with auth code', () => {
    return sync.setup().then(() => {
      expect(sync.auth.auth.getToken).toHaveBeenCalledWith('AUTH_CODE')
    })
  })
})
