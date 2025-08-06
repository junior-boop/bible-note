import { schema } from '../lib/livestore/schema'
import LiveStoreWorker from '@/lib/livestore/worker?worker'
import { LiveStoreProvider } from '@livestore/react'
import { makePersistedAdapter } from '@livestore/adapter-web'
import LiveStoreSharedWorker from '@livestore/adapter-web/shared-worker?sharedworker'
import React from 'react'
import { unstable_batchedUpdates as batchUpdates } from 'react-dom'
// import { useNavigate } from 'react-router-dom'
import { renderBootStatus } from '../lib/livestore/utils'

const resetPersistence = import.meta.env.DEV && new URLSearchParams(window.location.search).get('reset') !== null

if (resetPersistence) {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.delete('reset')
    window.history.replaceState(null, '', `${window.location.pathname}?${searchParams.toString()}`)
}

const adapter = makePersistedAdapter({
    worker: LiveStoreWorker,
    sharedWorker: LiveStoreSharedWorker,
    storage: { type: 'opfs' },
    // NOTE this should only be used for convenience when developing (i.e. via `?reset` in the URL) and is disabled in production
    resetPersistence,
})

export const Provider = ({ children }: { children: React.ReactNode }) => {

    return (
        <LiveStoreProvider schema={schema} adapter={adapter} renderLoading={renderBootStatus} batchUpdates={batchUpdates}>
            {children}
        </LiveStoreProvider>
    )
}