
import {
    NavigationButton,
    SourceStateManager,
} from 'paperback-extensions-common'

export const getdefaultStatus = async (stateManager: SourceStateManager): Promise<string[]> => {
    return (await stateManager.retrieve('defaultStatus') as string[]) ?? undefined
}

export const trackerSettings = (stateManager: SourceStateManager): NavigationButton => {
    return createNavigationButton({
        id: 'tracker_settings',
        value: '',
        label: 'Tracker Settings',
        form: createForm({
            onSubmit: (values: any) => {
                return Promise.all([
                    stateManager.store('defaultStatus', values.defaultStatus)
                ]).then()
            },
            validate: () => {
                return Promise.resolve(true)
            },
            sections: () => {
                return Promise.resolve([
                    createSection({
                        id: 'settings',
                        rows: () => {
                            return Promise.all([
                                getdefaultStatus(stateManager)
                            ]).then(async values => {
                                return [
                                    createSelect({
                                        id: 'defaultStatus',
                                        label: 'Default Status',
                                        value: values[0] ?? 'NONE',
                                        displayLabel: (value) => {
                                            switch (value) {
                                                case 'CURRENT': return 'Reading'
                                                case 'PLANNING': return 'Planned'
                                                case 'COMPLETED': return 'Completed'
                                                case 'DROPPED': return 'Dropped'
                                                case 'PAUSED': return 'On-Hold'
                                                case 'REPEATING': return 'Re-Reading'
                                                default: return 'None'
                                            }
                                        },
                                        options: [
                                            'NONE',
                                            'CURRENT',
                                            'PLANNING',
                                            'COMPLETED',
                                            'DROPPED',
                                            'PAUSED',
                                            'REPEATING'
                                        ]
                                    
                                    })
                                ]
                            })
                        }
                    })
                ])
            }
        })
    })
}