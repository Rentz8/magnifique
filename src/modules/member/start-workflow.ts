import dataOpen from '../utils/data-open'
import dataSave from '../utils/data-save'
import analyzePerson from '../utils/analyze-person'
import { resolve } from 'path'
import { tmpdir } from 'os'
import { existsSync } from 'fs'

export default (numb: number, id: string) => {
  const ana = analyzePerson(numb)
  let temppath = resolve(tmpdir(), `../magnifique/${ana.gradeid}/${ana.classid}/members/`)
  if (existsSync(temppath)) {
    try {
      temppath = resolve(temppath, `./${numb}.sdbdata`)
      let cfg = dataOpen(temppath)
      cfg.workflows[id].status = 'working'
      dataSave(temppath, cfg)
      return {
        status: 'ok',
      }
    } catch (e) {
      return {
        status: 'error',
        reason: 'type-error',
        text: <string>e,
      }
    }
  } else {
    return {
      status: 'error',
      reason: 'not-exists',
    }
  }
}
