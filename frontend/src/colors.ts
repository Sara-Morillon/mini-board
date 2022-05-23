import { Intent } from '@blueprintjs/core'
import { Status, Type } from './models/Issue'

const types: { [k in Type]: Intent } = {
  bug: 'danger',
  feature: 'warning',
}

const statuses: { [k in Status]: Intent } = {
  todo: 'none',
  doing: 'primary',
  done: 'success',
}

export const colors = { types, statuses }
