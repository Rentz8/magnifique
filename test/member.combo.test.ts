import { randomBytes } from 'crypto'
import { resolve } from 'path'
import transformDate from '../src/modules/utils/transform-date'
import { describe, test, expect } from '@jest/globals'
import addMember from '../src/modules/admin/add-member'
import person from '../src/examples/person'
import analyzePerson from '../src/modules/utils/analyze-person'
import moveToRel from '../src/modules/admin/move-to-rel-member'
import deleteMember from '../src/modules/admin/del-member'
import loginMember from '../src/modules/member/login-member'
import { readFileSync, existsSync } from 'fs'
import dbCreate from '../src/modules/database/db-create'
import { tmpdir } from 'os'
import dataOpen from '../src/modules/utils/data-open'
import getAllMembers from '../src/modules/admin/get-all-members'
import { isEqual } from 'lodash'

dbCreate()

describe('Member Combo Test', () => {
  for (let i = 1; i <= 10; i++) {
    let detail: member
    let memb: {
      number: number
      classid: number
      gradeid: number
    }
    test('Register', () => {
      detail = person()
      memb = {
        number: (parseInt(randomBytes(4).toString('hex'), 16) % 60) + 1,
        classid: (parseInt(randomBytes(4).toString('hex'), 16) % 14) + 1,
        gradeid: transformDate((parseInt(randomBytes(4).toString('hex'), 16) % 2) + 1),
      }
      detail.number = memb.number + memb.classid * 100 + memb.gradeid * 10000
      detail.name = Buffer.from(String(Math.random() * 935345)).toString('base64')
      const lists = {
        departments: ['wersd', 'sdo', 'sfdjwle', 'fsxc'],
        types: ['chairman', 'vice-chairman', 'minister', 'vice-minister', 'clerk'],
      }
      detail.union.position = 'registry'
      detail.union.department = lists.departments[Math.floor(Math.random() * 3) + 1]
      expect(addMember(detail).status).toBe('ok')
      expect(dataOpen(resolve(tmpdir(), '..', 'magnifique', `${memb.gradeid}`, `${memb.classid}`, 'members', `${detail.number}.sdbdata`))).toEqual(detail)
      detail.password = dataOpen(resolve(tmpdir(), '..', 'magnifique', `${memb.gradeid}`, `${memb.classid}`, 'members', `${detail.number}.sdbdata`)).password
    })
    test('Analyze', () => {
      expect(analyzePerson(detail.number)).toEqual(memb)
    })
    test('Login', () => {
      expect(loginMember(detail.number, Buffer.from(String(detail.number)).toString('base64')).status).toBe('ok')
    })
    test('ToTrue', () => {
      const dowhat = ['vice-minister', 'clerk'][Math.floor(Math.random() * 1) + 1]
      detail.union.position = dowhat as 'vice-minister' | 'clerk'
      expect(moveToRel(detail.number, dowhat as 'clerk' | 'vice-minister').status).toEqual('ok')
      expect(dataOpen(resolve(tmpdir(), '..', 'magnifique', `${memb.gradeid}`, `${memb.classid}`, 'members', `${detail.number}.sdbdata`))).toEqual(detail)
    })
    test('Delete', () => {
      expect(deleteMember(detail.number).status).toEqual('ok')
      expect(existsSync(resolve(tmpdir(), '..', 'magnifique', `${memb.gradeid}`, `${memb.classid}`, 'members', `${detail.number}.sdbdata`))).toEqual(false)
    })
  }
})
