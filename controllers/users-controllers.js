const uuid = require('uuid').v4;
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')

DUMMY_USERS = [
    {
        id: 'u1',
        name: 'bob',
        email: 'test@test.com',
        password: 'testpass'
    }
]

const getUsers = (req, res, next) => {
    res.json({users: DUMMY_USERS})
}

const signUp = (req, res, next) => {
    const valErrors = validationResult(req)

    if (!valErrors.isEmpty()) {
        console.log(valErrors)
        throw new HttpError('Invalid inputs', 422)
    }
    
    const {name, email, password} = req.body

    const hasUser = DUMMY_USERS.find(u => u.email === email)
    if (hasUser) {
        throw new HttpError('User already exists', 422)
    }

    const createdUser = {
        id: uuid(),
        name,
        email,
        password
    }

    DUMMY_USERS.push(createdUser)
    res.status(201).json({user: createdUser})

}

const login = (req, res, next) => {
    const { email, password } = req.body

    const identifiedUser = DUMMY_USERS.find(u => u.email === email)

    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('Could not identify user, credentials wrong', 401)
    }

    res.json({message: 'logged in'})
    
}

exports.getUsers = getUsers
exports.signUp = signUp
exports.login = login