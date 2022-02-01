import { tmpdir } from 'os'
import { existsSync } from 'fs'
import { resolve } from 'path'
import dataOpen from '../utils/data-open'
import dataSave from '../utils/data-save'
import analyzePerson from '../utils/analyze-person'

export default (numb: number, toPosition: 'clerk' | 'vice-minister') => {
  const ana = analyzePerson(numb)
  const temppath = resolve(tmpdir(), `..`, `magnifique`, `${ana.gradeid}`, `${ana.classid}`, `members`, `${numb}.sdbdata`)
  if (existsSync(temppath)) {
    try {
      let oldData = dataOpen(temppath) as member
      oldData.union.position = toPosition as 'clerk' | 'vice-minister'
      if (toPosition === 'vice-minister') {
        oldData.union.admin = oldData.union.duty
      } else if (toPosition === 'clerk') {
        oldData.union.admin = []
      } else {
        throw '无法转为该身份'
      }
      dataSave(temppath, oldData)
      return {
        status: 'ok',
      }
    } catch (e) {
      return {
        status: 'error',
        reason: 'type-error',
        text: new Error(<string>e).message,
      }
    }
  } else {
    return {
      status: 'error',
      reason: 'not-exists',
    }
  }
}
