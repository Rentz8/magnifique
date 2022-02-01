import dataOpen from './data-open'
import analyzePerson from './analyze-person'
import { tmpdir } from 'os'
import { resolve } from 'path'
import { existsSync } from 'fs'
import memberInformationProcess from '../admin/member-information-process'

export default (num: number) => {
  const ana = analyzePerson(num)
  const tempdir = resolve(tmpdir(), `../magnifique/${ana.gradeid}/${ana.classid}/members/${num}.sdbdata`)
  if (existsSync(tempdir)) {
    const ctn = dataOpen(tempdir)
    return {
      status: 'ok',
      details: memberInformationProcess(ctn),
    }
  } else {
    return {
      status: 'error',
      reason: 'not-exists',
    }
  }
}
