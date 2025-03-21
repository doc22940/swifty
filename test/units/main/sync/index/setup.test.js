import Sync from 'main/application/sync'
import Vault from 'main/application/vault'
import { DateTime } from 'luxon'

jest.mock('main/application/sync/gdrive/index')
jest.mock('application/helpers/encryption')

describe('#setup', () => {
  let sync
  let vault = new Vault()
  let currentTime = DateTime.local()

  const cryptor = {}

  beforeEach(async () => {
    sync = new Sync()
    sync.initialize(cryptor, vault)
    await sync.setup()
  })

  test('calls provider setup', () => {
    expect(sync.provider.setup).toHaveBeenCalled()
  })

  test('pulls data from cloud', () => {
    expect(sync.provider.pull).toHaveBeenCalled()
  })

  test('it checks if pulled data is decryptable', () => {
    expect(vault.isDecryptable).toBeCalledWith(
      {
        entries: [{ id: '1', password: 'password' }],
        updatedAt: DateTime.local().toISO()
      },
      {}
    )
  })

  test('writes merged data to vault', () => {
    expect(vault.write).toBeCalledWith({
      entries: [{ id: '2', password: 'qwerty' }],
      updatedAt: currentTime.toISO()
    })
  })

  test('pushes merged data to cloud', () => {
    expect(sync.provider.push).toBeCalledWith({
      entries: [{ id: '2', password: 'qwerty' }],
      updatedAt: currentTime.toISO()
    })
  })
})
