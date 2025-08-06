import type { BootStatus } from '@livestore/livestore'
import { SvgSpinnersRingResize } from '../icons'

export const renderBootStatus = (bootStatus: BootStatus) => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-neutral-900 flex flex-col items-center justify-center gap-4 text-sm">
      <div className="flex items-center gap-3 text-xl font-bold">
        <SvgSpinnersRingResize className='h-6 w-6' />
        <span>Bible Note</span>
      </div>
      {bootStatus.stage === 'loading' && <div>Loading...</div>}
      {bootStatus.stage === 'migrating' && (
        <div>
          Migrating tables ({bootStatus.progress.done}/{bootStatus.progress.total})
        </div>
      )}
      {bootStatus.stage === 'rehydrating' && (
        <div>
          Rehydrating state ({bootStatus.progress.done}/{bootStatus.progress.total})
        </div>
      )}
      {bootStatus.stage === 'syncing' && (
        <div>
          Syncing state ({bootStatus.progress.done}/{bootStatus.progress.total})
        </div>
      )}
      {bootStatus.stage === 'done' && <div>Ready</div>}
    </div>
  )
}